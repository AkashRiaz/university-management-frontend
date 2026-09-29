"use client";
import React, { useActionState, useEffect, useTransition } from "react";
import { createDepartmentAction } from "../../_actions/departmentActions";
import {
  CreateDepartmentInput,
  CreateDepartmentZodSchema,
} from "@/components/validations/department.validation";
import { useForm } from "@tanstack/react-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building, Building2, Loader2, UserPlus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IFaculty } from "@/types/faculty.type";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { redirect } from "next/navigation";

const CreateDepartmentForm = ({ faculties }: { faculties: IFaculty[] }) => {
  const [state, formAction, loading] = useActionState(
    createDepartmentAction,
    null,
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state?.success) {
      toast.success("Department created successfully");
      redirect("/admin-dashboard/departments");
    } else if (state?.error) {
      toast.error(state?.error || "Failed to create department");
    }
  }, [state]);

  const defaultValues: CreateDepartmentInput = {
    name: "",
    code: "",
    description: "",
    building: "",
    phone: "",
    email: "",
    facultyId: "",
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: CreateDepartmentZodSchema,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append("name", value.name);
      formData.append("code", value.code);
      formData.append("description", value.description || "");
      formData.append("building", value.building || "");
      formData.append("phone", value.phone || "");
      formData.append("email", value.email || "");
      formData.append("facultyId", value.facultyId);

      startTransition(() => {
        formAction(formData);
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building className="size-5" />
          </div>

          <div>
            <CardTitle>Create Department</CardTitle>
            <CardDescription>
              Enter the departments information.
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
          <div className="grid gap-4 md:grid-cols-2">
            {/* department name */}
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
                      placeholder="Enter department name"
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

            {/* department code */}
            <form.Field name="code">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>
                      Code <span className="text-destructive">*</span>
                    </Label>

                    <Input
                      id={field.name}
                      placeholder="Enter department code"
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

            {/* Building */}
            <form.Field name="building">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Building</Label>

                    <Input
                      id={field.name}
                      placeholder="Enter building name"
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

            {/* description */}
            <form.Field name="description">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={field.name}>Description</Label>

                    <Textarea
                      id={field.name}
                      placeholder="Write a short description about the department..."
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
                            <p key={index} className="text-xs text-destructive">
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

            {/* Faculty */}
            <form.Field name="facultyId">
              {(field) => {
                const selectedFaculty = faculties.find(
                  (faculty) => faculty.id === field.state.value,
                );
                return (
                  <div className="space-y-2">
                    <Label>
                      Faculty 
                      <span className="text-destructive">*</span>
                    </Label>

                    <Select
                      value={field.state.value}
                      onValueChange={(value) => {
                        field.handleChange(value ?? "");
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select faculty">
                          {selectedFaculty?.name ?? "Select faculty"}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        {faculties.map((faculty) => (
                          <SelectItem key={faculty.id} value={faculty.id}>
                            {faculty.name}
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
                      <Building2 className="mr-2 size-4" />
                      Create Department
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

export default CreateDepartmentForm;
