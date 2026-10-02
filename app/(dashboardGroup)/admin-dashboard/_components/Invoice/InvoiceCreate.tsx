"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { CalendarClock, Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Student } from "../../_actions/studentActions";
import { ISemester } from "@/types/semester.type";
import { IInvoice } from "@/types/invoice.type";
import {
  createInvoiceAction,
  updateInvoiceAction,
} from "../../_actions/invoiceActions";

type InvoiceCreateProps = {
  invoice?: IInvoice;
  students: Student[];
  semesters: ISemester[];
  trigger?: "add" | "edit";
};

const dateInputValue = (date?: string | null) => date?.slice(0, 10) || "";

const InvoiceCreate = ({
  invoice,
  students,
  semesters,
  trigger = "add",
}: InvoiceCreateProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(invoice);

  return (
    <>
      <Button
        type="button"
        variant={isEdit ? "outline" : "default"}
        size={isEdit ? "sm" : "default"}
        onClick={() => setOpen(true)}
      >
        {isEdit ? <Pencil /> : <Plus />}
        {isEdit ? "Edit" : "Add Invoice"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <InvoiceForm
            key={invoice?.id ?? "new"}
            invoice={invoice}
            students={students}
            semesters={semesters}
            isEdit={isEdit}
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

const InvoiceForm = ({
  invoice,
  students,
  semesters,
  isEdit,
  onSuccess,
}: {
  invoice?: IInvoice;
  students: Student[];
  semesters: ISemester[];
  isEdit: boolean;
  onSuccess: () => void;
}) => {
  const action = isEdit ? updateInvoiceAction : createInvoiceAction;
  const [state, formAction, isSubmitting] = useActionState(action, null);
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    defaultValues: {
      studentId: invoice?.studentId ?? "",
      semesterId: invoice?.semesterId ?? "",
      dueDate: dateInputValue(invoice?.dueDate),
      discount: invoice?.discount ?? 0,
      tax: invoice?.tax ?? 0,
      status: invoice?.status ?? "DRAFT",
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      if (invoice?.id) formData.append("id", invoice.id);
      formData.append("studentId", value.studentId);
      formData.append("semesterId", value.semesterId);
      formData.append("dueDate", value.dueDate);
      formData.append("discount", String(value.discount ?? 0));
      formData.append("tax", String(value.tax ?? 0));
      if (isEdit) formData.append("status", value.status);
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

  const studentName = (student: Student) =>
    student.user?.name || student.user?.email || student.id;
  const semesterName = (semester: ISemester) =>
    `${semester.name}${semester.academicYear?.name ? ` (${semester.academicYear.name})` : ""}`;
  const loading = isPending || isSubmitting;

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <CalendarClock className="size-5 text-primary" />
          {isEdit ? "Edit Invoice" : "Add Invoice"}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update the invoice information."
            : "Enter the invoice information."}
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
          <form.Field name="studentId">
            {(field) => (
              <div className="space-y-2">
                <Label>Student</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value ?? "")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select student">
                      {students.find((student) => student.id === field.state.value)
                        ? studentName(
                            students.find(
                              (student) => student.id === field.state.value,
                            )!,
                          )
                        : "Select student"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {studentName(student)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>
          <form.Field name="semesterId">
            {(field) => (
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value ?? "")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select semester">
                      {semesters.find((semester) => semester.id === field.state.value)
                        ? semesterName(
                            semesters.find(
                              (semester) => semester.id === field.state.value,
                            )!,
                          )
                        : "Select semester"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester.id} value={semester.id}>
                        {semesterName(semester)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>
          <form.Field name="dueDate">
            {(field) => (
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                />
              </div>
            )}
          </form.Field>
          <form.Field name="discount">
            {(field) => (
              <div className="space-y-2">
                <Label>Discount</Label>
                <Input
                  type="number"
                  min={0}
                  value={field.state.value ?? 0}
                  onChange={(event) =>
                    field.handleChange(Number(event.target.value))
                  }
                />
              </div>
            )}
          </form.Field>
          <form.Field name="tax">
            {(field) => (
              <div className="space-y-2">
                <Label>Tax</Label>
                <Input
                  type="number"
                  min={0}
                  value={field.state.value ?? 0}
                  onChange={(event) =>
                    field.handleChange(Number(event.target.value))
                  }
                />
              </div>
            )}
          </form.Field>
          {isEdit && (
            <form.Field name="status">
              {(field) => (
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value ?? "")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "DRAFT",
                        "ISSUED",
                        "PARTIALLY_PAID",
                        "PAID",
                        "OVERDUE",
                        "CANCELLED",
                      ].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.replaceAll("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>
          )}
        </div>
        <div className="flex justify-end gap-2 border-t pt-4">
          <Button type="button" variant="outline" onClick={() => onSuccess()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Invoice"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default InvoiceCreate;
