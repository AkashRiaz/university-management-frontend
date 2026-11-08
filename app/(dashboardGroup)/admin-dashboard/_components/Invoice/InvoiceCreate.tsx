"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Student } from "../../_actions/studentActions";
import { ISemester } from "@/types/semester.type";
import { IInvoice } from "@/types/invoice.type";
import DialogFormSkeleton from "@/components/shared/DialogFormSkeleton";

type InvoiceCreateProps = {
  invoice?: IInvoice;
  students: Student[];
  semesters: ISemester[];
  trigger?: "add" | "edit";
};

// The form (form library, zod schema and all fields) is code-split into its own
// chunk and only downloaded when the dialog is opened (or the button is hovered).
const loadInvoiceForm = () => import("./InvoiceForm");
const preloadInvoiceForm = () => {
  void loadInvoiceForm();
};
const InvoiceForm = dynamic(loadInvoiceForm, {
  ssr: false,
  loading: () => <DialogFormSkeleton />,
});

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
        onPointerEnter={preloadInvoiceForm}
        onFocus={preloadInvoiceForm}
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

export default InvoiceCreate;
