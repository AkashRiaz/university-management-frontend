"use client";

import { useActionState, useEffect, useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { BookIcon, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateProgramInput, CreateProgramZodSchema } from "@/components/validations/program.validation";
import { IDepartment } from "@/types/department.type";
import { Program } from "@/types/program.type";
import { updateProgramAction } from "../../_actions/programActions";

const UpdateProgramForm = ({ program, departments }: { program: Program; departments: IDepartment[] }) => {
  const router = useRouter();
  const [state, formAction, isSubmitting] = useActionState(updateProgramAction, null);
  const [isPending, startTransition] = useTransition();
  const defaultValues: CreateProgramInput = {
      name: program.name || "",
      code: program.code || "",
      description: program.description || "",
      durationYears: Number(program.durationYears || 0),
      totalCredits: Number(program.totalCredits || 0),
      departmentId: program.departmentId || "",
    };
  const form = useForm({
    defaultValues,
    validators: { onSubmit: CreateProgramZodSchema },
    onSubmit: async ({ value }) => {
      const data = new FormData();
      data.append("id", program.id);
      Object.entries(value).forEach(([key, item]) => data.append(key, String(item ?? "")));
      startTransition(() => formAction(data));
    },
  });

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      router.push("/admin-dashboard/programs");
      router.refresh();
    } else if (state?.success === false) toast.error(state.message);
  }, [router, state]);

  return (
    <Card>
      <CardHeader><div className="flex items-center gap-3"><div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><BookIcon className="size-5" /></div><div><CardTitle>Update Program</CardTitle><CardDescription>Update the program information.</CardDescription></div></div></CardHeader>
      <CardContent>
        <form onSubmit={(event) => { event.preventDefault(); form.handleSubmit(); }} className="space-y-7">
          <div className="grid gap-4 md:grid-cols-2">
            <form.Field name="name">{(field) => <div className="space-y-2"><Label>Name</Label><Input value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} onBlur={field.handleBlur} /></div>}</form.Field>
            <form.Field name="code">{(field) => <div className="space-y-2"><Label>Code</Label><Input value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} onBlur={field.handleBlur} /></div>}</form.Field>
            <form.Field name="durationYears">{(field) => <div className="space-y-2"><Label>Duration in Years</Label><Input type="number" min={1} value={field.state.value} onChange={(event) => field.handleChange(Number(event.target.value))} onBlur={field.handleBlur} /></div>}</form.Field>
            <form.Field name="totalCredits">{(field) => <div className="space-y-2"><Label>Total Credits</Label><Input type="number" min={1} value={field.state.value} onChange={(event) => field.handleChange(Number(event.target.value))} onBlur={field.handleBlur} /></div>}</form.Field>
            <form.Field name="departmentId">{(field) => <div className="space-y-2"><Label>Department</Label><Select value={field.state.value} onValueChange={(value) => field.handleChange(value ?? "")}><SelectTrigger className="w-full"><SelectValue placeholder="Select department">{departments.find((department) => department.id === field.state.value)?.name ?? "Select department"}</SelectValue></SelectTrigger><SelectContent>{departments.map((department) => <SelectItem key={department.id} value={department.id}>{department.name}</SelectItem>)}</SelectContent></Select></div>}</form.Field>
            <form.Field name="description">{(field) => <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea value={field.state.value || ""} onChange={(event) => field.handleChange(event.target.value)} onBlur={field.handleBlur} /></div>}</form.Field>
          </div>
          <div className="flex justify-end gap-3 border-t pt-5"><Button type="button" variant="outline" disabled={isPending || isSubmitting} onClick={() => router.back()}>Cancel</Button><Button type="submit" disabled={isPending || isSubmitting}><Save className="mr-2 size-4" />{isPending || isSubmitting ? "Saving..." : "Save Changes"}</Button></div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdateProgramForm;
