"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Building2, Loader2, Pencil, Plus } from "lucide-react";
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
  createFacultyAction,
  updateFacultyAction,
} from "../../_actions/facultyActions";
import { FacultySchema } from "@/components/validations/faculty.validation";
import { IFaculty } from "@/types/faculty.type";

type FacultyCreateProps = {
  faculty?: IFaculty;
  trigger?: "add" | "edit";
};

const FacultyCreate = ({ faculty, trigger = "add" }: FacultyCreateProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(faculty);

  return (
    <>
      <Button
        type="button"
        variant={isEdit ? "outline" : "default"}
        size={isEdit ? "sm" : "default"}
        onClick={() => setOpen(true)}
      >
        {isEdit ? <Pencil /> : <Plus />}
        {isEdit ? "Edit" : "Add Faculty"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <FacultyForm
            key={faculty?.id ?? "new"}
            faculty={faculty}
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

const FacultyForm = ({
  faculty,
  isEdit,
  onClose,
  onSuccess,
}: {
  faculty?: IFaculty;
  isEdit: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const action = isEdit ? updateFacultyAction : createFacultyAction;
  const [state, formAction, isSubmitting] = useActionState(action, null);
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    defaultValues: {
      name: faculty?.name ?? "",
      code: faculty?.code ?? "",
      description: faculty?.description ?? "",
    },
    validators: { onSubmit: FacultySchema },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      if (faculty?.id) formData.append("id", faculty.id);
      formData.append("name", value.name);
      formData.append("code", value.code);
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

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Building2 className="size-5 text-primary" />
          {isEdit ? "Edit Faculty" : "Add Faculty"}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update the faculty information."
            : "Enter the faculty information."}
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
                placeholder="Enter faculty name"
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
        <form.Field name="code">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>
                Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id={field.name}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                placeholder="Enter faculty code"
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
        <form.Field name="description">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Description</Label>
              <Textarea
                id={field.name}
                value={field.state.value ?? ""}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                placeholder="Write a short description"
                rows={4}
              />
            </div>
          )}
        </form.Field>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || isSubmitting}>
            {(isPending || isSubmitting) && (
              <Loader2 className="animate-spin" />
            )}
            {isEdit ? "Save Changes" : "Create Faculty"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default FacultyCreate;
