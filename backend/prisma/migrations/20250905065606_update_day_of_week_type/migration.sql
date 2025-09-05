/*
  Warnings:

  - The `day_of_week` column on the `classes` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterTable
ALTER TABLE "public"."classes" DROP COLUMN "day_of_week",
ADD COLUMN     "day_of_week" "public"."DayOfWeek"[];
