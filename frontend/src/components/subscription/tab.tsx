import { SubscriptionDataTable } from "@/components/subscription/data-table";
import { useFetchSubscriptions } from "@/data/subscription";

export default function SubscriptionTab() {
  const { data, isLoading } = useFetchSubscriptions();

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="space-y-4">
      <SubscriptionDataTable data={data || []} />
    </div>
  );
}
