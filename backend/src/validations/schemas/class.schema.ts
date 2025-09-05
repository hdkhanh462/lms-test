import z from "zod";
import { DayOfWeek } from "@prisma/client";

export enum DayQueryEnum {
  ALL = "ALL",
  WEEKDAY = "WEEKDAY",
  WEEKEND = "WEEKEND",
}

export const dayOfWeekSchema = z.array(z.enum(DayOfWeek)).default([]);
export const dayEnumSchema = z.enum(DayQueryEnum);

export const classQuerySchema = z.object({
  day: dayEnumSchema.default(DayQueryEnum.ALL),
  days: dayOfWeekSchema, // Exact days of the week
});

export type ClassQuery = z.infer<typeof classQuerySchema>;
