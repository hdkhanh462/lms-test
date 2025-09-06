import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useMarkSubscriptionUsed } from "@/data/subscription";

export default function MarkUsedButton({ studentId }: { studentId: number }) {
  const { mutate, isPending } = useMarkSubscriptionUsed(studentId);

  return (
    <DropdownMenuItem
      onClick={() => mutate({ studentId })}
      disabled={isPending}
    >
      {isPending ? "Đang xử lý..." : "Đánh dấu đã học"}
    </DropdownMenuItem>
  );
}
