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
import { useRegisterClass } from "@/data/class";
import {
  classRegisterSchema,
  type ClassRegisterInput,
} from "@/validations/schemas/class.schema";
import { NumberInput } from "@/components/ui/number-input";

export default function RegisterClassForm({ classId }: { classId: number }) {
  const { mutate, isPending } = useRegisterClass(classId);
  const form = useForm<ClassRegisterInput>({
    resolver: zodResolver(classRegisterSchema),
    defaultValues: {
      classId,
    },
  });

  function onSubmit(values: ClassRegisterInput) {
    console.log(values);
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="classId"
          render={({ field }) => (
            <FormItem hidden>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* TODO: Tìm kiếm học sinh và chọn */}
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã học sinh</FormLabel>
              <FormControl>
                <NumberInput placeholder="Nhập mã học sinh" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending || !form.formState.isDirty}>
          {isPending && <Loader2 className="animate-spin" />}
          Đăng ký lớp học
        </Button>
      </form>
    </Form>
  );
}
