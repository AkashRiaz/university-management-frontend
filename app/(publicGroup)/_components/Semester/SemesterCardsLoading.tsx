import { Skeleton } from "@/components/ui/skeleton";

const SemesterCardsLoading = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <Skeleton className="h-4 w-40" />

          <Skeleton className="mt-4 h-9 w-72 md:w-96" />

          <Skeleton className="mt-4 h-4 w-full max-w-lg" />

          <Skeleton className="mt-2 h-4 w-4/5 max-w-md" />
        </div>

        <Skeleton className="h-10 w-full rounded-lg md:w-[320px]" />
      </div>

      {/* Cards */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-[28px] border bg-background/70 p-6"
          >
            {/* Top */}
            <div className="flex items-start justify-between">
              <Skeleton className="h-12 w-12 rounded-2xl" />

              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* Title */}
            <div className="mt-8">
              <Skeleton className="h-3 w-20" />

              <Skeleton className="mt-3 h-6 w-36" />
            </div>

            {/* Academic Year */}
            <div className="mt-6 flex items-center gap-3 rounded-2xl border p-3">
              <Skeleton className="h-9 w-9 rounded-xl" />

              <div className="flex-1">
                <Skeleton className="h-3 w-24" />

                <Skeleton className="mt-2 h-4 w-32" />
              </div>
            </div>

            {/* Semester Period */}
            <div className="mt-5 rounded-2xl border p-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-3 w-28" />
              </div>

              <Skeleton className="mt-4 h-4 w-28" />

              <Skeleton className="my-3 h-px w-full" />

              <Skeleton className="h-4 w-28" />
            </div>

            {/* Registration */}
            <div className="mt-3 rounded-2xl border p-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-3 w-32" />
              </div>

              <Skeleton className="mt-4 h-4 w-44" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex justify-end gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-9 w-9 rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};

export default SemesterCardsLoading;