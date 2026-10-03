"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Star, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IInstructor } from "@/types/instructor.type";
import { ISectionInstructor } from "@/types/section-instructor.type";
import SectionInstructorCreate from "./SectionInstructorCreate";
import SectionInstructorDelete from "./SectionInstructorDelete";
import SectionInstructorLoadingTable from "./SectionInstructorLoadingTable";

const SectionInstructorTable = ({
  sectionId,
  sectionName,
  assignments,
  instructors,
}: {
  sectionId: string;
  sectionName: string;
  assignments: ISectionInstructor[];
  instructors: IInstructor[];
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition();
  const refresh = () => startTransition(() => router.refresh());
  const sectionAssignments = assignments.filter((item) => item.sectionId === sectionId);

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-1">
        <UserRound className="size-4" /> Instructors ({sectionAssignments.length})
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Instructors for {sectionName}</DialogTitle>
            <DialogDescription>Manage instructors assigned to this section.</DialogDescription>
          </DialogHeader>
          {isRefreshing ? <SectionInstructorLoadingTable /> : (
            <>
              <div className="flex justify-end">
                <SectionInstructorCreate sectionId={sectionId} instructors={instructors} onSuccess={refresh} />
              </div>
              <div className="space-y-2">
                {sectionAssignments.length === 0 ? (
                  <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">No instructors assigned.</p>
                ) : sectionAssignments.map((assignment) => {
                  const name = assignment.instructor?.user?.name || assignment.instructor?.employeeId || "Instructor";
                  return (
                    <div key={assignment.id} className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><UserRound className="size-4" /></div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{name}</p>
                        <p className="truncate text-xs text-muted-foreground">{assignment.instructor?.user?.email || assignment.instructor?.designation || "Instructor"}</p>
                      </div>
                      {assignment.isPrimary && <Badge variant="secondary" className="gap-1"><Star className="size-3 fill-current" /> Primary</Badge>}
                      <SectionInstructorCreate sectionId={sectionId} instructors={instructors} assignment={assignment} trigger="edit" onSuccess={refresh} />
                      <SectionInstructorDelete assignmentId={assignment.id} instructorName={name} onDeleted={refresh} />
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SectionInstructorTable;
