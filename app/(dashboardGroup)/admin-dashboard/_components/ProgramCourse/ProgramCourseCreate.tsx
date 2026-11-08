"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { ListTree, Loader2, Pencil, Plus } from "lucide-react";
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
import {
  createProgramCourseAction,
  updateProgramCourseAction,
} from "../../_actions/programCourseActions";
import { CreateProgramCourseZodSchema } from "@/components/validations/program-course.validation";
import { ICourse } from "@/types/course.type";
import { Program } from "@/types/program.type";
import { IProgramCourse } from "@/types/program-course.type";

type ProgramCourseCreateProps = {
  programCourse?: IProgramCourse;
  programs: Program[];
  courses: ICourse[];
  trigger?: "add" | "edit";
};

const ProgramCourseCreate = ({
  programCourse,
  programs,
  courses,
  trigger = "add",
}: ProgramCourseCreateProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(programCourse);

  return (
    <>
      <Button
        type="button"
        variant={isEdit ? "outline" : "default"}
        size={isEdit ? "sm" : "default"}
        className="shrink-0 whitespace-nowrap"
        onClick={() => setOpen(true)}
      >
        {isEdit ? <Pencil /> : <Plus />}
        {isEdit ? "Edit" : "Assign Course"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <ProgramCourseForm
            key={programCourse?.id ?? "new"}
            programCourse={programCourse}
            programs={programs}
            courses={courses}
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

const ProgramCourseForm = ({
  programCourse,
  programs,
  courses,
  isEdit,
  onClose,
  onSuccess,
}: {
  programCourse?: IProgramCourse;
  programs: Program[];
  courses: ICourse[];
  isEdit: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const action = isEdit ? updateProgramCourseAction : createProgramCourseAction;
  const [state, formAction, isSubmitting] = useActionState(action, null);
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    defaultValues: {
      programId: programCourse?.programId ?? "",
      courseId: programCourse?.courseId ?? "",
      semesterNumber: programCourse?.semesterNumber ?? 1,
      isRequired: programCourse?.isRequired ?? false,
    },
    validators: { onSubmit: CreateProgramCourseZodSchema },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      if (programCourse?.id) formData.append("id", programCourse.id);
      formData.append("programId", value.programId);
      formData.append("courseId", value.courseId);
      formData.append("semesterNumber", String(value.semesterNumber));
      formData.append("isRequired", String(value.isRequired));
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

  const showError = (error: unknown) =>
    String((error as { message?: unknown })?.message ?? error);

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <ListTree className="size-5 text-primary" />
          {isEdit ? "Edit Program Course" : "Assign Course to Program"}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update the course assignment information."
            : "Select a program and course to create an assignment."}
        </DialogDescription>
      </DialogHeader>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field name="programId">
          {(field) => {
            const selectedProgram = programs.find(
              (program) => program.id === field.state.value,
            );

            return (
              <div className="space-y-2">
                <Label>
                  Program <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value ?? "")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select program">
                      {selectedProgram
                        ? `${selectedProgram.name || selectedProgram.code || selectedProgram.id}${selectedProgram.department?.code ? ` (${selectedProgram.department.code})` : ""}`
                        : "Select program"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.department?.code
                          ? `${program.name || program.code || program.id} (${program.department.code})`
                          : program.name || program.code || program.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.state.meta.isTouched &&
                  field.state.meta.errors.map((error, index) => (
                    <p key={index} className="text-xs text-destructive">
                      {showError(error)}
                    </p>
                  ))}
              </div>
            );
          }}
        </form.Field>

        <form.Field name="courseId">
          {(field) => {
            const selectedCourse = courses.find(
              (course) => course.id === field.state.value,
            );

            return (
              <div className="space-y-2">
                <Label>
                  Course <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value ?? "")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select course">
                      {selectedCourse
                        ? `${selectedCourse.code} - ${selectedCourse.title}${selectedCourse.department?.code ? ` (${selectedCourse.department.code})` : ""}`
                        : "Select course"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.department?.code
                          ? `${course.code} - ${course.title} (${course.department.code})`
                          : `${course.code} - ${course.title}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.state.meta.isTouched &&
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
          <form.Field name="semesterNumber">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  Semester Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={field.name}
                  type="number"
                  min="1"
                  step="1"
                  value={field.state.value}
                  onChange={(event) =>
                    field.handleChange(Number(event.target.value))
                  }
                  onBlur={field.handleBlur}
                />
                {field.state.meta.isTouched &&
                  field.state.meta.errors.map((error, index) => (
                    <p key={index} className="text-xs text-destructive">
                      {showError(error)}
                    </p>
                  ))}
              </div>
            )}
          </form.Field>

          <form.Field name="isRequired">
            {(field) => (
              <label className="flex items-center gap-3 pt-7 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(event) => field.handleChange(event.target.checked)}
                  className="size-4 accent-primary"
                />
                Required course
              </label>
            )}
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
            {isEdit ? "Save Changes" : "Assign Course"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default ProgramCourseCreate;
