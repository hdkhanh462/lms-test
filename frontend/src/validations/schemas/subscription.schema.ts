import z from "zod";

export enum PackageSubscription {
  Basic = "BASIC",
  Standard = "STANDARD",
  Premium = "PREMIUM",
}

export const packageSubscriptionOptions = {
  [PackageSubscription.Basic]: "Cơ bản",
  [PackageSubscription.Standard]: "Tiêu chuẩn",
  [PackageSubscription.Premium]: "Cao cấp",
};

export const addSubscriptionSchema = z
  .object({
    studentId: z
      .number({ message: "Mã học sinh không hợp lệ" })
      .int()
      .positive({ message: "Mã học sinh không hợp lệ" }),
    packageName: z.enum(PackageSubscription, {
      message: "Khóa học không hợp lệ",
    }),
    startDate: z.coerce.date<Date>({ message: "Ngày bắt đầu không hợp lệ" }),
    endDate: z.coerce.date<Date>({ message: "Ngày kết thúc không hợp lệ" }),
    totalSessions: z
      .number({ message: "Tổng số buổi không hợp lệ" })
      .int()
      .positive({ message: "Tổng số buổi phải lớn hơn 0" }),
  })
  .refine((data) => data.endDate > data.startDate, {
    path: ["startDate"],
    message: "Ngày kết thúc phải sau ngày bắt đầu. Vui lòng chọn lại ngày.",
  });

export const subscriptionSchema = addSubscriptionSchema.safeExtend({
  usedSessions: z
    .number()
    .int()
    .min(0, { message: "Số buổi đã sử dụng phải lớn hơn hoặc bằng 0" }),
});

export const updateSubscriptionSchema = subscriptionSchema.safeExtend({
  id: z.number(),
});

export type SubscriptionWithIdInput = z.infer<typeof updateSubscriptionSchema>;

export type SubscriptionWithStudentInput = SubscriptionWithIdInput & {
  student: {
    name: string;
  };
};

export type AddSubscriptionInput = z.infer<typeof addSubscriptionSchema>;
