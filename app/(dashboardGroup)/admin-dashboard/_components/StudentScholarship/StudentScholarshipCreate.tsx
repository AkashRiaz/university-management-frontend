"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { BadgePercent, Loader2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { createStudentScholarshipZodSchema } from "@/components/validations/student-scholarship.validation";
import {
  IStudentScholarship,
  IStudentScholarshipStudent,
  StudentScholarshipStatus,
} from "@/types/student-scholarship.type";
import { IScholarship } from "@/types/scholarship.type";
import { ISemester } from "@/types/semester.type";
import {
  createStudentScholarshipAction,
  updateStudentScholarshipAction,
} from "../../_actions/studentScholarshipActions";

type StudentScholarshipCreateProps = {
  students: IStudentScholarshipStudent[];
  scholarships: IScholarship[];
  semesters: ISemester[];
  record?: IStudentScholarship;
  trigger?: "add" | "edit";
};

type StudentScholarshipFormValues = {
  studentId: string;
  scholarshipId: string;
  semesterId: string;
  status?: StudentScholarshipStatus;
};

const StudentScholarshipCreate = ({
  students,
  scholarships,
  semesters,
  record,
  trigger = "add",
}: StudentScholarshipCreateProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(record);

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
        {isEdit ? "Edit" : "Assign Scholarship"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <StudentScholarshipForm
            students={students}
            scholarships={scholarships}
            semesters={semesters}
            record={record}
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

const StudentScholarshipForm = ({
  students,
  scholarships,
  semesters,
  record,
  isEdit,
  onClose,
  onSuccess,
}: StudentScholarshipCreateProps & {
  isEdit: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const action = isEdit
    ? updateStudentScholarshipAction
    : createStudentScholarshipAction;
  const [state, formAction, isSubmitting] = useActionState(action, null);
  const [isPending, startTransition] = useTransition();
  const defaultValues: StudentScholarshipFormValues = {
    studentId: record?.studentId ?? "",
    scholarshipId: record?.scholarshipId ?? "",
    semesterId: record?.semesterId ?? "",
    status: record?.status ?? "PENDING",
  };
  const form = useForm({
    defaultValues,
    validators: { onSubmit: createStudentScholarshipZodSchema },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      if (record?.id) formData.append("id", record.id);
      formData.append("studentId", value.studentId);
      formData.append("scholarshipId", value.scholarshipId);
      formData.append("semesterId", value.semesterId);
      formData.append("status", value.status ?? "PENDING");
      startTransition(() => formAction(formData));
    },
  });

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      onSuccess();
    } else if (state?.success === false) toast.error(state.message);
  }, [onSuccess, state]);

  const loading = isSubmitting || isPending;
  const showError = (error: unknown) =>
    String((error as { message?: unknown })?.message ?? error);
  const getSemesterLabel = (semester: ISemester) =>
    `${semester.name}${semester.academicYear?.name ? ` (${semester.academicYear.name})` : ""}`;

  const renderError = (field: {
    state: {
      meta: { isTouched: boolean; isValid: boolean; errors: unknown[] };
    };
  }) => {
    if (!field.state.meta.isTouched || field.state.meta.isValid) return null;
    return field.state.meta.errors.map((error, index) => (
      <p key={index} className="text-xs text-destructive">
        {showError(error)}
      </p>
    ));
  };

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <BadgePercent className="size-5 text-primary" />
          {isEdit ? "Edit Student Scholarship" : "Assign Student Scholarship"}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update the student scholarship assignment."
            : "Assign a scholarship to a student for a semester."}
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
        {(["studentId", "scholarshipId", "semesterId"] as const).map(
          (fieldName) => (
            <form.Field key={fieldName} name={fieldName}>
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                const selectedStudent = students.find(
                  (student) => student.id === field.state.value,
                );
                const selectedScholarship = scholarships.find(
                  (scholarship) => scholarship.id === field.state.value,
                );
                const selectedSemester = semesters.find(
                  (semester) => semester.id === field.state.value,
                );
                const label =
                  fieldName === "studentId"
                    ? "Student"
                    : fieldName === "scholarshipId"
                      ? "Scholarship"
                      : "Semester";
                const selectedLabel =
                  fieldName === "studentId"
                    ? selectedStudent?.user?.name ||
                      selectedStudent?.user?.email
                    : fieldName === "scholarshipId"
                      ? selectedScholarship?.name
                      : selectedSemester
                        ? getSemesterLabel(selectedSemester)
                        : undefined;
                return (
                  <div className="space-y-2">
                    <Label>
                      {label} <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value ?? "")}
                    >
                      <SelectTrigger
                        className="w-full"
                        aria-invalid={isInvalid}
                      >
                        <SelectValue
                          placeholder={`Select ${label.toLowerCase()}`}
                        >
                          {selectedLabel || `Select ${label.toLowerCase()}`}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {fieldName === "studentId" &&
                          students.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.user?.name ||
                                student.user?.email ||
                                student.id}
                            </SelectItem>
                          ))}
                        {fieldName === "scholarshipId" &&
                          scholarships.map((scholarship) => (
                            <SelectItem
                              key={scholarship.id}
                              value={scholarship.id}
                            >
                              {scholarship.name}
                            </SelectItem>
                          ))}
                        {fieldName === "semesterId" &&
                          semesters.map((semester) => (
                            <SelectItem key={semester.id} value={semester.id}>
                              {getSemesterLabel(semester)}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {renderError(field)}
                  </div>
                );
              }}
            </form.Field>
          ),
        )}
        <form.Field name="status">
          {(field) => (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select<StudentScholarshipStatus>
                value={field.state.value ?? "PENDING"}
                onValueChange={(value) =>
                  field.handleChange(value ?? "PENDING")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
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
            {isEdit ? "Update Assignment" : "Assign Scholarship"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default StudentScholarshipCreate;
