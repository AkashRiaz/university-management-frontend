"use client";

import React, { useActionState, useEffect, useTransition } from "react";
import { createProgramAction } from "../../_actions/programActions";
import { IDepartment } from "@/types/department.type";
import { useForm } from "@tanstack/react-form";
import {
  CreateProgramInput,
  CreateProgramZodSchema,
} from "@/components/validations/program.validation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookIcon, Loader2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { redirect } from "next/navigation";

const CreateProgramForm = ({ departments }: { departments: IDepartment[] }) => {
  const [state, formAction, loading] = useActionState(
    createProgramAction,
    null,
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Program created successfully!")
      redirect("/admin-dashboard/programs");
    }else if (state?.success === false) {
      toast.error(state?.message || "Failed to create program. Please try again.");
    }
  }, [state?.success]);

  const [isPending, startTransition] = useTransition();

  const defaultValues: CreateProgramInput = {
    name: "",
    code: "",
    description: "",
    durationYears: 0,
    totalCredits: 0,
    departmentId: "",
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: CreateProgramZodSchema,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append("name", value.name);
      formData.append("code", value.code);
      formData.append("description", value.description || "");
      formData.append("durationYears", value.durationYears.toString());
      formData.append("totalCredits", value.totalCredits.toString());
      formData.append("departmentId", value.departmentId);

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
            <BookIcon className="size-5" />
          </div>

          <div>
            <CardTitle>Create Program</CardTitle>
            <CardDescription>Enter the program information.</CardDescription>
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
          <div className="grid gap-4 md:grid-cols-2">
            {/* Program name */}
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
                      placeholder="Enter program name"
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

            {/* Program code */}
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
                      placeholder="Enter program code"
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

            {/* Duration in Years */}
            <form.Field name="durationYears">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Duration in Years</Label>

                    <Input
                      id={field.name}
                      placeholder="Enter duration in years"
                      type="number"
                      min={1}
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
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
                          {String(error?.message ?? error)}
                        </p>
                      ))}
                  </div>
                );
              }}
            </form.Field>

            {/* Total Credits */}
            <form.Field name="totalCredits">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Total Credits</Label>

                    <Input
                      id={field.name}
                      type="number"
                      placeholder="Enter total credits"
                      min={1}
                      value={field.state.value}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
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

            {/* Department */}
            <form.Field name="departmentId">
              {(field) => {
                const selectedDepartment = departments.find(
                  (department) => department.id === field.state.value,
                );
                return (
                  <div className="space-y-2">
                    <Label>
                      Department
                      <span className="text-destructive">*</span>
                    </Label>

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
                          <SelectItem key={department.id} value={department.id}>
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
                      <BookIcon className="mr-2 size-4" />
                      Create Program
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

export default CreateProgramForm;
