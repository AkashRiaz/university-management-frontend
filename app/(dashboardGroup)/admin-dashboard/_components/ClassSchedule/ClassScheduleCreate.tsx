"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { IDepartment } from "@/types/department.type";
import { IRoom } from "@/types/room.type";
import { ISection } from "@/types/section.type";
import { IClassSchedule } from "@/types/class-schedule.type";
import DialogFormSkeleton from "@/components/shared/DialogFormSkeleton";

type ClassScheduleCreateProps = {
  schedule?: IClassSchedule;
  departments: IDepartment[];
  sections: ISection[];
  rooms: IRoom[];
  trigger?: "add" | "edit";
};

// The form (form library, zod schema and all fields) is code-split into its own
// chunk and only downloaded when the dialog is opened (or the button is hovered).
const loadClassScheduleForm = () => import("./ClassScheduleForm");
const preloadClassScheduleForm = () => {
  void loadClassScheduleForm();
};
const ClassScheduleForm = dynamic(loadClassScheduleForm, {
  ssr: false,
  loading: () => <DialogFormSkeleton />,
});

const ClassScheduleCreate = ({
  schedule,
  departments,
  sections,
  rooms,
  trigger = "add",
}: ClassScheduleCreateProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(schedule);

  return (
    <>
      <Button
        type="button"
        variant={isEdit ? "outline" : "default"}
        size={isEdit ? "sm" : "default"}
        className="w-full shrink-0 sm:w-auto"
        onClick={() => setOpen(true)}
        onPointerEnter={preloadClassScheduleForm}
        onFocus={preloadClassScheduleForm}
      >
        {isEdit ? <Pencil /> : <Plus />}
        {isEdit ? "Edit" : "Add Class Schedule"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <ClassScheduleForm
            key={schedule?.id ?? "new"}
            schedule={schedule}
            departments={departments}
            sections={sections}
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

export default ClassScheduleCreate;
