"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Program } from "@/types/program.type";
import { ISemester } from "@/types/semester.type";
import { IFeeStructure } from "@/types/fee-structure.type";
import DialogFormSkeleton from "@/components/shared/DialogFormSkeleton";

type FeeStructureCreateProps = {
  feeStructure?: IFeeStructure;
  programs: Program[];
  semesters: ISemester[];
  trigger?: "add" | "edit";
};

// The form (form library, zod schema and all fields) is code-split into its own
// chunk and only downloaded when the dialog is opened (or the button is hovered).
const loadFeeStructureForm = () => import("./FeeStructureForm");
const preloadFeeStructureForm = () => {
  void loadFeeStructureForm();
};
const FeeStructureForm = dynamic(loadFeeStructureForm, {
  ssr: false,
  loading: () => <DialogFormSkeleton />,
});

const FeeStructureCreate = ({
  feeStructure,
  programs,
  semesters,
  trigger = "add",
}: FeeStructureCreateProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(feeStructure);

  return (
    <>
      <Button
        type="button"
        variant={isEdit ? "outline" : "default"}
        size={isEdit ? "sm" : "default"}
        onClick={() => setOpen(true)}
        onPointerEnter={preloadFeeStructureForm}
        onFocus={preloadFeeStructureForm}
        className="shrink-0 whitespace-nowrap"
      >
        {isEdit ? <Pencil /> : <Plus />}
        {isEdit ? "Edit" : "Add Fee Structure"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <FeeStructureForm
            key={feeStructure?.id ?? "new"}
            feeStructure={feeStructure}
            programs={programs}
            semesters={semesters}
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

export default FeeStructureCreate;
