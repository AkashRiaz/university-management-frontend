"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { Award, Loader2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { createGradeZodSchema } from "@/components/validations/grade.validation";
import { IGrade, GradeType } from "@/types/grade.type";
import { IGradeScale } from "@/types/grade-scale.type";
import {
  createGradeAction,
  updateGradeAction,
} from "../../_actions/gradeActions";

type GradeCreateProps = {
  grade?: IGrade;
  gradeScales: IGradeScale[];
  fixedGradeScaleId?: string;
  trigger?: "add" | "edit";
};

const GradeCreate = ({
  grade,
  gradeScales,
  fixedGradeScaleId,
  trigger = "add",
}: GradeCreateProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(grade);

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
        {isEdit ? "Edit" : "Add Grade"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <GradeForm
            key={grade?.id ?? "new"}
            grade={grade}
            gradeScales={gradeScales}
            fixedGradeScaleId={fixedGradeScaleId}
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

const GradeForm = ({
  grade,
  gradeScales,
  fixedGradeScaleId,
  isEdit,
  onClose,
  onSuccess,
}: {
  grade?: IGrade;
  gradeScales: IGradeScale[];
  fixedGradeScaleId?: string;
  isEdit: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const action = isEdit ? updateGradeAction : createGradeAction;
  const [state, formAction, isSubmitting] = useActionState(action, null);
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    defaultValues: {
      letter: grade?.letter ?? "",
      minMarks: Number(grade?.minMarks ?? 0),
      maxMarks: Number(grade?.maxMarks ?? 100),
      gradePoint: Number(grade?.gradePoint ?? 0),
      type: grade?.type ?? "LETTER",
      gradeScaleId: fixedGradeScaleId ?? grade?.gradeScaleId ?? "",
    },
    validators: { onSubmit: createGradeZodSchema },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      if (grade?.id) formData.append("id", grade.id);
      formData.append("letter", value.letter);
      formData.append("minMarks", String(value.minMarks));
      formData.append("maxMarks", String(value.maxMarks));
      formData.append("gradePoint", String(value.gradePoint));
      formData.append("type", value.type);
      formData.append("gradeScaleId", value.gradeScaleId);
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
          <Award className="size-5 text-primary" />
          {isEdit ? "Edit Grade" : "Add Grade"}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update the grade information."
            : "Enter the grade information."}
        </DialogDescription>
      </DialogHeader>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="letter">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>
                    Letter <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="e.g. A+"
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
                  <Select<GradeType>
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value ?? "LETTER")
                    }
                  >
                    <SelectTrigger className="w-full" aria-invalid={isInvalid}>
                      <SelectValue placeholder="Select grade type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LETTER">Letter</SelectItem>
                      <SelectItem value="NUMERIC">Numeric</SelectItem>
                      <SelectItem value="PASS_FAIL">Pass / Fail</SelectItem>
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

        <div className="grid gap-4 sm:grid-cols-3">
          {(["minMarks", "maxMarks", "gradePoint"] as const).map(
            (fieldName) => (
              <form.Field key={fieldName} name={fieldName}>
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  const labels = {
                    minMarks: "Minimum Marks",
                    maxMarks: "Maximum Marks",
                    gradePoint: "Grade Point",
                  };
                  return (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>
                        {labels[fieldName]}{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={field.name}
                        type="number"
                        min="0"
                        step="0.01"
                        value={field.state.value}
                        onChange={(event) =>
                          field.handleChange(Number(event.target.value))
                        }
                        onBlur={field.handleBlur}
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
            ),
          )}
        </div>

        <form.Field name="gradeScaleId">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            const selectedScale = gradeScales.find(
              (scale) => scale.id === field.state.value,
            );
            return (
              <div className="space-y-2">
                <Label>
                  Grade Scale <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value ?? "")}
                >
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={isInvalid}
                    disabled={Boolean(fixedGradeScaleId)}
                  >
                    <SelectValue placeholder="Select grade scale">
                      {selectedScale?.name ?? "Select grade scale"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {gradeScales.map((scale) => (
                      <SelectItem key={scale.id} value={scale.id}>
                        {scale.name}
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
                {gradeScales.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Create a grade scale before adding grades.
                  </p>
                )}
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
          <Button type="submit" disabled={loading || gradeScales.length === 0}>
            {loading && <Loader2 className="animate-spin" />}
            {isEdit ? "Update Grade" : "Create Grade"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default GradeCreate;
