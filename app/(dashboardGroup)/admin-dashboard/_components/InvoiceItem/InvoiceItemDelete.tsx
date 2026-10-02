"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteInvoiceItemAction } from "../../_actions/invoiceItemActions";

export default function InvoiceItemDelete({ itemId, itemName }: { itemId: string; itemName: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const handleDelete = async () => {
    const result = await Swal.fire({ title: "Delete invoice item?", text: `You are about to delete ${itemName}.`, icon: "warning", showCancelButton: true, confirmButtonText: "Yes, delete it", confirmButtonColor: "#dc2626", reverseButtons: true });
    if (!result.isConfirmed) return;
    startTransition(async () => { const response = await deleteInvoiceItemAction(itemId); if (response.success) { toast.success(response.message); router.refresh(); } else toast.error(response.message); });
  };
  return <Button type="button" variant="destructive" size="icon-sm" disabled={pending} onClick={handleDelete} aria-label={`Delete ${itemName}`} title={`Delete ${itemName}`}>{pending ? <Loader2 className="animate-spin" /> : <Trash2 />}</Button>;
}
