import { ParentDataTable } from "@/components/parents/data-table";
import { useFetchParents } from "@/data/parent";

export default function ParentTab() {
  const { data, isLoading } = useFetchParents();

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="space-y-4">
      <ParentDataTable data={data || []} />
    </div>
  );
}
