"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { IInstructor } from "@/types/instructor.type";
import { ISectionInstructor } from "@/types/section-instructor.type";
import DialogFormSkeleton from "@/components/shared/DialogFormSkeleton";


// The form (form library, zod schema and all fields) is code-split into its own
// chunk and only downloaded when the dialog is opened (or the button is hovered).
const loadSectionInstructorForm = () => import("./SectionInstructorForm");
const preloadSectionInstructorForm = () => {
  void loadSectionInstructorForm();
};
const SectionInstructorForm = dynamic(loadSectionInstructorForm, {
  ssr: false,
  loading: () => <DialogFormSkeleton />,
});

const SectionInstructorCreate = ({
  sectionId,
  instructors,
  assignment,
  onSuccess,
  trigger = "add",
}: {
  sectionId: string;
  instructors: IInstructor[];
  assignment?: ISectionInstructor;
  onSuccess: () => void;
  trigger?: "add" | "edit";
}) => {
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(assignment);
  return (
    <>
      <Button type="button" variant={isEdit ? "outline" : "default"} size={isEdit ? "sm" : "default"} onClick={() => setOpen(true)}
        onPointerEnter={preloadSectionInstructorForm}
        onFocus={preloadSectionInstructorForm}>
        {isEdit ? <Pencil /> : <Plus />}
        {isEdit ? "Edit" : "Assign Instructor"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <SectionInstructorForm
            key={assignment?.id ?? "new"}
            sectionId={sectionId}
            instructors={instructors}
            assignment={assignment}
            isEdit={isEdit}
            onSuccess={() => {
              setOpen(false);
              onSuccess();
            }}
          />
        )}
      </Dialog>
    </>
  );
};

export default SectionInstructorCreate;
