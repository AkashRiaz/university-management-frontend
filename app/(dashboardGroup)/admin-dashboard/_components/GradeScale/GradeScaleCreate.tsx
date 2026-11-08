"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { IGradeScale } from "@/types/grade-scale.type";
import DialogFormSkeleton from "@/components/shared/DialogFormSkeleton";

type GradeScaleCreateProps = {
  gradeScale?: IGradeScale;
  trigger?: "add" | "edit";
};

// The form (form library, zod schema and all fields) is code-split into its own
// chunk and only downloaded when the dialog is opened (or the button is hovered).
const loadGradeScaleForm = () => import("./GradeScaleForm");
const preloadGradeScaleForm = () => {
  void loadGradeScaleForm();
};
const GradeScaleForm = dynamic(loadGradeScaleForm, {
  ssr: false,
  loading: () => <DialogFormSkeleton />,
});

const GradeScaleCreate = ({
  gradeScale,
  trigger = "add",
}: GradeScaleCreateProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(gradeScale);

  return (
    <>
      <Button
        type="button"
        variant={isEdit ? "outline" : "default"}
        size={isEdit ? "sm" : "default"}
        onClick={() => setOpen(true)}
        onPointerEnter={preloadGradeScaleForm}
        onFocus={preloadGradeScaleForm}
      >
        {isEdit ? <Pencil /> : <Plus />}
        {isEdit ? "Edit" : "Add Grade Scale"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <GradeScaleForm
            key={gradeScale?.id ?? "new"}
            gradeScale={gradeScale}
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

export default GradeScaleCreate;
