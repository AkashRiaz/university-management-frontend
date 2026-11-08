"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { IFeeStructureItem } from "@/types/fee-structure-item.type";
import DialogFormSkeleton from "@/components/shared/DialogFormSkeleton";

type FeeStructureItemCreateProps = {
  feeStructureId: string;
  item?: IFeeStructureItem;
  trigger?: "add" | "edit";
};

// The form (form library, zod schema and all fields) is code-split into its own
// chunk and only downloaded when the dialog is opened (or the button is hovered).
const loadFeeStructureItemForm = () => import("./FeeStructureItemForm");
const preloadFeeStructureItemForm = () => {
  void loadFeeStructureItemForm();
};
const FeeStructureItemForm = dynamic(loadFeeStructureItemForm, {
  ssr: false,
  loading: () => <DialogFormSkeleton />,
});

const FeeStructureItemCreate = ({
  feeStructureId,
  item,
  trigger = "add",
}: FeeStructureItemCreateProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(item);

  return (
    <>
      <Button
        type="button"
        variant={isEdit ? "outline" : "default"}
        size={isEdit ? "sm" : "default"}
        onClick={() => setOpen(true)}
        onPointerEnter={preloadFeeStructureItemForm}
        onFocus={preloadFeeStructureItemForm}
        className="shrink-0 whitespace-nowrap"
      >
        {isEdit ? <Pencil /> : <Plus />}
        {isEdit ? "Edit" : "Add Item"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <FeeStructureItemForm
            key={item?.id ?? "new"}
            feeStructureId={feeStructureId}
            item={item}
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

export default FeeStructureItemCreate;
