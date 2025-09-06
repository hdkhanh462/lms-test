import RegisterClassForm from "@/components/class/register-form";
import { StudentDataTable } from "@/components/student/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useFetchStudentsInClass } from "@/data/class";

export default function StudentListDialog({ classId }: { classId: number }) {
  const { data: students, isLoading } = useFetchStudentsInClass(classId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Danh sách học sinh
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="!container !max-h-[90vh] !overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Danh sách học sinh</DialogTitle>
          <DialogDescription>
            Xem danh sách học sinh trong lớp học.
          </DialogDescription>
        </DialogHeader>
        <RegisterClassForm classId={classId} />
        <StudentDataTable data={students || []} classId={classId} />
      </DialogContent>
    </Dialog>
  );
}
