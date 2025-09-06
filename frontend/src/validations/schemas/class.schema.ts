import z from "zod";

export enum DayOfWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

export enum DayQuery {
  ALL = "ALL",
  WEEKDAY = "WEEKDAY",
  WEEKEND = "WEEKEND",
}

export const dayOfWeekOptions = {
  MONDAY: "Thứ Hai",
  TUESDAY: "Thứ Ba",
  WEDNESDAY: "Thứ Tư",
  THURSDAY: "Thứ Năm",
  FRIDAY: "Thứ Sáu",
  SATURDAY: "Thứ Bảy",
  SUNDAY: "Chủ Nhật",
};

export const dayQueryOptions = {
  ALL: "Tất cả ngày trong tuần",
  WEEKDAY: "Ngày trong tuần",
  WEEKEND: "Cuối tuần",
};

export const dayQuerySchema = z.enum(DayQuery);

export const dayOfWeekSchema = z.array(z.enum(DayOfWeek));

export const classSchema = z.object({
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

export const classUpdateSchema = classSchema.extend({
  id: z.number().int().positive(),
});

export const classRegisterSchema = z.object({
  classId: z.number().int().positive(),
  studentId: z
    .number({ message: "Mã học sinh không hợp lệ." })
    .int()
    .positive({ message: "Mã học sinh không hợp lệ." }),
});

export type ClassInput = z.infer<typeof classSchema>;
export type ClassWithIdInput = z.infer<typeof classUpdateSchema>;
export type ClassRegisterInput = z.infer<typeof classRegisterSchema>;
