import { Gender, Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const parentData: Prisma.ParentCreateInput[] = [
  {
    name: "Nguyen Van A",
    phone: "0987654321",
    email: "nguyen.van.a@gmail.com",
  },
  {
    name: "Tran Thi B",
    phone: "0912345678",
    email: "tran.thi.b@gmail.com",
  },
  {
    name: "Le Van C",
    phone: "0909123456",
    email: "le.van.c@gmail.com",
  },
];

const studentData: Prisma.StudentCreateManyInput[] = [
  {
    name: "Nguyen Thi X",
    dob: new Date("2010-05-15").toDateString(),
    gender: Gender.FEMALE,
    currentGrade: "12A",
    parentId: 1,
  },
  {
    name: "Tran Van Y",
    dob: new Date("2011-08-20").toDateString(),
    gender: Gender.MALE,
    currentGrade: "12B",
    parentId: 2,
  },
  {
    name: "Le Thi Z",
    dob: new Date("2012-03-10").toDateString(),
    gender: Gender.FEMALE,
    currentGrade: "12C",
    parentId: 3,
  },
];

const classData: Prisma.ClassCreateInput[] = [
  {
    subject: "Mathematics",
    dayOfWeek: ["MONDAY", "WEDNESDAY", "FRIDAY"],
    timeSlot: "08:00-10:30",
    teacherName: "Mr. John Doe",
    maxStudents: 30,
  },
  {
    subject: "Physics",
    dayOfWeek: ["TUESDAY", "THURSDAY"],
    timeSlot: "10:45-12:15",
    teacherName: "Ms. Jane Smith",
    maxStudents: 1,
  },
  {
    subject: "Chemistry",
    dayOfWeek: ["MONDAY", "THURSDAY"],
    timeSlot: "09:00-10:15",
    teacherName: "Dr. Emily White",
    maxStudents: 30,
  },
];

export async function main() {
  await prisma.$transaction([
    prisma.parent.createMany({ data: parentData }),
    prisma.student.createMany({ data: studentData }),
    prisma.class.createMany({ data: classData }),
  ]);
}

main();
