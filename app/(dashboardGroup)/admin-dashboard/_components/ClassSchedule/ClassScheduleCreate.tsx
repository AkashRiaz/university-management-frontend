"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import {
  Building2,
  CalendarDays,
  Clock3,
  DoorOpen,
  Loader2,
  Pencil,
  Plus,
} from "lucide-react";
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
import { CreateClassScheduleZodSchema } from "@/components/validations/class-schedule.validation";
import { IDepartment } from "@/types/department.type";
import { IRoom } from "@/types/room.type";
import { ISection } from "@/types/section.type";
import { IClassSchedule } from "@/types/class-schedule.type";
import {
  createClassScheduleAction,
  updateClassScheduleAction,
} from "../../_actions/classScheduleActions";

const days = [
  [1, "Monday"],
  [2, "Tuesday"],
  [3, "Wednesday"],
  [4, "Thursday"],
  [5, "Friday"],
  [6, "Saturday"],
  [7, "Sunday"],
] as const;

type ClassScheduleCreateProps = {
  schedule?: IClassSchedule;
  departments: IDepartment[];
  sections: ISection[];
  rooms: IRoom[];
  trigger?: "add" | "edit";
};

type ClassScheduleFormValues = {
  dayOfWeek: number[];
  startTime: string;
  endTime: string;
  sectionId: string;
  roomId?: string;
  departmentId: string;
};

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

const ClassScheduleForm = ({
  schedule,
  departments,
  sections,
  rooms,
  isEdit,
  onClose,
  onSuccess,
}: {
  schedule?: IClassSchedule;
  departments: IDepartment[];
  sections: ISection[];
  rooms: IRoom[];
  isEdit: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const action = isEdit ? updateClassScheduleAction : createClassScheduleAction;
  const [state, formAction, isSubmitting] = useActionState(action, null);
  const [isPending, startTransition] = useTransition();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(
    schedule?.departmentId ?? schedule?.department?.id ?? "",
  );
  const [selectedSectionId, setSelectedSectionId] = useState(
    schedule?.sectionId ?? schedule?.section?.id ?? "",
  );
  const defaultValues: ClassScheduleFormValues = {
    dayOfWeek: schedule ? [schedule.dayOfWeek] : [],
    startTime: schedule?.startTime ?? "",
    endTime: schedule?.endTime ?? "",
    sectionId: schedule?.sectionId ?? schedule?.section?.id ?? "",
    roomId:
      schedule?.roomId ?? schedule?.room?.id ?? schedule?.section?.roomId ?? "",
    departmentId: schedule?.departmentId ?? schedule?.department?.id ?? "",
  };
  const form = useForm({
    defaultValues,
    validators: { onSubmit: CreateClassScheduleZodSchema },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      if (schedule?.id) formData.append("id", schedule.id);
      formData.append("dayOfWeek", JSON.stringify(value.dayOfWeek));
      formData.append("startTime", value.startTime);
      formData.append("endTime", value.endTime);
      formData.append("sectionId", value.sectionId);
      formData.append("departmentId", value.departmentId);
      if (value.roomId) formData.append("roomId", value.roomId);
      startTransition(() => formAction(formData));
    },
  });

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      onSuccess();
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [onSuccess, state]);

  const availableSections = sections.filter(
    (section) => section.departmentId === selectedDepartmentId,
  );
  const selectedSection = sections.find(
    (section) => section.id === selectedSectionId,
  );
  const showError = (error: unknown) =>
    String((error as { message?: unknown })?.message ?? error);

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <CalendarDays className="size-5 text-primary" />
          {isEdit ? "Edit Class Schedule" : "Add Class Schedule"}
        </DialogTitle>
        <DialogDescription>
          Assign a section to a day, time, and room.
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
                      setSelectedSectionId("");
                      form.setFieldValue("sectionId", "");
                      form.setFieldValue("roomId", "");
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <Building2 className="size-4 text-muted-foreground" />
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
          <form.Field name="sectionId">
            {(field) => {
              const section = sections.find(
                (item) => item.id === field.state.value,
              );
              return (
                <div className="space-y-2">
                  <Label>
                    Section <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={field.state.value}
                    disabled={!selectedDepartmentId}
                    onValueChange={(value) => {
                      const sectionId = value ?? "";
                      const nextSection = sections.find(
                        (item) => item.id === sectionId,
                      );
                      field.handleChange(sectionId);
                      setSelectedSectionId(sectionId);
                      form.setFieldValue("roomId", nextSection?.roomId ?? "");
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          selectedDepartmentId
                            ? availableSections.length
                              ? "Select section"
                              : "No sections for department"
                            : "Select department first"
                        }
                      >
                        {section?.name ||
                          (selectedDepartmentId
                            ? "Select section"
                            : "Select department first")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {availableSections.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
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
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <form.Field name="dayOfWeek">
            {(field) => (
              <div className="space-y-2 sm:col-span-3">
                <Label>
                  Days <span className="text-destructive">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                  {days.map(([value, label]) => {
                    const selected = field.state.value.includes(value);
                    return (
                      <Button
                        key={value}
                        type="button"
                        variant={selected ? "default" : "outline"}
                        aria-pressed={selected}
                        className="w-full"
                        onClick={() =>
                          field.handleChange(
                            selected
                              ? field.state.value.filter((day) => day !== value)
                              : [...field.state.value, value].sort(
                                  (first, second) => first - second,
                                ),
                          )
                        }
                      >
                        {label}
                      </Button>
                    );
                  })}
                </div>
                {field.state.value.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Selected:{" "}
                    {field.state.value
                      .map((day) => days[day - 1][1])
                      .join(", ")}
                  </p>
                )}
                {field.state.meta.isTouched &&
                  field.state.meta.errors.map((error, index) => (
                    <p key={index} className="text-xs text-destructive">
                      {showError(error)}
                    </p>
                  ))}
              </div>
            )}
          </form.Field>
          {(["startTime", "endTime"] as const).map((name) => (
            <form.Field key={name} name={name}>
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>
                    {name === "startTime" ? "Start time" : "End time"}{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Clock3 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id={field.name}
                      type="time"
                      className="pl-9"
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      onBlur={field.handleBlur}
                    />
                  </div>
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.map((error, index) => (
                      <p key={index} className="text-xs text-destructive">
                        {showError(error)}
                      </p>
                    ))}
                </div>
              )}
            </form.Field>
          ))}
        </div>

        <form.Field name="roomId">
          {(field) => {
            const selectedRoom = rooms.find(
              (room) => room.id === field.state.value,
            );
            const sectionHasRoom = Boolean(selectedSection?.roomId);
            return (
              <div className="space-y-2">
                <Label>Room</Label>
                <Select
                  value={field.state.value}
                  disabled={!selectedSection || sectionHasRoom}
                  onValueChange={(value) =>
                    field.handleChange(value === "none" ? "" : (value ?? ""))
                  }
                >
                  <SelectTrigger className="w-full">
                    <DoorOpen className="size-4 text-muted-foreground" />
                    <SelectValue
                      placeholder={
                        !selectedSection
                          ? "Select section first"
                          : sectionHasRoom
                            ? "Room assigned to section"
                            : "Select room"
                      }
                    >
                      {selectedRoom
                        ? `${selectedRoom.building} ${selectedRoom.roomNumber}`
                        : !selectedSection
                          ? "Select section first"
                          : sectionHasRoom
                            ? "Room assigned to section"
                            : "Select room"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No room assigned</SelectItem>
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

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isPending || isSubmitting}
          >
            {(isPending || isSubmitting) && (
              <Loader2 className="animate-spin" />
            )}
            {isEdit ? "Save Changes" : "Create Schedule"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default ClassScheduleCreate;
