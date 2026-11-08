import { Skeleton } from "@/components/ui/skeleton";

const StudentDashboardOverviewLoading = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-4 w-24" />

        <Skeleton className="mt-3 h-8 w-48" />

        <Skeleton className="mt-3 h-4 w-80 max-w-full" />
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-2xl border bg-card p-5">
            <Skeleton className="h-10 w-10 rounded-xl" />

            <Skeleton className="mt-5 h-3 w-20" />

            <Skeleton className="mt-3 h-7 w-28" />
          </div>
        ))}
      </div>

      {/* Academic + Invoice */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Academic info */}
        <div className="rounded-2xl border bg-card p-5">
          <Skeleton className="h-5 w-40" />

          <div className="mt-5 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl border p-4"
              >
                <Skeleton className="h-9 w-9 rounded-xl" />

                <div className="flex-1">
                  <Skeleton className="h-3 w-20" />

                  <Skeleton className="mt-2 h-4 w-36" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice */}
        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />

            <div>
              <Skeleton className="h-4 w-24" />

              <Skeleton className="mt-2 h-3 w-40" />
            </div>
          </div>

          <div className="mt-6">
            <Skeleton className="h-3 w-20" />

            <Skeleton className="mt-3 h-9 w-40" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Skeleton className="h-20 rounded-xl" />

            <Skeleton className="h-20 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Registered courses */}
      <div className="rounded-2xl border bg-card p-5">
        <Skeleton className="h-5 w-40" />

        <Skeleton className="mt-2 h-3 w-64" />

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-xl border p-4">
              <Skeleton className="h-3 w-20" />

              <Skeleton className="mt-3 h-5 w-44" />

              <div className="mt-4 flex items-center justify-between">
                <Skeleton className="h-3 w-16" />

                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardOverviewLoading;
