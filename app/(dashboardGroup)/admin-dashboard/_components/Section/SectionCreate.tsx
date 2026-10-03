"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { ClipboardList, Loader2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createSectionAction,
  updateSectionAction,
} from "../../_actions/sectionActions";
import { CreateSectionZodSchema } from "@/components/validations/section.validation";
import { ICourse } from "@/types/course.type";
import { IDepartment } from "@/types/department.type";
import { IRoom } from "@/types/room.type";
import { ISemester } from "@/types/semester.type";
import { ISection, SectionStatus } from "@/types/section.type";

type SectionCreateProps = {
  section?: ISection;
  departments: IDepartment[];
  courses: ICourse[];
  semesters: ISemester[];
  rooms: IRoom[];
  trigger?: "add" | "edit";
};

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

const SectionForm = ({
  section,
  departments,
  courses,
  semesters,
  rooms,
  isEdit,
  onClose,
  onSuccess,
}: {
  section?: ISection;
  departments: IDepartment[];
  courses: ICourse[];
  semesters: ISemester[];
  rooms: IRoom[];
  isEdit: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const action = isEdit ? updateSectionAction : createSectionAction;
  const [state, formAction, isSubmitting] = useActionState(action, null);
  const [isPending, startTransition] = useTransition();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(
    section?.departmentId ?? "",
  );
  const form = useForm({
    defaultValues: {
      name: section?.name ?? "",
      capacity: section?.capacity ?? 1,
      status: section?.status ?? "OPEN",
      courseId: section?.courseId ?? "",
      semesterId: section?.semesterId ?? "",
      departmentId: section?.departmentId ?? "",
      roomId: section?.roomId ?? "",
    },
    validators: { onSubmit: CreateSectionZodSchema },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      if (section?.id) formData.append("id", section.id);
      formData.append("name", value.name);
      formData.append("capacity", String(value.capacity));
      formData.append("status", value.status);
      formData.append("courseId", value.courseId);
      formData.append("semesterId", value.semesterId);
      formData.append("departmentId", value.departmentId);
      if (value.roomId) formData.append("roomId", value.roomId);
      startTransition(() => formAction(formData));
    },
  });

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      onSuccess();
    } else if (state?.success === false) toast.error(state.message);
  }, [onSuccess, state]);

  const availableCourses = courses.filter(
    (course) => course.departmentId === selectedDepartmentId,
  );
  const showError = (error: unknown) =>
    String((error as { message?: unknown })?.message ?? error);

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <ClipboardList className="size-5 text-primary" />
          {isEdit ? "Edit Section" : "Add Section"}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update the section information."
            : "Enter the section information."}
        </DialogDescription>
      </DialogHeader>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  Section Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="e.g. Section A"
                />
                {field.state.meta.isTouched &&
                  field.state.meta.errors.map((error, index) => (
                    <p key={index} className="text-xs text-destructive">
                      {showError(error)}
                    </p>
                  ))}
              </div>
            )}
          </form.Field>
          <form.Field name="capacity">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  Capacity <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={field.name}
                  type="number"
                  min="1"
                  step="1"
                  value={field.state.value}
                  onChange={(event) =>
                    field.handleChange(Number(event.target.value))
                  }
                  onBlur={field.handleBlur}
                />
                {field.state.meta.isTouched &&
                  field.state.meta.errors.map((error, index) => (
                    <p key={index} className="text-xs text-destructive">
                      {showError(error)}
                    </p>
                  ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Field name="departmentId">
          {(field) => {
            const selectedDepartment = departments.find(
              (department) => department.id === field.state.value,
            );
            return (
              <div className="space-y-2">
                <Label>
                  Department <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => {
                    const departmentId = value ?? "";
                    field.handleChange(departmentId);
                    setSelectedDepartmentId(departmentId);
                    form.setFieldValue("courseId", "");
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select department">
                      {selectedDepartment?.name || "Select department"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.state.meta.isTouched &&
                  field.state.meta.errors.map((error, index) => (
                    <p key={index} className="text-xs text-destructive">
                      {showError(error)}
                    </p>
                  ))}
              </div>
            );
          }}
        </form.Field>

        <form.Field name="courseId">
          {(field) => {
            const selectedCourse = courses.find(
              (course) => course.id === field.state.value,
            );
            return (
              <div className="space-y-2">
                <Label>
                  Course <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={field.state.value}
                  disabled={
                    !selectedDepartmentId || availableCourses.length === 0
                  }
                  onValueChange={(value) => field.handleChange(value ?? "")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        !selectedDepartmentId
                          ? "Select department first"
                          : availableCourses.length === 0
                            ? "No courses for department"
                            : "Select course"
                      }
                    >
                      {selectedCourse
                        ? `${selectedCourse.code} - ${selectedCourse.title}${selectedCourse.department?.code ? ` (${selectedCourse.department.code})` : ""}`
                        : !selectedDepartmentId
                          ? "Select department first"
                          : availableCourses.length === 0
                            ? "No courses for department"
                            : "Select course"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {availableCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.department?.code
                          ? `${course.code} - ${course.title} (${course.department.code})`
                          : `${course.code} - ${course.title}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.state.meta.isTouched &&
                  field.state.meta.errors.map((error, index) => (
                    <p key={index} className="text-xs text-destructive">
                      {showError(error)}
                    </p>
                  ))}
              </div>
            );
          }}
        </form.Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <form.Field name="semesterId">
            {(field) => {
              const selectedSemester = semesters.find(
                (semester) => semester.id === field.state.value,
              );
              return (
                <div className="space-y-2">
                  <Label>
                    Semester <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value ?? "")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select semester">
                        {selectedSemester
                          ? `${selectedSemester.name} semester`
                          : "Select semester"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map((semester) => (
                        <SelectItem key={semester.id} value={semester.id}>
                          {semester.name} semester (
                          {semester.academicYear?.name ||
                            semester.academicYearId}
                          )
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.map((error, index) => (
                      <p key={index} className="text-xs text-destructive">
                        {showError(error)}
                      </p>
                    ))}
                </div>
              );
            }}
          </form.Field>
          <form.Field name="roomId">
            {(field) => {
              const selectedRoom = rooms.find(
                (room) => room.id === field.state.value,
              );
              return (
                <div className="space-y-2">
                  <Label>Room</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value === "none" ? "" : (value ?? ""))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select room">
                        {selectedRoom
                          ? `${selectedRoom.building} ${selectedRoom.roomNumber}`
                          : "Select room"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No room</SelectItem>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.building} {room.roomNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            }}
          </form.Field>
          <form.Field name="status">
            {(field) => (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value ?? "OPEN")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      [
                        "OPEN",
                        "CLOSED",
                        "FULL",
                        "CANCELLED",
                        "COMPLETED",
                      ] as SectionStatus[]
                    ).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || isSubmitting}>
            {(isPending || isSubmitting) && (
              <Loader2 className="animate-spin" />
            )}
            {isEdit ? "Save Changes" : "Create Section"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default SectionCreate;
