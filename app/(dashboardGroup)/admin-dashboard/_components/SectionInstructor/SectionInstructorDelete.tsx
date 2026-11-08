"use client";

import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteSectionInstructorAction } from "../../_actions/sectionInstructorActions";

const SectionInstructorDelete = ({
  assignmentId,
  instructorName,
  onDeleted,
}: {
  assignmentId: string;
  instructorName: string;
  onDeleted: () => void;
}) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const confirmation = await Swal.fire({
      title: "Remove instructor?",
      text: `${instructorName} will be removed from this section.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      reverseButtons: true,
    });
    if (!confirmation.isConfirmed) return;
    startTransition(async () => {
      const result = await deleteSectionInstructorAction(assignmentId);
      if (result.success) {
        toast.success(result.message);
        onDeleted();
      } else toast.error(result.message);
    });
  };

  return (
    <Button type="button" variant="destructive" size="icon-sm" onClick={handleDelete} disabled={isPending} aria-label={`Remove ${instructorName}`} title={`Remove ${instructorName}`}>
      {isPending ? <Loader2 className="animate-spin" /> : <Trash2 />}
    </Button>
  );
};

export default SectionInstructorDelete;
