"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { Pencil, Plus, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IInstructor } from "@/types/instructor.type";
import { ISectionInstructor } from "@/types/section-instructor.type";
import { createSectionInstructorAction, updateSectionInstructorAction } from "../../_actions/sectionInstructorActions";

const SectionInstructorCreate = ({
  sectionId,
  instructors,
  assignment,
  onSuccess,
  trigger = "add",
}: {
  sectionId: string;
  instructors: IInstructor[];
  assignment?: ISectionInstructor;
  onSuccess: () => void;
  trigger?: "add" | "edit";
}) => {
  const [open, setOpen] = useState(false);
  const isEdit = trigger === "edit" && Boolean(assignment);
  return (
    <>
      <Button type="button" variant={isEdit ? "outline" : "default"} size={isEdit ? "sm" : "default"} onClick={() => setOpen(true)}>
        {isEdit ? <Pencil /> : <Plus />}
        {isEdit ? "Edit" : "Assign Instructor"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        {open && (
          <SectionInstructorForm
            key={assignment?.id ?? "new"}
            sectionId={sectionId}
            instructors={instructors}
            assignment={assignment}
            isEdit={isEdit}
            onSuccess={() => {
              setOpen(false);
              onSuccess();
            }}
          />
        )}
      </Dialog>
    </>
  );
};

const SectionInstructorForm = ({
  sectionId,
  instructors,
  assignment,
  isEdit,
  onSuccess,
}: {
  sectionId: string;
  instructors: IInstructor[];
  assignment?: ISectionInstructor;
  isEdit: boolean;
  onSuccess: () => void;
}) => {
  const action = isEdit ? updateSectionInstructorAction : createSectionInstructorAction;
  const [state, formAction, isSubmitting] = useActionState(action, null);
  const [isPending, startTransition] = useTransition();
  const [instructorId, setInstructorId] = useState(assignment?.instructorId ?? "");
  const [isPrimary, setIsPrimary] = useState(assignment?.isPrimary ?? false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      onSuccess();
    } else if (state?.success === false) toast.error(state.message);
  }, [onSuccess, state]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isEdit && !instructorId) {
      setError("Please select an instructor.");
      return;
    }
    const formData = new FormData();
    if (assignment?.id) formData.append("id", assignment.id);
    formData.append("sectionId", sectionId);
    formData.append("instructorId", instructorId);
    formData.append("isPrimary", String(isPrimary));
    startTransition(() => formAction(formData));
  };

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2"><UserRound className="size-5 text-primary" />{isEdit ? "Update Section Instructor" : "Assign Instructor"}</DialogTitle>
        <DialogDescription>{isEdit ? "Update the primary instructor status." : "Assign an instructor to this section."}</DialogDescription>
      </DialogHeader>
      <form onSubmit={submit} className="space-y-5">
        {!isEdit && (
          <div className="space-y-2">
            <Label>Instructor</Label>
            <Select value={instructorId} onValueChange={(value) => { setInstructorId(value ?? ""); setError(""); }}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select instructor" /></SelectTrigger>
              <SelectContent>
                {instructors.map((instructor) => (
                  <SelectItem key={instructor.id} value={instructor.id}>
                    {instructor.user?.name || instructor.employeeId || instructor.id}
                    {instructor.employeeId ? ` (${instructor.employeeId})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        )}
        <label className="flex items-center gap-3 rounded-md border p-3">
          <input
            type="checkbox"
            checked={isPrimary}
            onChange={(event) => setIsPrimary(event.target.checked)}
            className="size-4 accent-primary"
          />
          <span className="text-sm font-medium">Make this the primary instructor</span>
        </label>
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting || isPending || (!isEdit && instructors.length === 0)}>
            {isSubmitting || isPending ? "Saving..." : isEdit ? "Update Assignment" : "Assign Instructor"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default SectionInstructorCreate;
