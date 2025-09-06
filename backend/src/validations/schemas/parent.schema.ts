import z from "zod";

export const parentSchema = z.object({
  name: z.string().min(2, { message: "Họ và tên phải có ít nhất 2 ký tự." }),
  phone: z
    .string()
    .min(10, { message: "Số điện thoại không hợp lệ." })
    .max(10, { message: "Số điện thoại không hợp lệ." })
    .regex(/^\d+$/, { message: "Số điện thoại không hợp lệ." }),
  email: z.email({ message: "Email không hợp lệ." }),
});

export type ParentInput = z.infer<typeof parentSchema>;
