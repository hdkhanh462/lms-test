import { Request, Response } from "express";

import { BaseController } from "@/controllers/abstractions/base.controller";
import HttpException from "@/exceptions/http-exception";

export default class SubscriptionController extends BaseController {
  public path = "/subscriptions";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path, this.createSubscription);
    this.router.patch(`${this.path}/:id/use`, this.markAsUsed);
    this.router.get(`${this.path}/:id`, this.getSubscriptions);
  }

  /**
   * Kiểm tra ngày bắt đầu và ngày kết thúc hợp lệ.
   * @param startDate - Ngày bắt đầu (Date hoặc string).
   * @param endDate - Ngày kết thúc (Date hoặc string).
   * @throws HttpException nếu ngày không hợp lệ.
   */
  private validateSubscriptionDates(
    startDate: string | Date,
    endDate: string | Date
  ) {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new HttpException(400, "Ngày bắt đầu hoặc kết thúc không hợp lệ");
    }
    if (start < now) {
      throw new HttpException(400, "Ngày bắt đầu phải là ngày trong tương lai");
    }
    if (end < start) {
      throw new HttpException(400, "Ngày kết thúc phải sau ngày bắt đầu");
    }

    return { start, end };
  }

  private createSubscription = async (request: Request, response: Response) => {
    const { studentId, packageName, startDate, endDate, totalSessions } =
      request.body;

    const { start, end } = this.validateSubscriptionDates(startDate, endDate);

    const newSubscription = await this.prisma.subscription.create({
      data: {
        studentId: Number(studentId),
        packageName,
        startDate: start,
        endDate: end,
        totalSessions: Number(totalSessions),
      },
    });

    return response.status(201).json({
      message: "Tạo gói học thành công",
      id: newSubscription.id,
    });
  };

  private getSubscriptions = async (request: Request, response: Response) => {
    const { id } = request.params;
    const { studentId } = request.body;

    const subscriptions = await this.prisma.subscription.findUnique({
      where: {
        id: Number(id),
        studentId: Number(studentId),
      },
    });

    if (!subscriptions) {
      throw new HttpException(404, "Không tìm thấy gói học");
    }

    return response.status(200).json(subscriptions);
  };

  private markAsUsed = async (request: Request, response: Response) => {
    const { id } = request.params;
    const { studentId } = request.body;

    const subscription = await this.prisma.subscription.findUnique({
      where: {
        id: Number(id),
        studentId: Number(studentId),
      },
    });

    if (!subscription) {
      throw new HttpException(404, "Không tìm thấy gói học");
    }

    if (subscription.usedSessions >= subscription.totalSessions) {
      throw new HttpException(400, "Gói học đã hết số buổi học");
    }

    await this.prisma.subscription.update({
      where: {
        id: Number(id),
        studentId: Number(studentId),
      },
      data: {
        usedSessions: { increment: 1 },
      },
    });

    return response
      .status(200)
      .json({ message: "Đánh dấu sử dụng buổi học thành công" });
  };
}
