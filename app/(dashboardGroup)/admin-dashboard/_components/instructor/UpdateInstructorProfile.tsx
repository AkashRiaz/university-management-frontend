"use client";

import { useActionState, useEffect, useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import {useRouter } from "next/navigation";
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
  UpdateInstructorAdminZodSchema,
  updateInstructorAdminInput,
} from "@/components/validations/instructor.validation";
import { InstructorDesignation } from "@/lib/enum";
import { IDepartment } from "@/types/department.type";
import { IInstructor } from "@/types/instructor.type";
import { updateInstructorAdminAction } from "../../_actions/instructorActions";

const UpdateInstructorProfile = ({
  instructor,
  departments,
}: {
  instructor: IInstructor;
  departments: IDepartment[];
}) => {
  const router = useRouter();
  const [state, formAction, isSubmitting] = useActionState(
    updateInstructorAdminAction,
    null,
  );
  const [isPending, startTransition] = useTransition();
  const defaultValues: updateInstructorAdminInput = {
    name: instructor.user?.name ?? "",
    designation: instructor.designation,
    joiningDate: instructor.joiningDate ?? "",
    departmentId: instructor.departmentId ?? "",
    status: instructor.user?.status,
  };

  const form = useForm({
    defaultValues,
    validators: { onSubmit: UpdateInstructorAdminZodSchema },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append("id", instructor.id);
      formData.append("name", value.name ?? "");
      formData.append("designation", value.designation ?? "");
      formData.append("joiningDate", String(value.joiningDate ?? ""));
      formData.append("departmentId", String(value.departmentId ?? ""));
      formData.append("status", value.status ?? "");
      startTransition(() => formAction(formData));
    },
  });

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      router.push("/admin-dashboard/instructors");
      router.refresh();
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [router, state]);

  const loading = isSubmitting || isPending;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserRoundPen className="size-5" />
          </div>
          <div>
            <CardTitle>Update Instructor Profile</CardTitle>
            <CardDescription>
              Update the instructor&apos;s administrative information.
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
                    aria-invalid={
                      field.state.meta.isTouched && !field.state.meta.isValid
                    }
                  />
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.map((error, index) => (
                      <p key={index} className="text-xs text-destructive">
                        {String(error?.message ?? error)}
                      </p>
                    ))}
                </div>
              )}
            </form.Field>

            <form.Field name="designation">
              {(field) => (
                <div className="space-y-2">
                  <Label>Designation</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as InstructorDesignation)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(InstructorDesignation).map(
                        (designation) => (
                          <SelectItem key={designation} value={designation}>
                            {designation.replaceAll("_", " ")}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>

            <form.Field name="joiningDate">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Joining Date</Label>
                  <Input
                    id={field.name}
                    type="date"
                    value={String(field.state.value ?? "").slice(0, 10)}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                  />
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
                      value={String(field.state.value ?? "")}
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
                  </div>
                );
              }}
            </form.Field>

            <form.Field name="status">
              {(field) => (
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(
                        value as updateInstructorAdminInput["status"],
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        ["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING"] as const
                      ).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export default UpdateInstructorProfile;
