"use client";

import { useActionState, useEffect, useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { Building, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateDepartmentInput, CreateDepartmentZodSchema } from "@/components/validations/department.validation";
import { IFaculty } from "@/types/faculty.type";
import { IDepartment } from "@/types/department.type";
import { updateDepartmentAction } from "../../_actions/departmentActions";

const UpdateDepartmentForm = ({ department, faculties }: { department: IDepartment; faculties: IFaculty[] }) => {
  const router = useRouter();
  const [state, formAction, isSubmitting] = useActionState(updateDepartmentAction, null);
  const [isPending, startTransition] = useTransition();
  const defaultValues: CreateDepartmentInput = {
      name: department.name,
      code: department.code,
      description: department.description || "",
      building: department.building || "",
      phone: department.phone || "",
      email: department.email || "",
      facultyId: department.facultyId,
    };
  const form = useForm({
    defaultValues,
    validators: { onSubmit: CreateDepartmentZodSchema },
    onSubmit: async ({ value }) => {
      const data = new FormData();
      data.append("id", department.id);
      Object.entries(value).forEach(([key, item]) => data.append(key, item || ""));
      startTransition(() => formAction(data));
    },
  });

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      router.push("/admin-dashboard/departments");
      router.refresh();
    } else if (state?.success === false) toast.error(state.message);
  }, [router, state]);

  const field = (name: keyof CreateDepartmentInput, label: string, type = "text") => (
    <form.Field name={name}>
      {(control) => (
        <div className="space-y-2">
          <Label htmlFor={control.name}>{label}</Label>
          <Input id={control.name} type={type} value={control.state.value || ""} onChange={(event) => control.handleChange(event.target.value)} onBlur={control.handleBlur} />
          {control.state.meta.isTouched && control.state.meta.errors.map((error, index) => <p key={index} className="text-xs text-destructive">{String(error)}</p>)}
        </div>
      )}
    </form.Field>
  );

  return (
    <Card>
      <CardHeader><div className="flex items-center gap-3"><div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Building className="size-5" /></div><div><CardTitle>Update Department</CardTitle><CardDescription>Update the department information.</CardDescription></div></div></CardHeader>
      <CardContent>
        <form onSubmit={(event) => { event.preventDefault(); form.handleSubmit(); }} className="space-y-7">
          <div className="grid gap-4 md:grid-cols-2">
            {field("name", "Name")}
            {field("code", "Code")}
            {field("building", "Building")}
            {field("phone", "Phone", "tel")}
            {field("email", "Email", "email")}
            <form.Field name="facultyId">{(control) => <div className="space-y-2"><Label>Faculty</Label><Select value={control.state.value} onValueChange={(value) => control.handleChange(value ?? "")}><SelectTrigger className="w-full"><SelectValue placeholder="Select faculty">{faculties.find((faculty) => faculty.id === control.state.value)?.name ?? "Select faculty"}</SelectValue></SelectTrigger><SelectContent>{faculties.map((faculty) => <SelectItem key={faculty.id} value={faculty.id}>{faculty.name}</SelectItem>)}</SelectContent></Select></div>}</form.Field>
            <form.Field name="description">{(control) => <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea value={control.state.value || ""} onChange={(event) => control.handleChange(event.target.value)} onBlur={control.handleBlur} /></div>}</form.Field>
          </div>
          <div className="flex justify-end gap-3 border-t pt-5"><Button type="button" variant="outline" disabled={isPending || isSubmitting} onClick={() => router.back()}>Cancel</Button><Button type="submit" disabled={isPending || isSubmitting}><Save className="mr-2 size-4" />{isPending || isSubmitting ? "Saving..." : "Save Changes"}</Button></div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdateDepartmentForm;
