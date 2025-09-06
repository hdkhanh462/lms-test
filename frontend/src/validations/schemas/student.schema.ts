import z from "zod";

export enum Gender {
  Male = "MALE",
  Female = "FEMALE",
  Other = "OTHER",
}

export const genderOptions = {
  [Gender.Male]: "Nam",
  [Gender.Female]: "Nữ",
  [Gender.Other]: "Khác",
};

export const studentSchema = z.object({
  parentId: z.number(),
  name: z.string().min(2, { message: "Họ và tên phải có ít nhất 2 ký tự." }),
  dob: z.date({ message: "Ngày sinh không hợp lệ." }),
  gender: z.enum(Gender).optional(),
  currentGrade: z.string().min(1, { message: "Lớp hiện tại là bắt buộc." }),
});

export const updateStudentSchema = studentSchema.extend({
  id: z.number(),
});

export type StudentWithIdInput = z.infer<typeof updateStudentSchema>;

export type StudentAddInput = z.infer<typeof studentSchema>;
