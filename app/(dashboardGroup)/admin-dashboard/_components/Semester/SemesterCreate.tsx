"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { CalendarRange, Loader2, Pencil, Plus } from "lucide-react";
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
  createSemesterAction,
  updateSemesterAction,
} from "../../_actions/semesterActions";
import { CreateSemesterZodSchema } from "@/components/validations/semester.validation";
import { IAcademicYear } from "@/types/academic-year.type";
import { ISemester, SemesterName } from "@/types/semester.type";

type SemesterCreateProps = {
  semester?: ISemester;
  academicYears: IAcademicYear[];
  trigger?: "add" | "edit";
};

const getDateInputValue = (date?: string) => date?.slice(0, 10) || "";

const SemesterCreate = ({
  semester,
  academicYears,
  trigger = "add",
}: SemesterCreateProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(semester);

  return (
    <>
      <Button
        type="button"
        variant={isEdit ? "outline" : "default"}
        size={isEdit ? "sm" : "default"}
        onClick={() => setOpen(true)}
      >
        {isEdit ? <Pencil /> : <Plus />}
        {isEdit ? "Edit" : "Add Semester"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <SemesterForm
            key={semester?.id ?? "new"}
            semester={semester}
            academicYears={academicYears}
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

const SemesterForm = ({
  semester,
  academicYears,
  isEdit,
  onClose,
  onSuccess,
}: {
  semester?: ISemester;
  academicYears: IAcademicYear[];
  isEdit: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const action = isEdit ? updateSemesterAction : createSemesterAction;
  const [state, formAction, isSubmitting] = useActionState(action, null);
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    defaultValues: {
      name: semester?.name ?? "SPRING",
      startDate: getDateInputValue(semester?.startDate),
      endDate: getDateInputValue(semester?.endDate),
      registrationStart: getDateInputValue(semester?.registrationStart),
      registrationEnd: getDateInputValue(semester?.registrationEnd),
      status: semester?.status ?? "UPCOMING",
      academicYearId: semester?.academicYearId ?? "",
    },
    validators: { onSubmit: CreateSemesterZodSchema },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      if (semester?.id) formData.append("id", semester.id);
      formData.append("name", value.name);
      formData.append("startDate", value.startDate);
      formData.append("endDate", value.endDate);
      formData.append("registrationStart", value.registrationStart);
      formData.append("registrationEnd", value.registrationEnd);
      formData.append("status", value.status);
      formData.append("academicYearId", value.academicYearId);
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
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <CalendarRange className="size-5 text-primary" />
          {isEdit ? "Edit Semester" : "Add Semester"}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update the semester information."
            : "Enter the semester information."}
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
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label>
                  Semester Name <span className="text-destructive">*</span>
                </Label>
                <Select<SemesterName>
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value ?? "SPRING")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SPRING">Spring</SelectItem>
                    <SelectItem value="SUMMER">Summer</SelectItem>
                    <SelectItem value="FALL">Fall</SelectItem>
                    <SelectItem value="WINTER">Winter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>
          <form.Field name="academicYearId">
            {(field) => {
              const selectedAcademicYear = academicYears.find(
                (ay) => ay.id === field.state.value,
              );
              return (
                <div className="space-y-2">
                  <Label>
                    Academic Year <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value ?? "")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select academic year">
                        {selectedAcademicYear?.name ?? "Select academic year"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.map((academicYear) => (
                        <SelectItem
                          key={academicYear.id}
                          value={academicYear.id}
                        >
                          {academicYear.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            }}
          </form.Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              "startDate",
              "endDate",
              "registrationStart",
              "registrationEnd",
            ] as const
          ).map((fieldName) => (
            <form.Field key={fieldName} name={fieldName}>
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>
                    {fieldName === "startDate"
                      ? "Start Date"
                      : fieldName === "endDate"
                        ? "End Date"
                        : fieldName === "registrationStart"
                          ? "Registration Start"
                          : "Registration End"}
                    <span className="text-destructive"> *</span>
                  </Label>
                  <Input
                    id={field.name}
                    type="date"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.map((error, index) => (
                      <p key={index} className="text-xs text-destructive">
                        {String(
                          (error as { message?: unknown })?.message ?? error,
                        )}
                      </p>
                    ))}
                </div>
              )}
            </form.Field>
          ))}
        </div>

        <form.Field name="status">
          {(field) => (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={field.state.value}
                onValueChange={(value) =>
                  field.handleChange(value ?? "UPCOMING")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPCOMING">Upcoming</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
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
            {isEdit ? "Save Changes" : "Create Semester"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default SemesterCreate;
