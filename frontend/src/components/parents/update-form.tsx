import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { useGetParentById, useUpdateParent } from "@/data/parent";
import { parentSchema } from "@/validations/schemas/parent.schema";
import { useEffect } from "react";

const updateSchema = parentSchema.extend({
  id: z.number(),
});

type ParentUpdateInput = z.infer<typeof updateSchema>;

type UpdateParentFormProps = {
  id: number;
};

export default function UpdateParentForm({ id }: UpdateParentFormProps) {
  const { mutate, isPending: isUpdatePending } = useUpdateParent();
  const { data, isLoading: isGetDetailLoading } = useGetParentById(id);

  const form = useForm<ParentUpdateInput>({
    resolver: zodResolver(updateSchema),
    defaultValues: data || {
      id,
      name: "",
      phone: "",
      email: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  function onSubmit(values: ParentUpdateInput) {
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input placeholder="Số điện thoại" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
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
