"use client";

import { useActionState, useEffect, useTransition } from "react";
import { redirect, useRouter } from "next/navigation";
import { createInstructorAction } from "../../_actions/instructorActions";
import {
  createInstructorInput,
  CreateInstructorZodSchema,
} from "@/components/validations/instructor.validation";
import { useForm } from "@tanstack/react-form";
import { convertToISODate } from "@/hooks/useConvertToISODate";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, UserPlus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IDepartment } from "@/types/department.type";

const InstructorRegistrationForm = ({
  departments,
}: {
  departments: IDepartment[];
}) => {
  const router = useRouter();
  const [state, formAction] = useActionState(createInstructorAction, null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      router.push("/admin-dashboard/instructors");
      router.refresh();
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [router, state]);

  const defaultValues: createInstructorInput = {
    name: "",
    email: "",
    designation: "",
    specialization: "",
    phone: "",
    officeRoom: "",
    joiningDate: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    bio: "",
    qualification: "",
    departmentId: "",
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: CreateInstructorZodSchema,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();

      const joiningDate = convertToISODate(value.joiningDate);
      if (!joiningDate) {
        toast.error("Please select a valid joining date");
        return;
      }

      formData.append("name", value.name);
      formData.append("email", value.email);
      formData.append("designation", value.designation);
      formData.append("specialization", value.specialization || "");
      formData.append("departmentId", value.departmentId);
      formData.append("phone", value.phone || "");

      formData.append("joiningDate", joiningDate);

      if (value.dateOfBirth) {
        const dateOfBirth = convertToISODate(value.dateOfBirth);

        if (!dateOfBirth) {
          toast.error("Please select a valid date of birth");
          return;
        }

        formData.append("dateOfBirth", dateOfBirth);
      }

      // Optional fields
      if (value.gender) {
        formData.append("gender", value.gender);
      }

      formData.append("officeRoom", value.officeRoom ?? "");
      formData.append("address", value.address ?? "");
      formData.append("bio", value.bio ?? "");
      formData.append("qualification", value.qualification ?? "");

      startTransition(() => {
        // console.log("Submitting form data:", formData);
        formAction(formData);
      });
    },
  });
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserPlus className="size-5" />
          </div>

          <div>
            <CardTitle>Create Instructor</CardTitle>
            <CardDescription>
              Enter the instructors academic and personal information.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit(e);
          }}
          className="space-y-7"
        >
          {/* personal information fields */}
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-sm font-semibold">
              Personal Information
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              {/* name */}
              <form.Field name="name">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>
                        Full Name <span className="text-destructive">*</span>
                      </Label>

                      <Input
                        id={field.name}
                        placeholder="Enter full name"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
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
                            {String(error?.message ?? error)}
                          </p>
                        ))}
                    </div>
                  );
                }}
              </form.Field>

              {/* email */}
              <form.Field name="email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>
                        Email <span className="text-destructive">*</span>
                      </Label>

                      <Input
                        id={field.name}
                        placeholder="Enter email address"
                        type="email"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
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
                            {String(error?.message ?? error)}
                          </p>
                        ))}
                    </div>
                  );
                }}
              </form.Field>

              {/* designations */}
              <form.Field name="designation">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <div className="space-y-2">
                      <Label>
                        Designation <span className="text-destructive">*</span>
                      </Label>
                      <Select<createInstructorInput["designation"]>
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(value ?? "")
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select designation" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="LECTURER">Lecturer</SelectItem>
                          <SelectItem value="ASSISTANT_PROFESSOR">
                            Assistant Professor
                          </SelectItem>
                          <SelectItem value="ASSOCIATE_PROFESSOR">
                            Associate Professor
                          </SelectItem>
                          <SelectItem value="PROFESSOR">Professor</SelectItem>
                          <SelectItem value="ADJUNCT">Adjunct</SelectItem>
                          <SelectItem value="VISITING_PROFESSOR">
                            Visiting Professor
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      {isInvalid &&
                        field.state.meta.errors.map((error, index) => (
                          <p key={index} className="text-xs text-destructive">
                            {String(error?.message ?? error)}
                          </p>
                        ))}
                    </div>
                  );
                }}
              </form.Field>

              {/* joining date */}
              <form.Field name="joiningDate">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>
                        Joining Date <span className="text-destructive">*</span>
                      </Label>

                      <Input
                        id={field.name}
                        type="date"
                        value={
                          field.state.value
                            ? field.state.value.slice(0, 10)
                            : ""
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
                            {String(error?.message ?? error)}
                          </p>
                        ))}
                    </div>
                  );
                }}
              </form.Field>

              {/* date of birth */}
              <form.Field name="dateOfBirth">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Date of Birth</Label>

                      <Input
                        id={field.name}
                        type="date"
                        value={
                          field.state.value
                            ? field.state.value.slice(0, 10)
                            : ""
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
                            {String(error?.message ?? error)}
                          </p>
                        ))}
                    </div>
                  );
                }}
              </form.Field>

              {/* Gender */}
              <form.Field name="gender">
                {(field) => (
                  <div className="space-y-2">
                    <Label>Gender</Label>

                    <Select<createInstructorInput["gender"]>
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value ?? "")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                        <SelectItem value="PREFER_NOT_TO_SAY">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </form.Field>

              {/* Specialization */}
              <form.Field name="specialization">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Specialization</Label>

                      <Input
                        id={field.name}
                        placeholder="Enter specialization"
                        value={field.state.value ?? ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        maxLength={200}
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
                            {String(error?.message ?? error)}
                          </p>
                        ))}
                    </div>
                  );
                }}
              </form.Field>

              {/* Qualification */}
              <form.Field name="qualification">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Qualification</Label>

                      <Input
                        id={field.name}
                        placeholder="e.g. MSc in Computer Science"
                        value={field.state.value ?? ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        maxLength={500}
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
                            {String(error?.message ?? error)}
                          </p>
                        ))}
                    </div>
                  );
                }}
              </form.Field>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-sm font-semibold">
              Contact Information
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Phone */}
              <form.Field name="phone">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Phone Number</Label>

                      <Input
                        id={field.name}
                        type="tel"
                        placeholder="+8801XXXXXXXXX"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
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
                            {String(error?.message ?? error)}
                          </p>
                        ))}
                    </div>
                  );
                }}
              </form.Field>

              {/* Office Room */}
              <form.Field name="officeRoom">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Office Room</Label>

                      <Input
                        id={field.name}
                        placeholder="Enter office room"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
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
                            {String(error?.message ?? error)}
                          </p>
                        ))}
                    </div>
                  );
                }}
              </form.Field>

              {/* Address */}
              <form.Field name="address">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={field.name}>Address</Label>

                      <Textarea
                        id={field.name}
                        placeholder="Enter full address"
                        value={field.state.value ?? ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        maxLength={500}
                        rows={3}
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
                            {String(error?.message ?? error)}
                          </p>
                        ))}
                    </div>
                  );
                }}
              </form.Field>

              <form.Field name="bio">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={field.name}>Biography</Label>

                      <Textarea
                        id={field.name}
                        placeholder="Write a short biography about the instructor..."
                        value={field.state.value ?? ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        maxLength={2000}
                        rows={4}
                        aria-invalid={isInvalid}
                        className={
                          isInvalid
                            ? "border-destructive focus-visible:ring-destructive/30"
                            : ""
                        }
                      />

                      <div className="flex justify-between">
                        <div>
                          {isInvalid &&
                            field.state.meta.errors.map((error, index) => (
                              <p
                                key={index}
                                className="text-xs text-destructive"
                              >
                                {String(error?.message ?? error)}
                              </p>
                            ))}
                        </div>

                        <span className="text-xs text-muted-foreground">
                          {(field.state.value ?? "").length}/2000
                        </span>
                      </div>
                    </div>
                  );
                }}
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
                      Create Instructor
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

export default InstructorRegistrationForm;
