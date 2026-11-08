"use client";

import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Shown inside an already-open <Dialog> while the lazily loaded form chunk
 * (form library + zod schema + form fields) is being downloaded.
 * It roughly matches the size of the real form so the modal does not jump.
 */
export default function DialogFormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl" aria-busy="true">
      <DialogTitle className="sr-only">Loading form</DialogTitle>
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="grid gap-4 py-2 sm:grid-cols-2">
        {Array.from({ length: fields }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-28" />
      </div>
    </DialogContent>
  );
}
