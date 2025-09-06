import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { DatePicker } from "@/components/date-picker";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetStudentById, useUpdateStudent } from "@/data/student";
import {
  Gender,
  genderOptions,
  updateStudentSchema,
  type StudentWithIdInput,
} from "@/validations/schemas/student.schema";

type UpdateStudentFormProps = {
  id: number;
};

export default function UpdateStudentForm({ id }: UpdateStudentFormProps) {
  const { mutate, isPending } = useUpdateStudent();
  const { data, isLoading: isGetDetailLoading } = useGetStudentById(id);

  const form = useForm<StudentWithIdInput>({
    resolver: zodResolver(updateStudentSchema),
    defaultValues: data || {
      id,
      parentId: 0,
      gender: Gender.Male,
      name: "",
      currentGrade: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        ...data,
        dob: data.dob instanceof Date ? data.dob : new Date(data.dob),
      });
    }
  }, [data, form]);

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
              <FormLabel>Họ và tên</FormLabel>
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
                <DatePicker
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                />
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
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Gender).map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {genderOptions[gender]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

        <Button
          type="submit"
          disabled={
            isPending || isGetDetailLoading || !data || !form.formState.isDirty
          }
        >
          {isPending && <Loader2 className="animate-spin" />}
          Cập nhật
        </Button>
      </form>
    </Form>
  );
}
