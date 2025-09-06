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
import { NumberInput } from "@/components/ui/number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddSubscription } from "@/data/subscription";
import {
  PackageSubscription,
  packageSubscriptionOptions,
  addSubscriptionSchema,
  type AddSubscriptionInput,
} from "@/validations/schemas/subscription.schema";
import { DateRangePicker } from "@/components/date-range-picker";
import { addDays } from "date-fns";

export default function AddSubscriptionForm() {
  const today = new Date();
  const { mutate, isPending } = useAddSubscription();
  const form = useForm<AddSubscriptionInput>({
    resolver: zodResolver(addSubscriptionSchema),
    defaultValues: {
      startDate: today,
      endDate: addDays(today, 7),
    },
  });

  function onSubmit(values: AddSubscriptionInput) {
    console.log(values);
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* TODO: Tìm kiếm học sinh và chọn */}
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã học sinh</FormLabel>
              <FormControl>
                <NumberInput placeholder="Mã học sinh" {...field} />
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

        <FormItem>
          <FormLabel>Ngày học</FormLabel>
          <FormControl>
            <DateRangePicker
              value={{
                from: form.getValues("startDate"),
                to: form.getValues("endDate"),
              }}
              onChange={(value) => {
                console.log(value);
                if (value?.from && value.from instanceof Date) {
                  form.setValue("startDate", value.from);
                }
                if (value?.to && value.to instanceof Date) {
                  form.setValue("endDate", value.to);
                }
              }}
            />
          </FormControl>
          <FormMessage>
            {form.formState.errors.startDate?.message ||
              form.formState.errors.endDate?.message}
          </FormMessage>
        </FormItem>
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

        <Button type="submit" disabled={isPending || !form.formState.isDirty}>
          {isPending && <Loader2 className="animate-spin" />}
          Đăng ký
        </Button>
      </form>
    </Form>
  );
}
