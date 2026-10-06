"use server";

import {
  AlertCircle,
  CalendarDays,
  CalendarRange,
  Clock3,
  GraduationCap,
} from "lucide-react";

import { CustomPagination } from "@/components/ui/CustomPagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { getAllSemestersAction } from "@/app/(dashboardGroup)/admin-dashboard/_actions/semesterActions";

type SemesterCardsProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

const formatDate = (date: string) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsedDate);
};

const getStatusClasses = (status?: string) => {
  switch (status) {
    case "ACTIVE":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600";

    case "COMPLETED":
      return "border-blue-500/20 bg-blue-500/10 text-blue-600";

    case "CANCELLED":
      return "border-destructive/20 bg-destructive/10 text-destructive";

    default:
      return "border-amber-500/20 bg-amber-500/10 text-amber-600";
  }
};

const SemesterCards = async ({ searchParams }: SemesterCardsProps) => {
  const result = await getAllSemestersAction({
    query: searchParams,
  });

  const semesters = result.data || [];

  const currentPage = Math.max(1, Number(result.meta?.page ?? 1));

  const limit = Math.max(1, Number(result.meta?.limit ?? 10));

  const totalPages = Math.max(1, Number(result.meta?.totalPages ?? 1));

  if (!result.success) {
    return (
      <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertCircle className="h-5 w-5" />
        </div>

        <h3 className="mt-4 text-lg font-semibold text-destructive">
          Failed to load semesters
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {result.message || "Something went wrong while loading semesters."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Academic Semesters
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Explore semester schedules
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            View semester dates, registration periods, academic years, and
            current semester status.
          </p>
        </div>

        <div className="w-full md:w-[320px]">
          <SearchBar compact />
        </div>
      </div>

      {/* Empty */}
      {semesters.length === 0 ? (
        <div className="rounded-3xl border border-dashed bg-muted/20 p-14 text-center">
          <CalendarDays className="mx-auto h-9 w-9 text-muted-foreground" />

          <h3 className="mt-4 font-semibold">No semesters found</h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Try searching with a different semester or academic year.
          </p>
        </div>
      ) : (
        <>
          {/* Cards */}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {semesters.map((semester, index) => (
              <article
                key={semester.id}
                className="group relative overflow-hidden rounded-[28px] border bg-background/70 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
              >
                {/* Glow */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-primary/20" />

                {/* Number */}
                <span className="absolute right-5 top-4 text-6xl font-black tracking-tight text-primary/[0.04]">
                  {String((currentPage - 1) * limit + index + 1).padStart(
                    2,
                    "0",
                  )}
                </span>

                <div className="relative">
                  {/* Top */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/20 to-violet-500/10 text-primary">
                      <CalendarDays className="h-5 w-5" />
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${getStatusClasses(
                        semester.status,
                      )}`}
                    >
                      {semester.status || "UPCOMING"}
                    </span>
                  </div>

                  {/* Semester title */}
                  <div className="mt-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      Semester
                    </p>

                    <h3 className="mt-2 text-xl font-semibold tracking-tight">
                      {semester.name}
                    </h3>
                  </div>

                  {/* Academic Year */}
                  <div className="mt-6 flex items-center gap-3 rounded-2xl border bg-muted/20 p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <GraduationCap className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] text-muted-foreground">
                        Academic Year
                      </p>

                      <p className="truncate text-sm font-medium">
                        {semester.academicYear?.name ||
                          semester.academicYearId ||
                          "Not assigned"}
                      </p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="mt-5 space-y-3">
                    {/* Semester period */}
                    <div className="rounded-2xl border bg-background/50 p-4">
                      <div className="flex items-center gap-2">
                        <CalendarRange className="h-4 w-4 text-primary" />

                        <p className="text-xs font-medium">Semester Period</p>
                      </div>

                      <p className="mt-3 text-sm text-muted-foreground">
                        {formatDate(semester.startDate)}
                      </p>

                      <div className="my-1.5 flex items-center gap-2">
                        <div className="h-px flex-1 bg-border" />

                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          to
                        </span>

                        <div className="h-px flex-1 bg-border" />
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {formatDate(semester.endDate)}
                      </p>
                    </div>

                    {/* Registration */}
                    <div className="rounded-2xl border bg-background/50 p-4">
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-primary" />

                        <p className="text-xs font-medium">
                          Registration Period
                        </p>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
                        <span>{formatDate(semester.registrationStart)}</span>

                        <span>—</span>

                        <span>{formatDate(semester.registrationEnd)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10">
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SemesterCards;
