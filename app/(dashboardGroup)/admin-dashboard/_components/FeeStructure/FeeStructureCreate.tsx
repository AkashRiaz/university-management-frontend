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
import { CreateFeeStructureZodSchema } from "@/components/validations/fee-structure.validation";
import { Program } from "@/types/program.type";
import { ISemester } from "@/types/semester.type";
import { IFeeStructure } from "@/types/fee-structure.type";
import {
  createFeeStructureAction,
  updateFeeStructureAction,
} from "../../_actions/feeStructureActions";

type FeeStructureCreateProps = {
  feeStructure?: IFeeStructure;
  programs: Program[];
  semesters: ISemester[];
  trigger?: "add" | "edit";
};

const FeeStructureCreate = ({
  feeStructure,
  programs,
  semesters,
  trigger = "add",
}: FeeStructureCreateProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(feeStructure);

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
        {isEdit ? "Edit" : "Add Fee Structure"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <FeeStructureForm
            key={feeStructure?.id ?? "new"}
            feeStructure={feeStructure}
            programs={programs}
            semesters={semesters}
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

const FeeStructureForm = ({
  feeStructure,
  programs,
  semesters,
  isEdit,
  onClose,
  onSuccess,
}: {
  feeStructure?: IFeeStructure;
  programs: Program[];
  semesters: ISemester[];
  isEdit: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const action = isEdit ? updateFeeStructureAction : createFeeStructureAction;
  const [state, formAction, isSubmitting] = useActionState(action, null);
  const [isPending, startTransition] = useTransition();
  type FeeFormValues = {
    name: string;
    description?: string;
    programId?: string;
    semesterId?: string;
  };
  const defaultValues: FeeFormValues = {
    name: feeStructure?.name ?? "",
    description: feeStructure?.description ?? undefined,
    programId: feeStructure?.programId ?? undefined,
    semesterId: feeStructure?.semesterId ?? undefined,
  };
  const form = useForm({
    defaultValues,
    validators: { onSubmit: CreateFeeStructureZodSchema },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      if (feeStructure?.id) formData.append("id", feeStructure.id);
      formData.append("name", value.name);
      formData.append("description", value.description ?? "");
      formData.append("programId", value.programId ?? "");
      formData.append("semesterId", value.semesterId ?? "");
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
          <FileText className="size-5 text-primary" />
          {isEdit ? "Edit Fee Structure" : "Add Fee Structure"}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update the fee structure information."
            : "Enter the fee structure information."}
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
                  placeholder="e.g. Undergraduate Tuition Fees"
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
                  placeholder="Describe this fee structure"
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

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="programId">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              const selectedProgram = programs.find(
                (program) => program.id === field.state.value,
              );
              return (
                <div className="space-y-2">
                  <Label>Program</Label>
                  <Select
                    value={field.state.value ?? ""}
                    onValueChange={(value) => field.handleChange(value ?? "")}
                  >
                    <SelectTrigger className="w-full" aria-invalid={isInvalid}>
                      <SelectValue placeholder="Select program">
                        {selectedProgram?.name ?? "Select program"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name}
                        </SelectItem>
                      ))}
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

          <form.Field name="semesterId">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              const selectedSemester = semesters.find(
                (semester) => semester.id === field.state.value,
              );
              const getSemesterLabel = (semester: ISemester) =>
                `${semester.name} (${semester.academicYear?.name || "Academic year unavailable"})`;
              return (
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Select
                    value={field.state.value ?? ""}
                    onValueChange={(value) => field.handleChange(value ?? "")}
                  >
                    <SelectTrigger className="w-full" aria-invalid={isInvalid}>
                      <SelectValue placeholder="Select semester">
                        {selectedSemester
                          ? getSemesterLabel(selectedSemester)
                          : "Select semester"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map((semester) => (
                        <SelectItem key={semester.id} value={semester.id}>
                          {getSemesterLabel(semester)}
                        </SelectItem>
                      ))}
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
        </div>

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
            {isEdit ? "Update Fee Structure" : "Create Fee Structure"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default FeeStructureCreate;
