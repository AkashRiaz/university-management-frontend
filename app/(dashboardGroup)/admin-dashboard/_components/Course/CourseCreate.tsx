"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { BookOpenCheck, Loader2, Pencil, Plus } from "lucide-react";
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
import {
  createCourseAction,
  updateCourseAction,
} from "../../_actions/courseActions";
import { CreateCourseZodSchema } from "@/components/validations/course.validation";
import { IDepartment } from "@/types/department.type";
import { CourseLevel, CourseType, ICourse } from "@/types/course.type";

type CourseCreateProps = {
  course?: ICourse;
  departments: IDepartment[];
  trigger?: "add" | "edit";
};

const CourseCreate = ({
  course,
  departments,
  trigger = "add",
}: CourseCreateProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(course);

  return (
    <>
      <Button
        type="button"
        variant={isEdit ? "outline" : "default"}
        size={isEdit ? "sm" : "default"}
        onClick={() => setOpen(true)}
      >
        {isEdit ? <Pencil /> : <Plus />}
        {isEdit ? "Edit" : "Add Course"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <CourseForm
            key={course?.id ?? "new"}
            course={course}
            departments={departments}
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

const CourseForm = ({
  course,
  departments,
  isEdit,
  onClose,
  onSuccess,
}: {
  course?: ICourse;
  departments: IDepartment[];
  isEdit: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const action = isEdit ? updateCourseAction : createCourseAction;
  const [state, formAction, isSubmitting] = useActionState(action, null);
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    defaultValues: {
      code: course?.code ?? "",
      title: course?.title ?? "",
      description: course?.description ?? "",
      credit: course?.credit ?? 1,
      courseType: course?.courseType ?? "THEORY",
      courseLevel: course?.courseLevel ?? "UNDERGRADUATE",
      departmentId: course?.departmentId ?? "",
    },
    validators: { onSubmit: CreateCourseZodSchema },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      if (course?.id) formData.append("id", course.id);
      formData.append("code", value.code);
      formData.append("title", value.title);
      formData.append("description", value.description ?? "");
      formData.append("credit", String(value.credit));
      formData.append("courseType", value.courseType);
      formData.append("courseLevel", value.courseLevel);
      formData.append("departmentId", value.departmentId);
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
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <BookOpenCheck className="size-5 text-primary" />
          {isEdit ? "Edit Course" : "Add Course"}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update the course information."
            : "Enter the course information."}
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
                  placeholder="e.g. CSE101"
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
          <form.Field name="credit">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  Credit <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={field.name}
                  type="number"
                  min="0.01"
                  max="99.99"
                  step="0.01"
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
        </div>

        <form.Field name="title">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id={field.name}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                placeholder="Enter course title"
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
              {field.state.meta.isTouched &&
                field.state.meta.errors.map((error, index) => (
                  <p key={index} className="text-xs text-destructive">
                    {showError(error)}
                  </p>
                ))}
            </div>
          )}
        </form.Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <form.Field name="courseType">
            {(field) => (
              <div className="space-y-2">
                <Label>
                  Course Type <span className="text-destructive">*</span>
                </Label>
                <Select<CourseType>
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value ?? "THEORY")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="THEORY">Theory</SelectItem>
                    <SelectItem value="LAB">Lab</SelectItem>
                    <SelectItem value="PROJECT">Project</SelectItem>
                    <SelectItem value="THESIS">Thesis</SelectItem>
                    <SelectItem value="SEMINAR">Seminar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>
          <form.Field name="courseLevel">
            {(field) => (
              <div className="space-y-2">
                <Label>
                  Course Level <span className="text-destructive">*</span>
                </Label>
                <Select<CourseLevel>
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value ?? "UNDERGRADUATE")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UNDERGRADUATE">Undergraduate</SelectItem>
                    <SelectItem value="POSTGRADUATE">Postgraduate</SelectItem>
                    <SelectItem value="PHD">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>
          <form.Field name="departmentId">
            {(field) => {
                const selectedDepartment = departments.find(
                  (dept) => dept.id === field.state.value,
                );
              return (
                <div className="space-y-2">
                  <Label>
                    Department <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value ?? "")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select department">
                        {selectedDepartment?.name ?? "Select department"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem key={department.id} value={department.id}>
                          {department.name}
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
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || isSubmitting}>
            {(isPending || isSubmitting) && (
              <Loader2 className="animate-spin" />
            )}
            {isEdit ? "Save Changes" : "Create Course"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default CourseCreate;
