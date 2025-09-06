import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
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
import { NumberInput } from "@/components/ui/number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetSubscriptionById,
  useUpdateSubscription,
} from "@/data/subscription";
import {
  PackageSubscription,
  packageSubscriptionOptions,
  updateSubscriptionSchema,
  type SubscriptionWithIdInput,
} from "@/validations/schemas/subscription.schema";

type Props = {
  id: number;
};

export default function UpdateSubscriptionForm({ id }: Props) {
  const { mutate, isPending: isUpdatePending } = useUpdateSubscription();
  const { data, isLoading: isGetDetailLoading } = useGetSubscriptionById(id);

  const form = useForm<SubscriptionWithIdInput>({
    resolver: zodResolver(updateSubscriptionSchema),
    defaultValues: data || {
      id,
      totalSessions: 1,
      usedSessions: 0,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  function onSubmit(values: SubscriptionWithIdInput) {
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
          name="studentId"
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
          name="packageName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Khóa học</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn khóa học" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PackageSubscription).map((pkg) => (
                      <SelectItem key={pkg} value={pkg}>
                        {packageSubscriptionOptions[pkg]}
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
          name="totalSessions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tổng số buổi</FormLabel>
              <FormControl>
                <NumberInput placeholder="Tổng số buổi" {...field} />
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
