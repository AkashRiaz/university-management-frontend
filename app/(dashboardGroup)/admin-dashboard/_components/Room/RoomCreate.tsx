"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { DoorOpen, Loader2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createRoomAction, updateRoomAction } from "../../_actions/roomActions";
import { CreateRoomZodSchema } from "@/components/validations/room.validation";
import { IRoom } from "@/types/room.type";

type RoomCreateProps = {
  room?: IRoom;
  trigger?: "add" | "edit";
};

const RoomCreate = ({ room, trigger = "add" }: RoomCreateProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(room);

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
        {isEdit ? "Edit" : "Add Room"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <RoomForm
            key={room?.id ?? "new"}
            room={room}
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

const RoomForm = ({
  room,
  isEdit,
  onClose,
  onSuccess,
}: {
  room?: IRoom;
  isEdit: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const action = isEdit ? updateRoomAction : createRoomAction;
  const [state, formAction, isSubmitting] = useActionState(action, null);
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    defaultValues: {
      building: room?.building ?? "",
      roomNumber: room?.roomNumber ?? "",
      capacity: room?.capacity ?? 1,
    },
    validators: { onSubmit: CreateRoomZodSchema },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      if (room?.id) formData.append("id", room.id);
      formData.append("building", value.building);
      formData.append("roomNumber", value.roomNumber);
      formData.append("capacity", String(value.capacity));
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

  const showError = (error: unknown) =>
    String((error as { message?: unknown })?.message ?? error);

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <DoorOpen className="size-5 text-primary" />
          {isEdit ? "Edit Room" : "Add Room"}
        </DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update the room information."
            : "Enter the room information."}
        </DialogDescription>
      </DialogHeader>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field name="building">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>
                Building <span className="text-destructive">*</span>
              </Label>
              <Input
                id={field.name}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                placeholder="Enter building name"
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

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="roomNumber">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  Room Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="e.g. 301"
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

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || isSubmitting}>
            {(isPending || isSubmitting) && (
              <Loader2 className="animate-spin" />
            )}
            {isEdit ? "Save Changes" : "Create Room"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default RoomCreate;
