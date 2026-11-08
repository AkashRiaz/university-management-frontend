"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { IScholarship } from "@/types/scholarship.type";
import DialogFormSkeleton from "@/components/shared/DialogFormSkeleton";

type ScholarshipCreateProps = {
  scholarship?: IScholarship;
  trigger?: "add" | "edit";
};

// The form (form library, zod schema and all fields) is code-split into its own
// chunk and only downloaded when the dialog is opened (or the button is hovered).
const loadScholarshipForm = () => import("./ScholarshipForm");
const preloadScholarshipForm = () => {
  void loadScholarshipForm();
};
const ScholarshipForm = dynamic(loadScholarshipForm, {
  ssr: false,
  loading: () => <DialogFormSkeleton />,
});

const ScholarshipCreate = ({
  scholarship,
  trigger = "add",
}: ScholarshipCreateProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(scholarship);

  return (
    <>
      <Button
        type="button"
        variant={isEdit ? "outline" : "default"}
        size={isEdit ? "sm" : "default"}
        onClick={() => setOpen(true)}
        onPointerEnter={preloadScholarshipForm}
        onFocus={preloadScholarshipForm}
        className="shrink-0 whitespace-nowrap"
      >
        {isEdit ? <Pencil /> : <Plus />}
        {isEdit ? "Edit" : "Add Scholarship"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <ScholarshipForm
            key={scholarship?.id ?? "new"}
            scholarship={scholarship}
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

export default ScholarshipCreate;
