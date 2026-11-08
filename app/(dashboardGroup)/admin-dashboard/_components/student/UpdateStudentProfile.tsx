"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useForm, useSelector } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { Loader2, Save, UserRoundPen } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  UpdateStudentAdminZodSchema,
  updateStudentInput,
} from "@/components/validations/student.validation";
import { IDepartment } from "@/types/department.type";
import { Program } from "@/types/program.type";
import { Student, updateStudentAdminAction } from "../../_actions/studentActions";
import { getAllProgramsAction } from "../../_actions/programActions";

const dateValue = (value?: string | null) => (value ? value.slice(0, 10) : "");

const UpdateStudentProfile = ({
  student,
  departments,
  programs,
}: {
  student: Student;
  departments: IDepartment[];
  programs: Program[];
}) => {
  const router = useRouter();
  const [state, formAction, isSubmitting] = useActionState(
    updateStudentAdminAction,
    null,
  );
  const [isPending, startTransition] = useTransition();
  const [availablePrograms, setAvailablePrograms] = useState(programs);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);
  const defaultValues: updateStudentInput = {
    name: student.user?.name ?? "",
    email: student.user?.email ?? student.email ?? "",
    departmentId: student.departmentId ?? "",
    programId: student.programId ?? "",
    admissionDate: dateValue(student.admissionDate),
    admissionYear: student.admissionYear ?? undefined,
    currentSemesterNumber: student.currentSemesterNumber ?? undefined,
    status: student.status ?? undefined,
    academicStatus: student.academicStatus ?? undefined,
  };

  const form = useForm({
    defaultValues,
    validators: { onSubmit: UpdateStudentAdminZodSchema },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append("id", student.id);
      formData.append("name", value.name ?? "");
      formData.append("email", value.email ?? "");
      formData.append("departmentId", value.departmentId ?? "");
      formData.append("programId", value.programId ?? "");
      formData.append("admissionDate", String(value.admissionDate ?? ""));
      formData.append("admissionYear", String(value.admissionYear ?? ""));
      formData.append(
        "currentSemesterNumber",
        String(value.currentSemesterNumber ?? ""),
      );
      formData.append("status", value.status ?? "");
      formData.append("academicStatus", value.academicStatus ?? "");
      startTransition(() => formAction(formData));
    },
  });

  const selectedDepartmentId = useSelector(
    form.store,
    (store) => store.values.departmentId,
  );

  useEffect(() => {
    let isCurrentRequest = true;

    const loadPrograms = async () => {
      if (!selectedDepartmentId) {
        setAvailablePrograms([]);
        return;
      }

      setIsLoadingPrograms(true);
      const result = await getAllProgramsAction({
        query: { departmentId: selectedDepartmentId },
      });

      if (isCurrentRequest) {
        setAvailablePrograms(result.data || []);
        setIsLoadingPrograms(false);
      }
    };

    void loadPrograms();

    return () => {
      isCurrentRequest = false;
    };
  }, [selectedDepartmentId]);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      router.push("/admin-dashboard/students");
      router.refresh();
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [router, state]);

  const loading = isSubmitting || isPending;
  const fieldError = (field: {
    state: { meta: { isTouched: boolean; isValid: boolean; errors: unknown[] } };
  }) =>
    field.state.meta.isTouched &&
    !field.state.meta.isValid &&
    field.state.meta.errors.map((error, index) => (
      <p key={index} className="text-xs text-destructive">
        {String((error as { message?: string })?.message ?? error)}
      </p>
    ));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserRoundPen className="size-5" />
          </div>
          <div>
            <CardTitle>Update Student Profile</CardTitle>
            <CardDescription>
              Update the student&apos;s administrative information.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <form.Field name="name">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Full Name</Label>
                  <Input
                    id={field.name}
                    value={field.state.value ?? ""}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {fieldError(field)}
                </div>
              )}
            </form.Field>

            <form.Field name="email">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Email</Label>
                  <Input
                    id={field.name}
                    type="email"
                    value={field.state.value ?? ""}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {fieldError(field)}
                </div>
              )}
            </form.Field>

            <form.Field name="departmentId">
              {(field) => {
                const selectedDepartment = departments.find(
                  (department) => department.id === field.state.value,
                );

                return (
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select
                      value={field.state.value ?? ""}
                      onValueChange={(value) => {
                        field.handleChange(value ?? "");
                        form.setFieldValue("programId", "");
                      }}
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
                    {fieldError(field)}
                  </div>
                );
              }}
            </form.Field>

            <form.Field name="programId">
              {(field) => {
                const selectedProgram = availablePrograms.find(
                  (program) => program.id === field.state.value,
                );

                return (
                  <div className="space-y-2">
                    <Label>Program</Label>
                    <Select
                      value={field.state.value ?? ""}
                      onValueChange={(value) => field.handleChange(value ?? "")}
                      disabled={isLoadingPrograms || !selectedDepartmentId}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select program">
                          {selectedProgram
                            ? `${selectedProgram.name || selectedProgram.code || selectedProgram.id}${selectedProgram.department?.code ? ` (${selectedProgram.department.code})` : ""}`
                            : "Select program"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {availablePrograms.map((program) => (
                          <SelectItem key={program.id} value={program.id}>
                            {program.department?.code
                              ? `${program.name || program.code || program.id} (${program.department.code})`
                              : program.name || program.code || program.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldError(field)}
                  </div>
                );
              }}
            </form.Field>

            <form.Field name="admissionDate">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Admission Date</Label>
                  <Input
                    id={field.name}
                    type="date"
                    value={String(field.state.value ?? "").slice(0, 10)}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {fieldError(field)}
                </div>
              )}
            </form.Field>

            <form.Field name="admissionYear">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Admission Year</Label>
                  <Input
                    id={field.name}
                    type="number"
                    value={String(field.state.value ?? "")}
                    onChange={(event) =>
                      field.handleChange(
                        event.target.value ? Number(event.target.value) : undefined,
                      )
                    }
                    onBlur={field.handleBlur}
                  />
                  {fieldError(field)}
                </div>
              )}
            </form.Field>

            <form.Field name="currentSemesterNumber">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Current Semester</Label>
                  <Input
                    id={field.name}
                    type="number"
                    min={1}
                    value={String(field.state.value ?? "")}
                    onChange={(event) =>
                      field.handleChange(
                        event.target.value ? Number(event.target.value) : undefined,
                      )
                    }
                    onBlur={field.handleBlur}
                  />
                  {fieldError(field)}
                </div>
              )}
            </form.Field>

            <form.Field name="status">
              {(field) => (
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={field.state.value ?? ""}
                    onValueChange={(value) =>
                      field.handleChange(
                        value as
                          | "ACTIVE"
                          | "INACTIVE"
                          | "GRADUATED"
                          | "SUSPENDED",
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {(["ACTIVE", "INACTIVE", "GRADUATED", "SUSPENDED"] as const).map(
                        (status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  {fieldError(field)}
                </div>
              )}
            </form.Field>

            <form.Field name="academicStatus">
              {(field) => (
                <div className="space-y-2">
                  <Label>Academic Status</Label>
                  <Select
                    value={field.state.value ?? ""}
                    onValueChange={(value) =>
                      field.handleChange(
                        value as
                          | "GOOD_STANDING"
                          | "PROBATION"
                          | "SUSPENDED"
                          | "DISMISSED",
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select academic status" />
                    </SelectTrigger>
                    <SelectContent>
                      {["GOOD_STANDING", "PROBATION", "SUSPENDED", "DISMISSED"].map(
                        (status) => (
                          <SelectItem key={status} value={status}>
                            {status.replaceAll("_", " ")}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  {fieldError(field)}
                </div>
              )}
            </form.Field>
          </div>

          <div className="flex justify-end gap-3 border-t pt-5">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <form.Subscribe selector={(formState) => [formState.canSubmit]}>
              {([canSubmit]) => (
                <Button type="submit" disabled={!canSubmit || loading}>
                  {loading ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 size-4" />
                  )}
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdateStudentProfile;
