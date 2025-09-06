import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateStudent } from "@/data/student";
import {
  Gender,
  updateStudentSchema,
  type StudentWithIdInput,
} from "@/validations/schemas/student.schema";

type UpdateStudentFormProps = {
  initialData: StudentWithIdInput;
};

export default function UpdateStudentForm({
  initialData,
}: UpdateStudentFormProps) {
  const { mutate, isPending } = useUpdateStudent();

  const form = useForm<StudentWithIdInput>({
    resolver: zodResolver(updateStudentSchema),
    defaultValues: initialData || {
      id: 0,
      name: "",
      dob: "",
      gender: Gender.Other,
      currentGrade: "",
    },
  });

  function onSubmit(values: StudentWithIdInput) {
    console.log(values);
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem hidden>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem hidden>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Họ và tên" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày sinh</FormLabel>
              <FormControl>
                <Input placeholder="Ngày sinh" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giới tính</FormLabel>
              <FormControl>
                <Input placeholder="Giới tính" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currentGrade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Khối hiện tại</FormLabel>
              <FormControl>
                <Input placeholder="Khối hiện tại" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          Cập nhật
        </Button>
      </form>
    </Form>
  );
}
