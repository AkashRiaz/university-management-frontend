"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { restoreStudentAction } from "../../_actions/studentActions";

const StudentRestore = ({
  studentId,
  studentName,
}: {
  studentId: string;
  studentName: string;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRestore = () => {
    startTransition(async () => {
      const result = await restoreStudentAction(studentId);

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      onClick={handleRestore}
      disabled={isPending}
      aria-label={`Restore ${studentName}`}
      title={`Restore ${studentName}`}
    >
      {isPending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <RotateCcw />
      )}
    </Button>
  );
};

export default StudentRestore;
