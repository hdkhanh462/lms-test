import { BaseController } from "@/controllers/abstractions/base.controller";
import HttpException from "@/exceptions/http-exception";
import { studentSchema } from "@/validations/schemas/student.schema";
import { Request, Response } from "express";

export default class StudentController extends BaseController {
  public path = "/students";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path, this.createStudent);
    this.router.get(this.path, this.getStudents);
    this.router.get(`${this.path}/:id`, this.getStudentById);
  }

  private getStudentById = async (request: Request, response: Response) => {
    const { id } = request.params;

    const student = await this.prisma.student.findUnique({
      where: { id: Number(id) },
      include: { parent: true },
    });

    if (!student) {
      throw new HttpException(404, `Không tìm thấy học sinh với id '${id}'`);
    }

    return response.status(200).json({
      ...student,
      dob: new Date(student.dob),
    });
  };

  private getStudents = async (request: Request, response: Response) => {
    const students = await this.prisma.student.findMany({
      include: {
        parent: {
          select: {
            name: true,
          },
        },
      },
    });
    return response.status(200).json(students);
  };

  private createStudent = async (request: Request, response: Response) => {
    const { parentId, name, dob, gender, currentGrade } = studentSchema.parse(
      request.body
    );

    const newStudent = await this.prisma.student.create({
      data: {
        parentId: Number(parentId),
        name,
        dob: dob.toLocaleDateString("vi-VN"),
        gender,
        currentGrade,
      },
    });

    return response.status(201).json({
      message: "Tạo học sinh thành công",
      id: newStudent.id,
    });
  };
}
