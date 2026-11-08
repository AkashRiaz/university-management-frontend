"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { ICourse } from "@/types/course.type";
import { IDepartment } from "@/types/department.type";
import { IRoom } from "@/types/room.type";
import { ISemester } from "@/types/semester.type";
import { ISection } from "@/types/section.type";
import DialogFormSkeleton from "@/components/shared/DialogFormSkeleton";

type SectionCreateProps = {
  section?: ISection;
  departments: IDepartment[];
  courses: ICourse[];
  semesters: ISemester[];
  rooms: IRoom[];
  trigger?: "add" | "edit";
};

// The form (form library, zod schema and all fields) is code-split into its own
// chunk and only downloaded when the dialog is opened (or the button is hovered).
const loadSectionForm = () => import("./SectionForm");
const preloadSectionForm = () => {
  void loadSectionForm();
};
const SectionForm = dynamic(loadSectionForm, {
  ssr: false,
  loading: () => <DialogFormSkeleton />,
});

const SectionCreate = ({
  section,
  departments,
  courses,
  semesters,
  rooms,
  trigger = "add",
}: SectionCreateProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(section);
  return (
    <>
      <Button
        type="button"
        variant={isEdit ? "outline" : "default"}
        size={isEdit ? "sm" : "default"}
        className="shrink-0 whitespace-nowrap"
        onClick={() => setOpen(true)}
        onPointerEnter={preloadSectionForm}
        onFocus={preloadSectionForm}
      >
        {isEdit ? <Pencil /> : <Plus />}
        {isEdit ? "Edit" : "Add Section"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <SectionForm
            key={section?.id ?? "new"}
            section={section}
            departments={departments}
            courses={courses}
            semesters={semesters}
            rooms={rooms}
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

export default SectionCreate;
