import { BaseController } from "@/controllers/abstractions/base.controller";
import HttpException from "@/exceptions/http-exception";
import { Request, Response } from "express";

export default class ParentController extends BaseController {
  public path = "/parents";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path, this.createParent);
    this.router.get(`${this.path}/:id`, this.getParentById);
  }

  private getParentById = async (request: Request, response: Response) => {
    const { id } = request.params;

    // TODO: Add validation for id

    const parent = await this.prisma.parent.findUnique({
      where: { id: Number(id) },
    });

    if (!parent) {
      throw new HttpException(404, "Không tìm thấy phụ huynh");
    }

    return response.status(200).json(parent);
  };

  private createParent = async (request: Request, response: Response) => {
    const { name, phone, email } = request.body;

    // TODO: Add validation for name and email

    const newParent = await this.prisma.parent.create({
      data: {
        name,
        phone,
        email,
      },
    });

    return response.status(201).json({
      message: "Tạo phụ huynh thành công",
      id: newParent.id,
    });
  };
}
