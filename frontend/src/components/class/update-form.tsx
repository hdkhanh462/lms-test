import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

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
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import { useGetClassById, useUpdateClass } from "@/data/class";
import {
  classSchema,
  dayOfWeekOptions,
} from "@/validations/schemas/class.schema";
import { NumberInput } from "@/components/ui/number-input";
const updateSchema = classSchema.extend({
  id: z.number(),
});

type ClassUpdateInput = z.infer<typeof updateSchema>;

type UpdateClassFormProps = {
  id: number;
};

export default function UpdateClassForm({ id }: UpdateClassFormProps) {
  const { mutate, isPending: isUpdatePending } = useUpdateClass();
  const { data, isLoading: isGetDetailLoading } = useGetClassById(id);

  const form = useForm<ClassUpdateInput>({
    resolver: zodResolver(updateSchema),
    defaultValues: data || {
      id,
      subject: "",
      dayOfWeek: [],
      timeSlot: "",
      teacherName: "",
      maxStudents: 1,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  function onSubmit(values: ClassUpdateInput) {
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

        <Button
          type="submit"
          disabled={
            isUpdatePending ||
            isGetDetailLoading ||
            !data ||
            !form.formState.isDirty
          }
        >
          {isUpdatePending && <Loader2 className="animate-spin" />}
          Cập nhật
        </Button>
      </form>
    </Form>
  );
}
