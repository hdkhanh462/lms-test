import { Request, Response } from "express";

import { BaseController } from "@/controllers/abstractions/base.controller";
import HttpException from "@/exceptions/http-exception";
import { addSubscriptionSchema } from "@/validations/schemas/subscription.schema";

export default class SubscriptionController extends BaseController {
  public path = "/subscriptions";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path, this.createSubscription);
    this.router.patch(`${this.path}/:id/use`, this.markAsUsed);
    this.router.get(this.path, this.getSubscriptions);
    this.router.get(`${this.path}/:id`, this.getSubscriptionByID);
  }

  private createSubscription = async (request: Request, response: Response) => {
    const { studentId, packageName, startDate, endDate, totalSessions } =
      addSubscriptionSchema.parse(request.body);

    const newSubscription = await this.prisma.subscription.create({
      data: {
        studentId,
        packageName,
        startDate,
        endDate,
        totalSessions,
      },
    });

    return response.status(201).json({
      message: "Tạo khóa học thành công",
      id: newSubscription.id,
    });
  };

  private getSubscriptionByID = async (
    request: Request,
    response: Response
  ) => {
    const { id } = request.params;

    const subscriptions = await this.prisma.subscription.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!subscriptions) {
      throw new HttpException(404, "Không tìm thấy khóa học");
    }

    return response.status(200).json(subscriptions);
  };

  private getSubscriptions = async (request: Request, response: Response) => {
    const subscriptions = await this.prisma.subscription.findMany({
      include: { student: { select: { name: true } } },
    });
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
      throw new HttpException(404, "Không tìm thấy khóa học");
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
