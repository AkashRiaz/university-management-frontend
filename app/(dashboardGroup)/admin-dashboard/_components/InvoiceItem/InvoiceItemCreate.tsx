"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { Pencil, Plus, ReceiptText } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IInvoiceItem } from "@/types/invoice-item.type";
import { createInvoiceItemAction, updateInvoiceItemAction } from "../../_actions/invoiceItemActions";

export default function InvoiceItemCreate({ invoiceId, item, trigger = "add" }: { invoiceId: string; item?: IInvoiceItem; trigger?: "add" | "edit" }) {
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(item);
  const router = useRouter();
  return <>
    <Button type="button" variant={isEdit ? "outline" : "default"} size={isEdit ? "sm" : "default"} onClick={() => setOpen(true)}>{isEdit ? <Pencil /> : <Plus />} {isEdit ? "Edit" : "Add Item"}</Button>
    <Dialog open={open} onOpenChange={setOpen}>{open && <InvoiceItemForm key={item?.id ?? "new"} invoiceId={invoiceId} item={item} isEdit={isEdit} onSuccess={() => { setOpen(false); router.refresh(); }} />}</Dialog>
  </>;
}

function InvoiceItemForm({ invoiceId, item, isEdit, onSuccess }: { invoiceId: string; item?: IInvoiceItem; isEdit: boolean; onSuccess: () => void }) {
  const action = isEdit ? updateInvoiceItemAction : createInvoiceItemAction;
  const [state, formAction, submitting] = useActionState(action, null);
  const [pending, startTransition] = useTransition();
  const form = useForm({
    defaultValues: { name: item?.name ?? "", description: item?.description ?? "", quantity: Number(item?.quantity ?? 1), unitPrice: Number(item?.unitPrice ?? 0) },
    onSubmit: async ({ value }) => {
      const data = new FormData();
      if (item?.id) data.append("id", item.id);
      data.append("invoiceId", invoiceId);
      data.append("name", value.name);
      data.append("description", value.description ?? "");
      data.append("quantity", String(value.quantity));
      data.append("unitPrice", String(value.unitPrice));
      startTransition(() => formAction(data));
    },
  });
  useEffect(() => { if (state?.success) { toast.success(state.message); onSuccess(); } else if (state?.success === false) toast.error(state.message); }, [onSuccess, state]);
  const showError = (error: unknown) => String((error as { message?: unknown })?.message ?? error);
  return <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
    <DialogHeader><DialogTitle className="flex items-center gap-2"><ReceiptText className="size-5 text-primary" />{isEdit ? "Edit Invoice Item" : "Add Invoice Item"}</DialogTitle><DialogDescription>{isEdit ? "Update the invoice item information." : "Enter the invoice item information."}</DialogDescription></DialogHeader>
    <form onSubmit={(event) => { event.preventDefault(); form.handleSubmit(); }} className="space-y-4">
      <form.Field name="name">{(field) => <div className="space-y-2"><Label>Name <span className="text-destructive">*</span></Label><Input value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} onBlur={field.handleBlur} />{field.state.meta.errors.map((error, index) => <p key={index} className="text-xs text-destructive">{showError(error)}</p>)}</div>}</form.Field>
      <form.Field name="description">{(field) => <div className="space-y-2"><Label>Description</Label><Textarea value={field.state.value ?? ""} onChange={(event) => field.handleChange(event.target.value)} rows={3} /></div>}</form.Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="quantity">{(field) => <div className="space-y-2"><Label>Quantity <span className="text-destructive">*</span></Label><Input type="number" min={1} step={1} value={field.state.value} onChange={(event) => field.handleChange(Number(event.target.value))} onBlur={field.handleBlur} />{field.state.meta.errors.map((error, index) => <p key={index} className="text-xs text-destructive">{showError(error)}</p>)}</div>}</form.Field>
        <form.Field name="unitPrice">{(field) => <div className="space-y-2"><Label>Unit Price <span className="text-destructive">*</span></Label><Input type="number" min={0} step="0.01" value={field.state.value} onChange={(event) => field.handleChange(Number(event.target.value))} onBlur={field.handleBlur} />{field.state.meta.errors.map((error, index) => <p key={index} className="text-xs text-destructive">{showError(error)}</p>)}</div>}</form.Field>
      </div>
      <div className="flex justify-end gap-2 border-t pt-4"><Button type="button" variant="outline" onClick={() => onSuccess()}>Cancel</Button><Button type="submit" disabled={pending || submitting}>{pending || submitting ? "Saving..." : "Save Item"}</Button></div>
    </form>
  </DialogContent>;
}
