"use server";

import {
  AlertCircle,
  BookOpen,
  Building2,
  Clock,
  CreditCard,
  GraduationCap,
} from "lucide-react";

import { CustomPagination } from "@/components/ui/CustomPagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { getAllProgramsAction } from "@/app/(dashboardGroup)/admin-dashboard/_actions/programActions";

type ProgramCardsProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

const ProgramCards = async ({ searchParams }: ProgramCardsProps) => {
  const result = await getAllProgramsAction({
    query: searchParams,
  });

  const programs = result.data || [];

  const currentPage = Math.max(
    1,
    Number(result.meta?.page ?? 1)
  );

  const limit = Math.max(
    1,
    Number(result.meta?.limit ?? 10)
  );

  const totalPages = Math.max(
    1,
    Number(result.meta?.totalPages ?? 1)
  );

  if (!result.success) {
    return (
      <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertCircle className="h-5 w-5" />
        </div>

        <h3 className="mt-4 text-lg font-semibold text-destructive">
          Failed to load programs
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {result.message ||
            "Something went wrong while loading programs."}
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
            Academic Programs
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Explore our study programs
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Discover academic programs, department associations, duration,
            and total credit requirements.
          </p>
        </div>

        <div className="w-full md:w-[320px]">
          <SearchBar compact />
        </div>
      </div>

      {/* Empty */}
      {programs.length === 0 ? (
        <div className="rounded-3xl border border-dashed bg-muted/20 p-14 text-center">
          <BookOpen className="mx-auto h-9 w-9 text-muted-foreground" />

          <h3 className="mt-4 font-semibold">
            No programs found
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Try searching with a different program name or code.
          </p>
        </div>
      ) : (
        <>
          {/* Cards */}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {programs.map((program, index) => (
              <article
                key={program.id}
                className="group relative overflow-hidden rounded-[28px] border bg-background/70 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
              >
                {/* Glow */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-primary/20" />

                {/* Large index */}
                <span className="absolute right-5 top-4 text-6xl font-black tracking-tight text-primary/[0.04]">
                  {String(
                    (currentPage - 1) * limit + index + 1
                  ).padStart(2, "0")}
                </span>

                <div className="relative">
                  {/* Top */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/20 to-violet-500/10 text-primary">
                      <BookOpen className="h-5 w-5" />
                    </div>

                    <span className="rounded-full border bg-muted/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {program.code || "Program"}
                    </span>
                  </div>

                  {/* Program */}
                  <div className="mt-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      Degree Program
                    </p>

                    <h3 className="mt-2 text-xl font-semibold tracking-tight">
                      {program.name || "Unnamed Program"}
                    </h3>
                  </div>

                  {/* Department */}
                  <div className="mt-6 flex items-center gap-3 rounded-2xl border bg-muted/20 p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Building2 className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] text-muted-foreground">
                        Department
                      </p>

                      <p className="truncate text-sm font-medium">
                        {program.department?.name ||
                          program.department?.code ||
                          "Not assigned"}
                      </p>
                    </div>
                  </div>

                  {/* Program details */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border bg-background/50 p-4">
                      <Clock className="h-4 w-4 text-primary" />

                      <p className="mt-3 text-[11px] text-muted-foreground">
                        Duration
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {program.durationYears
                          ? `${program.durationYears} Years`
                          : "-"}
                      </p>
                    </div>

                    <div className="rounded-2xl border bg-background/50 p-4">
                      <CreditCard className="h-4 w-4 text-primary" />

                      <p className="mt-3 text-[11px] text-muted-foreground">
                        Total Credits
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {program.totalCredits ?? "-"}
                      </p>
                    </div>
                  </div>

                  {/* Bottom info */}
                  <div className="mt-5 flex items-center gap-3 rounded-2xl bg-primary/5 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <GraduationCap className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Academic Path
                      </p>

                      <p className="mt-0.5 text-sm font-medium">
                        Structured university program
                      </p>
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

export default ProgramCards;