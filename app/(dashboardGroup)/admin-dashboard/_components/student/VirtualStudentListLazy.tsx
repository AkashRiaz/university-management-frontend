"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// The virtualized list (and @tanstack/react-virtual) is only needed for the
// "All (scroll view)" tab, so it is split out of the normal students page bundle.
const VirtualStudentListLazy = dynamic(() => import("./VirtualStudentList"), {
  loading: () => (
    <div className="flex flex-col gap-3" aria-busy="true">
      <Skeleton className="h-8 w-full sm:ml-auto sm:w-64" />
      <div className="space-y-2 rounded-md border p-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    </div>
  ),
});

export default VirtualStudentListLazy;
