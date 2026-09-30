"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { CalendarDays, Loader2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createAcademicYearAction,
  updateAcademicYearAction,
} from "../../_actions/academicYearActions";
import { CreateAcademicYearZodSchema } from "@/components/validations/academic-year.validation";
import { IAcademicYear } from "@/types/academic-year.type";

type AcademicYearCreateProps = {
  academicYear?: IAcademicYear;
  trigger?: "add" | "edit";
};

const getDateInputValue = (date?: string) => {
  if (!date) {
    return "";
  }

  return date.slice(0, 10);
};

const AcademicYearCreate = ({
  academicYear,
  trigger = "add",
}: AcademicYearCreateProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(academicYear);

  return (
    <>
      <Button
        type="button"
        variant={isEdit ? "outline" : "default"}
        size={isEdit ? "sm" : "default"}
        onClick={() => setOpen(true)}
      >
        {isEdit ? <Pencil /> : <Plus />}
        {isEdit ? "Edit" : "Add Academic Year"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <AcademicYearForm
            key={academicYear?.id ?? "new"}
            academicYear={academicYear}
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

const AcademicYearForm = ({
  academicYear,
  isEdit,
  onClose,
  onSuccess,
}: {
  academicYear?: IAcademicYear;
  isEdit: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const action = isEdit ? updateAcademicYearAction : createAcademicYearAction;
  const [state, formAction, isSubmitting] = useActionState(action, null);
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    defaultValues: {
      name: academicYear?.name ?? "",
      startDate: getDateInputValue(academicYear?.startDate),
      endDate: getDateInputValue(academicYear?.endDate),
    },
    validators: { onSubmit: CreateAcademicYearZodSchema },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      if (academicYear?.id) {
        formData.append("id", academicYear.id);
      }
      formData.append("name", value.name);
      formData.append("startDate", value.startDate);
      formData.append("endDate", value.endDate);

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

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <CalendarDays className="size-5 text-primary" />
          {isEdit ? "Edit Academic Year" : "Add Academic Year"}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update the academic year information."
            : "Enter the academic year information."}
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
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id={field.name}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                placeholder="Enter academic year name"
                aria-invalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.map((error, index) => (
                  <p key={index} className="text-xs text-destructive">
                    {String(error?.message)}
                  </p>
                ))}
            </div>
          )}
        </form.Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="startDate">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  Start Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={field.name}
                  type="date"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={
                    field.state.meta.isTouched && !field.state.meta.isValid
                  }
                />
                {field.state.meta.isTouched &&
                  field.state.meta.errors.map((error, index) => (
                    <p key={index} className="text-xs text-destructive">
                      {String(error?.message)}
                    </p>
                  ))}
              </div>
            )}
          </form.Field>

          <form.Field name="endDate">
            {(field) => {
              const isValid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>
                    End Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={field.name}
                    type="date"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={isValid}
                  />
                  {isValid &&
                    field.state.meta.errors.map((error, index) => (
                      <p key={index} className="text-xs text-destructive">
                        {String(error?.message)}
                      </p>
                    ))}
                </div>
              );
            }}
          </form.Field>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || isSubmitting}>
            {(isPending || isSubmitting) && (
              <Loader2 className="animate-spin" />
            )}
            {isEdit ? "Save Changes" : "Create Academic Year"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default AcademicYearCreate;
