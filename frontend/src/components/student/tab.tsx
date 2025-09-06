import { useFetchStudents } from "@/data/student";

import { StudentDataTable } from "@/components/student/data-table";

export default function StudentTab() {
  const { data, isLoading, error } = useFetchStudents();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <StudentDataTable data={data || []} />
    </div>
  );
}
