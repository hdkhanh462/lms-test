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
import { useUpdateParent } from "@/data/parent";
import { parentSchema } from "@/validations/schemas/parent.schema";

const updateSchema = parentSchema.extend({
  id: z.number(),
});

type ParentUpdateInput = z.infer<typeof updateSchema>;

type UpdateParentFormProps = {
  initialData: ParentUpdateInput;
};

export default function UpdateParentForm({
  initialData,
}: UpdateParentFormProps) {
  const { mutate, isPending } = useUpdateParent();

  const form = useForm<ParentUpdateInput>({
    resolver: zodResolver(updateSchema),
    defaultValues: initialData || {
      id: 0,
      name: "",
      phone: "",
      email: "",
    },
  });

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
            <FormItem>
              <FormControl>
                <Input {...field} className="hidden" aria-hidden />
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
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

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          Cập nhật
        </Button>
      </form>
    </Form>
  );
}
