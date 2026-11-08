"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { IDepartment } from "@/types/department.type";
import { ICourse } from "@/types/course.type";
import DialogFormSkeleton from "@/components/shared/DialogFormSkeleton";

type CourseCreateProps = {
  course?: ICourse;
  departments: IDepartment[];
  trigger?: "add" | "edit";
};

// The form (form library, zod schema and all fields) is code-split into its own
// chunk and only downloaded when the dialog is opened (or the button is hovered).
const loadCourseForm = () => import("./CourseForm");
const preloadCourseForm = () => {
  void loadCourseForm();
};
const CourseForm = dynamic(loadCourseForm, {
  ssr: false,
  loading: () => <DialogFormSkeleton />,
});

const CourseCreate = ({
  course,
  departments,
  trigger = "add",
}: CourseCreateProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(course);

  return (
    <>
      <Button
        type="button"
        variant={isEdit ? "outline" : "default"}
        size={isEdit ? "sm" : "default"}
        onClick={() => setOpen(true)}
        onPointerEnter={preloadCourseForm}
        onFocus={preloadCourseForm}
        className="shrink-0 whitespace-nowrap"
      >
        {isEdit ? <Pencil /> : <Plus />}
        {isEdit ? "Edit" : "Add Course"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <CourseForm
            key={course?.id ?? "new"}
            course={course}
            departments={departments}
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

export default CourseCreate;
