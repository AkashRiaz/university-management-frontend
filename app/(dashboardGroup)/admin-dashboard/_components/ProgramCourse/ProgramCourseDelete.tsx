"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { deleteProgramCourseAction } from "../../_actions/programCourseActions";

const ProgramCourseDelete = ({
  programCourseId,
  programCourseName,
}: {
  programCourseId: string;
  programCourseName: string;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const confirmation = await Swal.fire({
      title: "Remove course assignment?",
      text: `You are about to remove ${programCourseName} from this program.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      reverseButtons: true,
    });
    if (!confirmation.isConfirmed) return;

    startTransition(async () => {
      const result = await deleteProgramCourseAction(programCourseId);
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
      variant="destructive"
      size="icon-sm"
      onClick={handleDelete}
      disabled={isPending}
      aria-label={`Remove ${programCourseName}`}
      title={`Remove ${programCourseName}`}
    >
      {isPending ? <Loader2 className="animate-spin" /> : <Trash2 />}
    </Button>
  );
};

export default ProgramCourseDelete;
