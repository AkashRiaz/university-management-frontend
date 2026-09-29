"use client";

import React, {
  useActionState,
  useEffect,
  useState,
  useTransition,
} from "react";
import { useSelector } from "@tanstack/react-form";
import { createStudentAction } from "../../_actions/studentActions";
import { getAllProgramsAction } from "../../_actions/programActions";
import { useForm } from "@tanstack/react-form";
import {
  createStudentInput,
  createStudentSchema,
} from "@/components/validations/student.validation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { Program } from "@/types/program.type";
import { IDepartment } from "@/types/department.type";

const convertToISODate = (date?: string): string | undefined => {
  if (!date) return undefined;

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  return parsedDate.toISOString();
};

const StudentRegistrationForm = ({
  programs,
  departments,
}: {
  programs: Program[];
  departments: IDepartment[];
}) => {
  // console.log("Programs:", programs);
  const [state, formAction, loading] = useActionState(
    createStudentAction,
    null,
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Student created successfully");
      redirect("/admin-dashboard/students");
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  const [isPending, startTransition] = useTransition();
  const [availablePrograms, setAvailablePrograms] = useState(programs);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);

  const defaultValues: createStudentInput = {
    name: "",
    email: "",
    departmentId: "",
    programId: "",
    admissionDate: "",
    admissionYear: new Date().getFullYear(),
    dateOfBirth: "",
    gender: undefined,
    phone: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  };

  const form = useForm({
    defaultValues: defaultValues,
    validators: {
      onSubmit: createStudentSchema,
    },
    onSubmit: async ({ value }) => {
      const admissionDate = convertToISODate(value.admissionDate);

      if (!admissionDate) {
        toast.error("Please select a valid admission date");
        return;
      }

      const formData = new FormData();

      formData.append("name", value.name);
      formData.append("email", value.email);
      formData.append("departmentId", value.departmentId);
      formData.append("programId", value.programId);

      // Required DateTime
      formData.append("admissionDate", admissionDate);

      formData.append("admissionYear", String(value.admissionYear));

      // Optional DateTime
      const dateOfBirth = convertToISODate(value.dateOfBirth);

      if (dateOfBirth) {
        formData.append("dateOfBirth", dateOfBirth);
      }

      if (value.gender) {
        formData.append("gender", value.gender);
      }

      formData.append("phone", value.phone ?? "");
      formData.append("address", value.address ?? "");

      formData.append("emergencyContactName", value.emergencyContactName ?? "");

      formData.append(
        "emergencyContactPhone",
        value.emergencyContactPhone ?? "",
      );

      startTransition(() => {
        formAction(formData);
      });
    },
  });

  const selectedDepartmentId = useSelector(
    form.store,
    (state) => state.values.departmentId,
  );

  useEffect(() => {
    let isCurrentRequest = true;

    const loadPrograms = async () => {
      if (!selectedDepartmentId) {
        setAvailablePrograms(programs);
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
  }, [programs, selectedDepartmentId]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserPlus className="size-5" />
          </div>

          <div>
            <CardTitle>Create Student</CardTitle>
            <CardDescription>
              Enter the students academic and personal information.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-7"
        >
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-sm font-semibold">
              Personal Information
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Name */}
              <form.Field name="name">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Full Name</Label>

                    <Input
                      id={field.name}
                      placeholder="Enter full name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />

                    {field.state.meta.isTouched &&
                      field.state.meta.errors.map((error, i) => (
                        <p key={i} className="text-xs text-destructive">
                          {String(error?.message ?? error)}
                        </p>
                      ))}
                  </div>
                )}
              </form.Field>

              {/* Email */}
              <form.Field name="email">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Email Address</Label>

                    <Input
                      id={field.name}
                      type="email"
                      placeholder="student@example.com"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />

                    {field.state.meta.isTouched &&
                      field.state.meta.errors.map((error, i) => (
                        <p key={i} className="text-xs text-destructive">
                          {String(error?.message ?? error)}
                        </p>
                      ))}
                  </div>
                )}
              </form.Field>

              {/* Gender */}
              <form.Field name="gender">
                {(field) => (
                  <div className="space-y-2">
                    <Label>Gender</Label>

                    <Select
                      value={field.state.value ?? ""}
                      onValueChange={(value) =>
                        field.handleChange(
                          value
                            ? (value as createStudentInput["gender"])
                            : undefined,
                        )
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </form.Field>

              {/* Phone */}
              <form.Field name="phone">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Phone Number</Label>

                    <Input
                      id={field.name}
                      type="tel"
                      placeholder="+8801XXXXXXXXX"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />

                    {field.state.meta.isTouched &&
                      field.state.meta.errors.map((error, i) => (
                        <p key={i} className="text-xs text-destructive">
                          {String(error?.message ?? error)}
                        </p>
                      ))}
                  </div>
                )}
              </form.Field>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-sm font-semibold">
              Academic Information
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Department */}
              <form.Field name="departmentId">
                {(field) => {
                  const selectedDepartment = departments.find(
                    (department) => department.id === field.state.value,
                  );
                  return (
                    <div className="space-y-2">
                      <Label>Department</Label>

                      <Select
                        value={field.state.value}
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
                            <SelectItem
                              key={department.id}
                              value={department.id}
                            >
                              {department.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {field.state.meta.isTouched &&
                        field.state.meta.errors.map((error, i) => (
                          <p key={i} className="text-xs text-destructive">
                            {String(error?.message ?? error)}
                          </p>
                        ))}
                    </div>
                  );
                }}
              </form.Field>

              {/* Program */}
              <form.Field name="programId">
                {(field) => {
                  const selectedProgram = programs.find(
                    (program) => program.id === field.state.value,
                  );

                  return (
                    <div className="space-y-2">
                      <Label>Program</Label>

                      <Select
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(value ?? "")
                        }
                        disabled={isLoadingPrograms || !selectedDepartmentId}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select program">
                            {selectedProgram?.name ?? "Select program"}
                          </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                          {availablePrograms.map((program) => (
                            <SelectItem key={program.id} value={program.id}>
                              {program.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {field.state.meta.isTouched &&
                        field.state.meta.errors.map((error, i) => (
                          <p key={i} className="text-xs text-destructive">
                            {String(error?.message ?? error)}
                          </p>
                        ))}
                    </div>
                  );
                }}
              </form.Field>

              {/* Admission Date */}
              <form.Field name="admissionDate">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Admission Date</Label>

                    <Input
                      id={field.name}
                      type="date"
                      value={
                        field.state.value ? field.state.value.slice(0, 10) : ""
                      }
                      onChange={(e) => {
                        const date = e.target.value;

                        field.handleChange(
                          date
                            ? new Date(`${date}T00:00:00.000Z`).toISOString()
                            : "",
                        );
                      }}
                      onBlur={field.handleBlur}
                    />

                    {field.state.meta.isTouched &&
                      field.state.meta.errors.map((error, i) => (
                        <p key={i} className="text-xs text-destructive">
                          {String(error?.message ?? error)}
                        </p>
                      ))}
                  </div>
                )}
              </form.Field>

              {/* Admission Year */}
              <form.Field name="admissionYear">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Admission Year</Label>

                    <Input
                      id={field.name}
                      type="number"
                      min={2000}
                      max={2100}
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(
                          e.target.value === "" ? 0 : Number(e.target.value),
                        )
                      }
                      onBlur={field.handleBlur}
                    />

                    {field.state.meta.isTouched &&
                      field.state.meta.errors.map((error, i) => (
                        <p key={i} className="text-xs text-destructive">
                          {String(error?.message ?? error)}
                        </p>
                      ))}
                  </div>
                )}
              </form.Field>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-sm font-semibold">
              Contact Information
            </h3>

            <form.Field name="address">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Address</Label>

                  <Textarea
                    id={field.name}
                    placeholder="Enter full address"
                    rows={3}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />

                  {field.state.meta.isTouched &&
                    field.state.meta.errors.map((error, i) => (
                      <p key={i} className="text-xs text-destructive">
                        {String(error?.message ?? error)}
                      </p>
                    ))}
                </div>
              )}
            </form.Field>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Emergency Contact Name */}
              <form.Field name="emergencyContactName">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Emergency Contact Name</Label>

                    <Input
                      id={field.name}
                      placeholder="Contact person name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />

                    {field.state.meta.isTouched &&
                      field.state.meta.errors.map((error, i) => (
                        <p key={i} className="text-xs text-destructive">
                          {String(error?.message ?? error)}
                        </p>
                      ))}
                  </div>
                )}
              </form.Field>

              {/* Emergency Contact Phone */}
              <form.Field name="emergencyContactPhone">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Emergency Contact Phone</Label>

                    <Input
                      id={field.name}
                      type="tel"
                      placeholder="+8801XXXXXXXXX"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />

                    {field.state.meta.isTouched &&
                      field.state.meta.errors.map((error, i) => (
                        <p key={i} className="text-xs text-destructive">
                          {String(error?.message ?? error)}
                        </p>
                      ))}
                  </div>
                )}
              </form.Field>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 border-t pt-5">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => form.reset()}
            >
              Reset
            </Button>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting || isPending}
                  className="min-w-40"
                >
                  {isSubmitting || isPending ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 size-4" />
                      Create Student
                    </>
                  )}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentRegistrationForm;
