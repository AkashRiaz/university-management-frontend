"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { IRoom } from "@/types/room.type";
import DialogFormSkeleton from "@/components/shared/DialogFormSkeleton";

type RoomCreateProps = {
  room?: IRoom;
  trigger?: "add" | "edit";
};

// The form (form library, zod schema and all fields) is code-split into its own
// chunk and only downloaded when the dialog is opened (or the button is hovered).
const loadRoomForm = () => import("./RoomForm");
const preloadRoomForm = () => {
  void loadRoomForm();
};
const RoomForm = dynamic(loadRoomForm, {
  ssr: false,
  loading: () => <DialogFormSkeleton />,
});

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
        onPointerEnter={preloadRoomForm}
        onFocus={preloadRoomForm}
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

export default RoomCreate;
