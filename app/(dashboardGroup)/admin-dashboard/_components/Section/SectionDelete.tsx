"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { deleteSectionAction } from "../../_actions/sectionActions";

const SectionDelete = ({
  sectionId,
  sectionName,
}: {
  sectionId: string;
  sectionName: string;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleDelete = async () => {
    const confirmation = await Swal.fire({
      title: "Delete section?",
      text: `You are about to delete ${sectionName}. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      reverseButtons: true,
    });
    if (!confirmation.isConfirmed) return;
    startTransition(async () => {
      const result = await deleteSectionAction(sectionId);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else toast.error(result.message);
    });
  };
  return (
    <Button
      type="button"
      variant="destructive"
      size="icon-sm"
      onClick={handleDelete}
      disabled={isPending}
      aria-label={`Delete ${sectionName}`}
      title={`Delete ${sectionName}`}
    >
      {isPending ? <Loader2 className="animate-spin" /> : <Trash2 />}
    </Button>
  );
};

export default SectionDelete;
