"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { confirmDialog, preloadConfirmDialog } from "@/lib/confirm";
import { Button } from "@/components/ui/button";
import { deleteFacultyAction } from "../../_actions/facultyActions";

type FacultyDeleteProps = {
  facultyId: string;
  facultyName: string;
};

const FacultyDelete = ({ facultyId, facultyName }: FacultyDeleteProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const confirmation = await confirmDialog({
      title: "Delete faculty?",
      text: `You are about to delete ${facultyName}. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      reverseButtons: true,
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    startTransition(async () => {
      const result = await deleteFacultyAction(facultyId);

      if (result.success) {
        toast.success(result.message);
        router.refresh();
        return;
      }

      toast.error(result.message);
    });
  };

  return (
    <Button
      type="button"
      variant="destructive"
      size="icon-sm"
      onClick={handleDelete}
      onPointerEnter={preloadConfirmDialog}
      onFocus={preloadConfirmDialog}
      disabled={isPending}
      aria-label={`Delete ${facultyName}`}
      title={`Delete ${facultyName}`}
    >
      {isPending ? <Loader2 className="animate-spin" /> : <Trash2 />}
    </Button>
  );
};

export default FacultyDelete;
