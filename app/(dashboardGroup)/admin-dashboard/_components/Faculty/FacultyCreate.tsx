"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { IFaculty } from "@/types/faculty.type";
import DialogFormSkeleton from "@/components/shared/DialogFormSkeleton";

type FacultyCreateProps = {
  faculty?: IFaculty;
  trigger?: "add" | "edit";
};

// The form (form library, zod schema and all fields) is code-split into its own
// chunk and only downloaded when the dialog is opened (or the button is hovered).
const loadFacultyForm = () => import("./FacultyForm");
const preloadFacultyForm = () => {
  void loadFacultyForm();
};
const FacultyForm = dynamic(loadFacultyForm, {
  ssr: false,
  loading: () => <DialogFormSkeleton />,
});

const FacultyCreate = ({ faculty, trigger = "add" }: FacultyCreateProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(faculty);

  return (
    <>
      <Button
        type="button"
        variant={isEdit ? "outline" : "default"}
        size={isEdit ? "sm" : "default"}
        onClick={() => setOpen(true)}
        onPointerEnter={preloadFacultyForm}
        onFocus={preloadFacultyForm}
      >
        {isEdit ? <Pencil /> : <Plus />}
        {isEdit ? "Edit" : "Add Faculty"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <FacultyForm
            key={faculty?.id ?? "new"}
            faculty={faculty}
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

export default FacultyCreate;
