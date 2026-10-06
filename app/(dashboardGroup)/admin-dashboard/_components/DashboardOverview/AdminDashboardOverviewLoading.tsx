import { Skeleton } from "@/components/ui/skeleton";

const AdminDashboardOverviewLoading = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-4 w-20" />

        <Skeleton className="mt-3 h-8 w-48" />

        <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      </div>

      {/* Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="rounded-2xl border p-5">
            <div className="flex items-start justify-between">
              <Skeleton className="h-10 w-10 rounded-xl" />

              <Skeleton className="h-7 w-12" />
            </div>

            <Skeleton className="mt-5 h-4 w-24" />

            <Skeleton className="mt-2 h-3 w-28" />
          </div>
        ))}
      </div>

      {/* Registration + semester */}
      <div className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-2xl border p-5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-2 h-3 w-56" />

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border p-5">
          <div className="flex justify-between">
            <div>
              <Skeleton className="h-3 w-28" />

              <Skeleton className="mt-3 h-6 w-32" />
            </div>

            <Skeleton className="h-11 w-11 rounded-xl" />
          </div>

          <Skeleton className="mt-5 h-6 w-20 rounded-full" />

          <div className="mt-5 space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>

      {/* Finance */}
      <div className="grid gap-5 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="rounded-2xl border p-5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-11 w-11 rounded-xl" />

              <div>
                <Skeleton className="h-4 w-36" />
                <Skeleton className="mt-2 h-3 w-44" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent */}
      <div className="rounded-2xl border p-5">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="mt-2 h-3 w-56" />

        <div className="mt-5 space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOverviewLoading;
