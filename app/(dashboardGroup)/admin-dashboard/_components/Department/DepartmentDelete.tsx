"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteDepartmentAction } from "../../_actions/departmentActions";

const DepartmentDelete = ({ departmentId, departmentName }: { departmentId: string; departmentName: string }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleDelete = async () => {
    const confirmation = await Swal.fire({
      title: "Delete department?",
      text: `You are about to delete ${departmentName}. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      reverseButtons: true,
    });
    if (!confirmation.isConfirmed) return;
    startTransition(async () => {
      const result = await deleteDepartmentAction(departmentId);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else toast.error(result.message);
    });
  };
  return <Button type="button" variant="destructive" size="icon-sm" onClick={handleDelete} disabled={isPending} aria-label={`Delete ${departmentName}`} title={`Delete ${departmentName}`}>{isPending ? <Loader2 className="animate-spin" /> : <Trash2 />}</Button>;
};

export default DepartmentDelete;
