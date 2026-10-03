import { Skeleton } from "@/components/ui/skeleton";

const SectionInstructorLoadingTable = () => (
  <div className="space-y-3 py-3">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="flex items-center gap-3 rounded-lg border p-3">
        <Skeleton className="size-9 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
    ))}
  </div>
);

export default SectionInstructorLoadingTable;
