import { BaseController } from "@/controllers/abstractions/base.controller";
import HttpException from "@/exceptions/http-exception";
import { parentSchema } from "@/validations/schemas/parent.schema";
import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

export default class ParentController extends BaseController {
  public path = "/parents";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path, this.createParent);
    this.router.get(this.path, this.getParents);
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

  private getParents = async (request: Request, response: Response) => {
    const parents = await this.prisma.parent.findMany();

    return response.json(parents);
  };

  private createParent = async (request: Request, response: Response) => {
    const { name, phone, email } = parentSchema.parse(request.body);

    try {
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          let field = (error.meta?.target as string[])[0];
          const fieldLabel =
            field === "email"
              ? "Email"
              : field === "phone"
              ? "Số điện thoại"
              : field;
          throw new HttpException(400, `${fieldLabel} đã tồn tại.`);
        }
      }
      throw error;
    }
  };
}
