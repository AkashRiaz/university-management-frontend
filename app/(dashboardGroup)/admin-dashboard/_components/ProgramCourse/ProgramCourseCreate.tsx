"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { ICourse } from "@/types/course.type";
import { Program } from "@/types/program.type";
import { IProgramCourse } from "@/types/program-course.type";
import DialogFormSkeleton from "@/components/shared/DialogFormSkeleton";

type ProgramCourseCreateProps = {
  programCourse?: IProgramCourse;
  programs: Program[];
  courses: ICourse[];
  trigger?: "add" | "edit";
};

// The form (form library, zod schema and all fields) is code-split into its own
// chunk and only downloaded when the dialog is opened (or the button is hovered).
const loadProgramCourseForm = () => import("./ProgramCourseForm");
const preloadProgramCourseForm = () => {
  void loadProgramCourseForm();
};
const ProgramCourseForm = dynamic(loadProgramCourseForm, {
  ssr: false,
  loading: () => <DialogFormSkeleton />,
});

const ProgramCourseCreate = ({
  programCourse,
  programs,
  courses,
  trigger = "add",
}: ProgramCourseCreateProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(programCourse);

  return (
    <>
      <Button
        type="button"
        variant={isEdit ? "outline" : "default"}
        size={isEdit ? "sm" : "default"}
        className="shrink-0 whitespace-nowrap"
        onClick={() => setOpen(true)}
        onPointerEnter={preloadProgramCourseForm}
        onFocus={preloadProgramCourseForm}
      >
        {isEdit ? <Pencil /> : <Plus />}
        {isEdit ? "Edit" : "Assign Course"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <ProgramCourseForm
            key={programCourse?.id ?? "new"}
            programCourse={programCourse}
            programs={programs}
            courses={courses}
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

export default ProgramCourseCreate;
