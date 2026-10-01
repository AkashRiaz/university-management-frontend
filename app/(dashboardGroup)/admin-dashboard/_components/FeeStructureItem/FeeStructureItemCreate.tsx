"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { ClipboardList, Loader2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateFeeStructureItemFormZodSchema } from "@/components/validations/fee-structure-item.validation";
import { IFeeStructureItem } from "@/types/fee-structure-item.type";
import {
  createFeeStructureItemAction,
  updateFeeStructureItemAction,
} from "../../_actions/feeStructureItemActions";

type FeeStructureItemCreateProps = {
  feeStructureId: string;
  item?: IFeeStructureItem;
  trigger?: "add" | "edit";
};

const FeeStructureItemCreate = ({
  feeStructureId,
  item,
  trigger = "add",
}: FeeStructureItemCreateProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(item);

  return (
    <>
      <Button
        type="button"
        variant={isEdit ? "outline" : "default"}
        size={isEdit ? "sm" : "default"}
        onClick={() => setOpen(true)}
        className="shrink-0 whitespace-nowrap"
      >
        {isEdit ? <Pencil /> : <Plus />}
        {isEdit ? "Edit" : "Add Item"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <FeeStructureItemForm
            key={item?.id ?? "new"}
            feeStructureId={feeStructureId}
            item={item}
            isEdit={isEdit}
            onClose={() => setOpen(false)}
            onSuccess={() => {
              setOpen(false);
              router.refresh();
            }}
          />
        )}
      </Dialog>
    </>
  );
};

const FeeStructureItemForm = ({
  feeStructureId,
  item,
  isEdit,
  onClose,
  onSuccess,
}: {
  feeStructureId: string;
  item?: IFeeStructureItem;
  isEdit: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const action = isEdit
    ? updateFeeStructureItemAction
    : createFeeStructureItemAction;
  const [state, formAction, isSubmitting] = useActionState(action, null);
  const [isPending, startTransition] = useTransition();
  type FeeStructureItemFormValues = {
    name: string;
    description?: string;
    amount: number;
  };
  const defaultValues: FeeStructureItemFormValues = {
    name: item?.name ?? "",
    description: item?.description ?? undefined,
    amount: Number(item?.amount ?? 0),
  };
  const form = useForm({
    defaultValues,
    validators: { onSubmit: CreateFeeStructureItemFormZodSchema },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      if (item?.id) formData.append("id", item.id);
      formData.append("feeStructureId", feeStructureId);
      formData.append("name", value.name);
      formData.append("description", value.description ?? "");
      formData.append("amount", String(value.amount));
      startTransition(() => formAction(formData));
    },
  });

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      onSuccess();
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [onSuccess, state]);

  const loading = isSubmitting || isPending;
  const showError = (error: unknown) =>
    String((error as { message?: unknown })?.message ?? error);

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <ClipboardList className="size-5 text-primary" />
          {isEdit ? "Edit Fee Structure Item" : "Add Fee Structure Item"}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update the fee item information."
            : "Enter the fee item information."}
        </DialogDescription>
      </DialogHeader>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          form.handleSubmit(event);
        }}
        className="space-y-4"
      >
        <form.Field name="name">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="e.g. Tuition Fee"
                  aria-invalid={isInvalid}
                  className={
                    isInvalid
                      ? "border-destructive focus-visible:ring-destructive/30"
                      : ""
                  }
                />
                {isInvalid &&
                  field.state.meta.errors.map((error, index) => (
                    <p key={index} className="text-xs text-destructive">
                      {showError(error)}
                    </p>
                  ))}
              </div>
            );
          }}
        </form.Field>

        <form.Field name="description">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Description</Label>
                <Textarea
                  id={field.name}
                  value={field.state.value ?? ""}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Describe this fee item"
                  rows={4}
                  aria-invalid={isInvalid}
                  className={
                    isInvalid
                      ? "border-destructive focus-visible:ring-destructive/30"
                      : ""
                  }
                />
                {isInvalid &&
                  field.state.meta.errors.map((error, index) => (
                    <p key={index} className="text-xs text-destructive">
                      {showError(error)}
                    </p>
                  ))}
              </div>
            );
          }}
        </form.Field>

        <form.Field name="amount">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  Amount <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={field.name}
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={field.state.value}
                  onChange={(event) =>
                    field.handleChange(Number(event.target.value))
                  }
                  onBlur={field.handleBlur}
                  placeholder="0.00"
                  aria-invalid={isInvalid}
                  className={
                    isInvalid
                      ? "border-destructive focus-visible:ring-destructive/30"
                      : ""
                  }
                />
                {isInvalid &&
                  field.state.meta.errors.map((error, index) => (
                    <p key={index} className="text-xs text-destructive">
                      {showError(error)}
                    </p>
                  ))}
              </div>
            );
          }}
        </form.Field>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            {isEdit ? "Update Item" : "Create Item"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default FeeStructureItemCreate;
