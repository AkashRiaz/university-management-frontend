"use server";

import {
  AlertCircle,
  BookOpenCheck,
  Building2,
  GraduationCap,
  Layers3,
} from "lucide-react";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { getAllCoursesAction } from "@/app/(dashboardGroup)/admin-dashboard/_actions/courseActions";

type CourseCardsProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

const CourseCards = async ({ searchParams }: CourseCardsProps) => {
  const result = await getAllCoursesAction({
    query: searchParams,
  });

  const courses = result.data || [];

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
          Failed to load courses
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {result.message || "Something went wrong while loading courses."}
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
            University Courses
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Explore our courses
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Browse courses by department, credit value, course type, and
            academic level.
          </p>
        </div>

        <div className="w-full md:w-[320px]">
          <SearchBar compact />
        </div>
      </div>

      {/* Empty state */}
      {courses.length === 0 ? (
        <div className="rounded-3xl border border-dashed bg-muted/20 p-14 text-center">
          <BookOpenCheck className="mx-auto h-9 w-9 text-muted-foreground" />

          <h3 className="mt-4 font-semibold">No courses found</h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Try searching with a different course title or course code.
          </p>
        </div>
      ) : (
        <>
          {/* Cards */}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course, index) => (
              <article
                key={course.id}
                className="group relative overflow-hidden rounded-[28px] border bg-background/70 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
              >
                {/* Glow */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-primary/20" />

                {/* Index */}
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
                      <BookOpenCheck className="h-5 w-5" />
                    </div>

                    <span className="rounded-full border bg-muted/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {course.code || "Course"}
                    </span>
                  </div>

                  {/* Course title */}
                  <div className="mt-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      Course
                    </p>

                    <h3 className="mt-2 text-xl font-semibold tracking-tight">
                      {course.title || "Untitled Course"}
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
                        {course.department?.name ||
                          course.departmentId ||
                          "Not assigned"}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {/* Credit */}
                    <div className="rounded-2xl border bg-background/50 p-4">
                      <GraduationCap className="h-4 w-4 text-primary" />

                      <p className="mt-3 text-[11px] text-muted-foreground">
                        Credit
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {course.credit ?? "-"}
                      </p>
                    </div>

                    {/* Type */}
                    <div className="rounded-2xl border bg-background/50 p-4">
                      <Layers3 className="h-4 w-4 text-primary" />

                      <p className="mt-3 text-[11px] text-muted-foreground">
                        Type
                      </p>

                      <p className="mt-1 truncate text-sm font-semibold capitalize">
                        {course.courseType
                          ? course.courseType.toLowerCase().replaceAll("_", " ")
                          : "-"}
                      </p>
                    </div>

                    {/* Level */}
                    <div className="rounded-2xl border bg-background/50 p-4">
                      <BookOpenCheck className="h-4 w-4 text-primary" />

                      <p className="mt-3 text-[11px] text-muted-foreground">
                        Level
                      </p>

                      <p className="mt-1 truncate text-sm font-semibold capitalize">
                        {course.courseLevel
                          ? course.courseLevel
                              .toLowerCase()
                              .replaceAll("_", " ")
                          : "-"}
                      </p>
                    </div>
                  </div>

                  {/* Bottom academic info */}
                  <div className="mt-5 rounded-2xl bg-primary/5 p-4">
                    <p className="text-xs text-muted-foreground">
                      Academic Course
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      Offered through{" "}
                      {course.department?.name || "the university"}
                    </p>
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

export default CourseCards;
