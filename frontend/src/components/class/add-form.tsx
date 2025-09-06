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
import { useAddClass } from "@/data/class";
import {
  classSchema,
  dayOfWeekOptions,
  type ClassInput,
} from "@/validations/schemas/class.schema";
import { NumberInput } from "@/components/ui/number-input";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";

export default function AddClassForm() {
  const { mutate, isPending } = useAddClass();
  const form = useForm<ClassInput>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      subject: "",
      dayOfWeek: [],
      timeSlot: "",
      teacherName: "",
      maxStudents: 1,
    },
  });

  function onSubmit(values: ClassInput) {
    console.log(values);
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Môn học</FormLabel>
              <FormControl>
                <Input placeholder="Môn học" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="teacherName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên giáo viên</FormLabel>
              <FormControl>
                <Input placeholder="Tên giáo viên" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maxStudents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số học sinh tối đa</FormLabel>
              <FormControl>
                <NumberInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="timeSlot"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thời gian</FormLabel>
              <FormControl>
                <Input placeholder="Thời gian" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dayOfWeek"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày trong tuần</FormLabel>
              <FormControl>
                <MultiSelect
                  values={field.value}
                  onValuesChange={field.onChange}
                >
                  <MultiSelectTrigger className="w-full">
                    <MultiSelectValue placeholder="Chọn ngày trong tuần..." />
                  </MultiSelectTrigger>
                  <MultiSelectContent>
                    <MultiSelectGroup>
                      {Object.entries(dayOfWeekOptions).map(
                        ([value, label]) => (
                          <MultiSelectItem key={value} value={value}>
                            {label}
                          </MultiSelectItem>
                        )
                      )}
                    </MultiSelectGroup>
                  </MultiSelectContent>
                </MultiSelect>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending || !form.formState.isDirty}>
          {isPending && <Loader2 className="animate-spin" />}
          Thêm mới
        </Button>
      </form>
    </Form>
  );
}
