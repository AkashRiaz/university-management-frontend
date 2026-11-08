"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { IGrade } from "@/types/grade.type";
import { IGradeScale } from "@/types/grade-scale.type";
import DialogFormSkeleton from "@/components/shared/DialogFormSkeleton";

type GradeCreateProps = {
  grade?: IGrade;
  gradeScales: IGradeScale[];
  fixedGradeScaleId?: string;
  trigger?: "add" | "edit";
};

// The form (form library, zod schema and all fields) is code-split into its own
// chunk and only downloaded when the dialog is opened (or the button is hovered).
const loadGradeForm = () => import("./GradeForm");
const preloadGradeForm = () => {
  void loadGradeForm();
};
const GradeForm = dynamic(loadGradeForm, {
  ssr: false,
  loading: () => <DialogFormSkeleton />,
});

const GradeCreate = ({
  grade,
  gradeScales,
  fixedGradeScaleId,
  trigger = "add",
}: GradeCreateProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(grade);

  return (
    <>
      <Button
        type="button"
        variant={isEdit ? "outline" : "default"}
        size={isEdit ? "sm" : "default"}
        onClick={() => setOpen(true)}
        onPointerEnter={preloadGradeForm}
        onFocus={preloadGradeForm}
        className="shrink-0 whitespace-nowrap"
      >
        {isEdit ? <Pencil /> : <Plus />}
        {isEdit ? "Edit" : "Add Grade"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <GradeForm
            key={grade?.id ?? "new"}
            grade={grade}
            gradeScales={gradeScales}
            fixedGradeScaleId={fixedGradeScaleId}
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

export default GradeCreate;
