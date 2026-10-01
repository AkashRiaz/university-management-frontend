"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { FileText, Loader2, Pencil, Plus } from "lucide-react";
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
import {
  createGradeScaleAction,
  updateGradeScaleAction,
} from "../../_actions/gradeScaleActions";
import { createGradeScaleZodSchema } from "@/components/validations/grade-schale.validation";
import { IGradeScale } from "@/types/grade-scale.type";

type GradeScaleCreateProps = {
  gradeScale?: IGradeScale;
  trigger?: "add" | "edit";
};

const GradeScaleCreate = ({
  gradeScale,
  trigger = "add",
}: GradeScaleCreateProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(gradeScale);

  return (
    <>
      <Button
        type="button"
        variant={isEdit ? "outline" : "default"}
        size={isEdit ? "sm" : "default"}
        onClick={() => setOpen(true)}
      >
        {isEdit ? <Pencil /> : <Plus />}
        {isEdit ? "Edit" : "Add Grade Scale"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <GradeScaleForm
            key={gradeScale?.id ?? "new"}
            gradeScale={gradeScale}
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

const GradeScaleForm = ({
  gradeScale,
  isEdit,
  onClose,
  onSuccess,
}: {
  gradeScale?: IGradeScale;
  isEdit: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const action = isEdit ? updateGradeScaleAction : createGradeScaleAction;
  const [state, formAction, isSubmitting] = useActionState(action, null);
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    defaultValues: {
      name: gradeScale?.name ?? "",
      description: gradeScale?.description ?? "",
    },
    validators: { onSubmit: createGradeScaleZodSchema },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      if (gradeScale?.id) formData.append("id", gradeScale.id);
      formData.append("name", value.name);
      formData.append("description", value.description ?? "");
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

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <FileText className="size-5 text-primary" />
          {isEdit ? "Edit Grade Scale" : "Add Grade Scale"}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update the grade scale information."
            : "Enter the grade scale information."}
        </DialogDescription>
      </DialogHeader>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
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
                  placeholder="e.g. Undergraduate Grading Scale"
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
                      {String(error?.message ?? error)}
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
                  placeholder="Describe when this scale is used"
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
                      {String(error?.message ?? error)}
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
            {isEdit ? "Update Grade Scale" : "Create Grade Scale"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default GradeScaleCreate;
