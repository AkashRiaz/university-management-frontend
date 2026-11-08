"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { IStudentScholarship, IStudentScholarshipStudent } from "@/types/student-scholarship.type";
import { IScholarship } from "@/types/scholarship.type";
import { ISemester } from "@/types/semester.type";
import DialogFormSkeleton from "@/components/shared/DialogFormSkeleton";

type StudentScholarshipCreateProps = {
  students: IStudentScholarshipStudent[];
  scholarships: IScholarship[];
  semesters: ISemester[];
  record?: IStudentScholarship;
  trigger?: "add" | "edit";
};

// The form (form library, zod schema and all fields) is code-split into its own
// chunk and only downloaded when the dialog is opened (or the button is hovered).
const loadStudentScholarshipForm = () => import("./StudentScholarshipForm");
const preloadStudentScholarshipForm = () => {
  void loadStudentScholarshipForm();
};
const StudentScholarshipForm = dynamic(loadStudentScholarshipForm, {
  ssr: false,
  loading: () => <DialogFormSkeleton />,
});

const StudentScholarshipCreate = ({
  students,
  scholarships,
  semesters,
  record,
  trigger = "add",
}: StudentScholarshipCreateProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(record);

  return (
    <>
      <Button
        type="button"
        variant={isEdit ? "outline" : "default"}
        size={isEdit ? "sm" : "default"}
        onClick={() => setOpen(true)}
        onPointerEnter={preloadStudentScholarshipForm}
        onFocus={preloadStudentScholarshipForm}
        className="shrink-0 whitespace-nowrap"
      >
        {isEdit ? <Pencil /> : <Plus />}
        {isEdit ? "Edit" : "Assign Scholarship"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <StudentScholarshipForm
            students={students}
            scholarships={scholarships}
            semesters={semesters}
            record={record}
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

export default StudentScholarshipCreate;
