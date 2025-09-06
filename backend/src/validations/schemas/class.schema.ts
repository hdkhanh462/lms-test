import z from "zod";
import { DayOfWeek } from "@prisma/client";

export enum DayQueryEnum {
  ALL = "ALL",
  WEEKDAY = "WEEKDAY",
  WEEKEND = "WEEKEND",
}

export const dayOfWeekSchema = z.array(z.enum(DayOfWeek));
export const dayEnumSchema = z.enum(DayQueryEnum);

export const addClassSchema = z.object({
  subject: z.string().min(2, { message: "Tên lớp phải có ít nhất 2 ký tự." }),
  dayOfWeek: dayOfWeekSchema.min(1, {
    message: "Vui lòng chọn ít nhất một ngày trong tuần.",
  }),
  timeSlot: z.string().regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/, {
    message: "Khung giờ phải có định dạng HH:MM-HH:MM.",
  }),
  teacherName: z
    .string()
    .min(2, { message: "Tên giáo viên phải có ít nhất 2 ký tự." }),
  maxStudents: z
    .number({ message: "Số học sinh tối đa phải là một số." })
    .positive({ message: "Số học sinh tối đa phải lớn hơn 0." }),
});

export const classQuerySchema = z.object({
  day: dayEnumSchema.default(DayQueryEnum.ALL),
  days: dayOfWeekSchema, // Exact days of the week
});

export type ClassQuery = z.infer<typeof classQuerySchema>;
