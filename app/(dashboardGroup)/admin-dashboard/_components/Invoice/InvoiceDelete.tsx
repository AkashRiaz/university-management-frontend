"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteInvoiceAction } from "../../_actions/invoiceActions";

const InvoiceDelete = ({ invoiceId, invoiceName }: { invoiceId: string; invoiceName: string }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleDelete = async () => {
    const confirmation = await Swal.fire({
      title: "Delete invoice?",
      text: `You are about to delete ${invoiceName}. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      reverseButtons: true,
    });
    if (!confirmation.isConfirmed) return;
    startTransition(async () => {
      const result = await deleteInvoiceAction(invoiceId);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else toast.error(result.message);
    });
  };
  return (
    <Button type="button" variant="destructive" size="icon-sm" onClick={handleDelete} disabled={isPending} aria-label={`Delete ${invoiceName}`} title={`Delete ${invoiceName}`}>
      {isPending ? <Loader2 className="animate-spin" /> : <Trash2 />}
    </Button>
  );
};

export default InvoiceDelete;
