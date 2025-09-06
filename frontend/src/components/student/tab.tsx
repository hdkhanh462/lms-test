import { useFetchStudents } from "@/data/student";

import { StudentDataTable } from "@/components/student/data-table";

export default function StudentTab() {
  const { data, isLoading } = useFetchStudents();

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="space-y-4">
      <StudentDataTable data={data || []} />
    </div>
  );
}
