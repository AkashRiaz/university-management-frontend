"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteProgramAction } from "../../_actions/programActions";

const ProgramDelete = ({ programId, programName }: { programId: string; programName: string }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleDelete = async () => {
    const confirmation = await Swal.fire({
      title: "Delete program?",
      text: `You are about to delete ${programName}. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      reverseButtons: true,
    });
    if (!confirmation.isConfirmed) return;
    startTransition(async () => {
      const result = await deleteProgramAction(programId);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else toast.error(result.message);
    });
  };
  return <Button type="button" variant="destructive" size="icon-sm" onClick={handleDelete} disabled={isPending} aria-label={`Delete ${programName}`} title={`Delete ${programName}`}>{isPending ? <Loader2 className="animate-spin" /> : <Trash2 />}</Button>;
};

export default ProgramDelete;
