"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { IAcademicYear } from "@/types/academic-year.type";
import DialogFormSkeleton from "@/components/shared/DialogFormSkeleton";

type AcademicYearCreateProps = {
  academicYear?: IAcademicYear;
  trigger?: "add" | "edit";
};

// The form (form library, zod schema and all fields) is code-split into its own
// chunk and only downloaded when the dialog is opened (or the button is hovered).
const loadAcademicYearForm = () => import("./AcademicYearForm");
const preloadAcademicYearForm = () => {
  void loadAcademicYearForm();
};
const AcademicYearForm = dynamic(loadAcademicYearForm, {
  ssr: false,
  loading: () => <DialogFormSkeleton />,
});

const AcademicYearCreate = ({
  academicYear,
  trigger = "add",
}: AcademicYearCreateProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(academicYear);

  return (
    <>
      <Button
        type="button"
        variant={isEdit ? "outline" : "default"}
        size={isEdit ? "sm" : "default"}
        onClick={() => setOpen(true)}
        onPointerEnter={preloadAcademicYearForm}
        onFocus={preloadAcademicYearForm}
      >
        {isEdit ? <Pencil /> : <Plus />}
        {isEdit ? "Edit" : "Add Academic Year"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <AcademicYearForm
            key={academicYear?.id ?? "new"}
            academicYear={academicYear}
            isEdit={isEdit}
            onClose={() => setOpen(false)}
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

export default AcademicYearCreate;
