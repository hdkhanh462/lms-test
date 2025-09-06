import { ParentDataTable } from "@/components/parents/data-table";
import { useFetchParents } from "@/data/parent";

export default function ParentTab() {
  const { data, isLoading, error } = useFetchParents();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <ParentDataTable data={data || []} />
    </div>
  );
}
