import { DayOfWeek } from "@prisma/client";
import { Request, Response } from "express";

import { BaseController } from "@/controllers/abstractions/base.controller";
import {
  ClassQuery,
  classQuerySchema,
  dayEnumSchema,
  dayOfWeekSchema,
  DayQueryEnum,
} from "@/validations/schemas/class.schema";
import HttpException from "@/exceptions/http-exception";
import InvalidSlotTimeFormatException from "@/exceptions/class";

const weekday = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
];
const weekend = [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY];
const allDays = [...weekday, ...weekend];

export default class ClassController extends BaseController {
  public path = "/classes";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path, this.createClass);
    this.router.post(`${this.path}/:id/register`, this.registerClass);
    this.router.get(this.path, this.getClasses);
  }

  /**
   * Xử lý truy vấn ngày học, trả về mảng các ngày trong tuần dựa trên tham số truyền vào.
   * @param query - Đối tượng truy vấn gồm day (kiểu enum) và days (mảng ngày cụ thể).
   * @returns Mảng các giá trị DayOfWeek phù hợp với truy vấn.
   */
  private processDayQuery({ day, days }: ClassQuery): DayOfWeek[] {
    if (days.length > 0) {
      return days;
    }

    switch (day) {
      case DayQueryEnum.WEEKDAY:
        return weekday;
      case DayQueryEnum.WEEKEND:
        return weekend;
      case DayQueryEnum.ALL:
        return allDays;
    }
  }

  /**
   * Kiểm tra giờ và phút có hợp lệ không.
   * @param hour - Giờ (0-23)
   * @param minute - Phút (0-59)
   * @returns Trả về true nếu hợp lệ, ngược lại trả về false.
   */
  private isValidTime(hour: number, minute: number): boolean {
    return (
      !isNaN(hour) &&
      !isNaN(minute) &&
      hour >= 0 &&
      hour <= 23 &&
      minute >= 0 &&
      minute <= 59
    );
  }

  /**
   * Kiểm tra hai khung giờ có bị giao nhau (chồng lặp) hay không.
   * @param time1 - Khung giờ thứ nhất, dạng "HH:mm-HH:mm" (ví dụ: "08:00-10:30").
   * @param time2 - Khung giờ thứ hai, dạng "HH:mm-HH:mm" (ví dụ: "09:00-10:15").
   * @returns Trả về true nếu hai khung giờ giao nhau, ngược lại trả về false.
   * @throws InvalidSlotTimeFormatException nếu định dạng không hợp lệ.
   */
  private isTimeOverlap(time1: string, time2: string): boolean {
    const [start1, end1] = time1.split("-").map((t) => t.trim());
    const [start2, end2] = time2.split("-").map((t) => t.trim());

    const toMinutes = (time?: string) => {
      if (!time) return 0;

      const [hour, minute] = time.split(":").map(Number); // chuyển thành số
      if (
        hour === undefined ||
        minute === undefined ||
        !this.isValidTime(hour, minute)
      ) {
        throw new InvalidSlotTimeFormatException(time);
      }
      return hour * 60 + minute;
    };

    const startMinute1 = toMinutes(start1); // 08:00 -> 480m
    const endMinute1 = toMinutes(end1); // 10:30 -> 630m
    const startMinute2 = toMinutes(start2); // 09:00 -> 540m
    const endMinute2 = toMinutes(end2); // 10:15 -> 615m

    return startMinute1 < endMinute2 && startMinute2 < endMinute1; // kiểm tra chồng lắp
  }

  /**
   * Chuẩn hóa chuỗi khung giờ về dạng "HH:mm-HH:mm".
   * Thêm số 0 phía trước nếu cần và kiểm tra định dạng hợp lệ.
   * @param slot - Chuỗi khung giờ, (ví dụ: "8:00-10:30" hoặc "08:00-10:30").
   * @returns Chuỗi khung giờ đã chuẩn hóa, (ví dụ: "08:00-10:30").
   * @throws InvalidSlotTimeFormatException nếu định dạng không hợp lệ.
   */
  private normalizeTimeSlot(slot: string): string {
    const [start, end] = slot.split("-").map((t) => t.trim());

    if (!start || !end) {
      throw new InvalidSlotTimeFormatException(slot);
    }

    const pad = (start: string) => {
      const [hour, minute] = start.split(":").map(Number);
      if (
        hour === undefined ||
        minute === undefined ||
        !this.isValidTime(hour, minute)
      ) {
        throw new InvalidSlotTimeFormatException(start);
      }
      return `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
    };

    return `${pad(start)}-${pad(end)}`;
  }

  private getClasses = async (request: Request, response: Response) => {
    const query = classQuerySchema.parse({
      ...request.query,
      days: request.query.days
        ? Array.isArray(request.query.days)
          ? request.query.days
          : [request.query.days]
        : [],
    });
    const dayOfWeek = this.processDayQuery(query);

    const classes = await this.prisma.class.findMany({
      where: {
        dayOfWeek: dayOfWeek.length > 0 ? { hasSome: dayOfWeek } : undefined,
      },
    });

    return response.status(200).json(classes);
  };

  private createClass = async (request: Request, response: Response) => {
    const { subject, dayOfWeek, timeSlot, teacherName, maxStudents } =
      request.body;

    const normalizedTimeSlot = this.normalizeTimeSlot(timeSlot);
    let validDayOfWeek: DayOfWeek[] = [];

    // Xử lý dayOfWeek có thể là chuỗi hoặc mảng
    if (Array.isArray(dayOfWeek)) {
      validDayOfWeek = dayOfWeekSchema.parse(dayOfWeek);
    } else if (typeof dayOfWeek === "string") {
      validDayOfWeek = this.processDayQuery({
        day: dayEnumSchema.parse(dayOfWeek),
        days: [],
      });
    }

    if (validDayOfWeek.length === 0) {
      throw new HttpException(400, "dayOfWeek cần có ít nhất một ngày hợp lệ");
    }

    const newClass = await this.prisma.class.create({
      data: {
        subject,
        dayOfWeek: validDayOfWeek,
        timeSlot: normalizedTimeSlot,
        teacherName,
        maxStudents: Number(maxStudents),
      },
    });

    return response.status(201).json({
      message: "Tạo lớp học thành công",
      id: newClass.id,
    });
  };

  private registerClass = async (request: Request, response: Response) => {
    const classId = request.params.id;
    const studentId = request.body.studentId;

    // Kiểm tra lớp học có tồn tại không
    const existingClass = await this.prisma.class.findUnique({
      where: { id: Number(classId) },
    });
    if (!existingClass) {
      throw new HttpException(404, "Lớp học không tồn tại");
    }

    // Kiểm tra học sinh đã đăng ký lớp chưa
    const isStudentRegistered = await this.prisma.classRegistration.findFirst({
      where: {
        classId: Number(classId),
        studentId: Number(studentId),
      },
    });
    if (isStudentRegistered) {
      throw new HttpException(
        400,
        `Học sinh với ID '${studentId}' đã đăng ký lớp học này rồi`
      );
    }

    // Kiểm tra số lượng học sinh đã đăng ký
    const registeredStudentsCount = await this.prisma.classRegistration.count({
      where: { classId: Number(classId) },
    });
    if (registeredStudentsCount >= existingClass.maxStudents) {
      throw new HttpException(400, "Lớp học đã đầy");
    }

    // Kiểm tra lich học có bị trùng với lớp khác không
    const isStudentRegisteredInAnotherClass =
      await this.prisma.classRegistration.findMany({
        where: {
          studentId: Number(studentId),
          class: {
            dayOfWeek: { hasSome: existingClass.dayOfWeek },
          },
        },
        include: { class: { select: { timeSlot: true } } }, // Chỉ lấy timeSlot của lớp đã đăng ký
      });
    const hasOverlap = isStudentRegisteredInAnotherClass.some(
      (registration) => {
        return this.isTimeOverlap(
          registration.class.timeSlot,
          existingClass.timeSlot
        );
      }
    );
    if (hasOverlap) {
      throw new HttpException(
        400,
        `Học sinh với ID '${studentId}' có xung đột lịch học với lớp khác`
      );
    }

    // Đăng ký lớp học
    await this.prisma.classRegistration.create({
      data: {
        classId: Number(classId),
        studentId: Number(studentId),
      },
    });

    return response.status(201).json({ message: "Đăng ký lớp học thành công" });
  };
}
