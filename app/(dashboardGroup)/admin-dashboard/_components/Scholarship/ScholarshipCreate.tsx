"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { BadgePercent, Loader2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createScholarshipZodSchema } from "@/components/validations/scholarship.validation";
import {
  IScholarship,
  ScholarshipStatus,
  ScholarshipType,
} from "@/types/scholarship.type";
import {
  createScholarshipAction,
  updateScholarshipAction,
} from "../../_actions/scholarshipActions";

type ScholarshipCreateProps = {
  scholarship?: IScholarship;
  trigger?: "add" | "edit";
};

type ScholarshipFormValues = {
  name: string;
  type: ScholarshipType;
  percentage?: number;
  fixedAmount?: number;
  description?: string;
  status?: ScholarshipStatus;
};

const toOptionalNumber = (value: number | string | null | undefined) => {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
};

const ScholarshipCreate = ({
  scholarship,
  trigger = "add",
}: ScholarshipCreateProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(scholarship);

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
        {isEdit ? "Edit" : "Add Scholarship"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <ScholarshipForm
            key={scholarship?.id ?? "new"}
            scholarship={scholarship}
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

const ScholarshipForm = ({
  scholarship,
  isEdit,
  onClose,
  onSuccess,
}: {
  scholarship?: IScholarship;
  isEdit: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const action = isEdit ? updateScholarshipAction : createScholarshipAction;
  const [state, formAction, isSubmitting] = useActionState(action, null);
  const [isPending, startTransition] = useTransition();
  const defaultValues: ScholarshipFormValues = {
    name: scholarship?.name ?? "",
    type: scholarship?.type ?? "MERIT",
    percentage: toOptionalNumber(scholarship?.percentage),
    fixedAmount: toOptionalNumber(scholarship?.fixedAmount),
    description: scholarship?.description ?? undefined,
    status: scholarship?.status ?? "ACTIVE",
  };
  const form = useForm({
    defaultValues,
    validators: { onSubmit: createScholarshipZodSchema },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      if (scholarship?.id) formData.append("id", scholarship.id);
      formData.append("name", value.name);
      formData.append("type", value.type);
      formData.append("percentage", value.percentage?.toString() ?? "");
      formData.append("fixedAmount", value.fixedAmount?.toString() ?? "");
      formData.append("description", value.description ?? "");
      formData.append("status", value.status ?? "ACTIVE");
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
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <BadgePercent className="size-5 text-primary" />
          {isEdit ? "Edit Scholarship" : "Add Scholarship"}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update the scholarship information."
            : "Enter the scholarship information."}
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
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor={field.name}>
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="e.g. Academic Excellence Scholarship"
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

          <form.Field name="type">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="space-y-2">
                  <Label>
                    Type <span className="text-destructive">*</span>
                  </Label>
                  <Select<ScholarshipType>
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value ?? "MERIT")
                    }
                  >
                    <SelectTrigger className="w-full" aria-invalid={isInvalid}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MERIT">Merit</SelectItem>
                      <SelectItem value="NEED_BASED">Need Based</SelectItem>
                      <SelectItem value="ATHLETIC">Athletic</SelectItem>
                      <SelectItem value="GOVERNMENT">Government</SelectItem>
                      <SelectItem value="DEPARTMENT">Department</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
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

          <form.Field name="status">
            {(field) => (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select<ScholarshipStatus>
                  value={field.state.value ?? "ACTIVE"}
                  onValueChange={(value) =>
                    field.handleChange(value ?? "ACTIVE")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="EXPIRED">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="percentage">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Percentage</Label>
                  <Input
                    id={field.name}
                    type="number"
                    min="0.01"
                    max="100"
                    step="0.01"
                    value={field.state.value ?? ""}
                    onChange={(event) => {
                      const value = event.target.value
                        ? Number(event.target.value)
                        : undefined;
                      if (value !== undefined) {
                        form.setFieldValue("fixedAmount", undefined);
                      }
                      field.handleChange(value);
                    }}
                    onBlur={field.handleBlur}
                    placeholder="e.g. 25"
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
          <form.Field name="fixedAmount">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Fixed Amount</Label>
                  <Input
                    id={field.name}
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={field.state.value ?? ""}
                    onChange={(event) => {
                      const value = event.target.value
                        ? Number(event.target.value)
                        : undefined;
                      if (value !== undefined) {
                        form.setFieldValue("percentage", undefined);
                      }
                      field.handleChange(value);
                    }}
                    onBlur={field.handleBlur}
                    placeholder="e.g. 5000"
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
        </div>
        <p className="text-xs text-muted-foreground">
          Provide either a percentage or a fixed amount, not both.
        </p>

        <form.Field name="description">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Description</Label>
              <Textarea
                id={field.name}
                value={field.state.value ?? ""}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                placeholder="Describe this scholarship"
                rows={4}
              />
            </div>
          )}
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
            {isEdit ? "Update Scholarship" : "Create Scholarship"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default ScholarshipCreate;
