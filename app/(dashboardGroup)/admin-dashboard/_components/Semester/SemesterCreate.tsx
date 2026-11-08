"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { IAcademicYear } from "@/types/academic-year.type";
import { ISemester } from "@/types/semester.type";
import DialogFormSkeleton from "@/components/shared/DialogFormSkeleton";

type SemesterCreateProps = {
  semester?: ISemester;
  academicYears: IAcademicYear[];
  trigger?: "add" | "edit";
};

// The form (form library, zod schema and all fields) is code-split into its own
// chunk and only downloaded when the dialog is opened (or the button is hovered).
const loadSemesterForm = () => import("./SemesterForm");
const preloadSemesterForm = () => {
  void loadSemesterForm();
};
const SemesterForm = dynamic(loadSemesterForm, {
  ssr: false,
  loading: () => <DialogFormSkeleton />,
});

const SemesterCreate = ({
  semester,
  academicYears,
  trigger = "add",
}: SemesterCreateProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(semester);

  return (
    <>
      <Button
        type="button"
        variant={isEdit ? "outline" : "default"}
        size={isEdit ? "sm" : "default"}
        onClick={() => setOpen(true)}
        onPointerEnter={preloadSemesterForm}
        onFocus={preloadSemesterForm}
      >
        {isEdit ? <Pencil /> : <Plus />}
        {isEdit ? "Edit" : "Add Semester"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <SemesterForm
            key={semester?.id ?? "new"}
            semester={semester}
            academicYears={academicYears}
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

export default SemesterCreate;
