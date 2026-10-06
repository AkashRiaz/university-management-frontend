"use server";

import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  Building2,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { CustomPagination } from "@/components/ui/CustomPagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { getAllDepartmentsAction } from "@/app/(dashboardGroup)/admin-dashboard/_actions/departmentActions";

type DepartmentCardsProps = {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
};

const DepartmentCards = async ({ searchParams }: DepartmentCardsProps) => {
  const result = await getAllDepartmentsAction({
    query: searchParams,
  });

  const departments = result.data || [];

  const currentPage = Math.max(1, Number(result.meta?.page ?? 1));

  const totalPages = Math.max(1, Number(result.meta?.totalPages ?? 1));

  if (!result.success) {
    return (
      <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertCircle className="h-5 w-5" />
        </div>

        <h3 className="mt-4 text-lg font-semibold text-destructive">
          Failed to load departments
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {result.message || "Something went wrong while loading departments."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header + Search */}
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Academic Departments
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Explore our departments
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Discover our academic departments, their faculties, contact
            information, and learning environments.
          </p>
        </div>

        <div className="w-full md:w-[320px]">
          <SearchBar compact />
        </div>
      </div>

      {/* Cards */}
      {departments.length === 0 ? (
        <div className="rounded-3xl border border-dashed bg-muted/20 p-14 text-center">
          <Building2 className="mx-auto h-9 w-9 text-muted-foreground" />

          <h3 className="mt-4 font-semibold">No departments found</h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Try searching with a different department name or code.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {departments.map((department, index) => (
            <article
              key={department.id}
              className="group relative overflow-hidden rounded-[28px] border bg-background/70 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
            >
              {/* glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-primary/20" />

              {/* number */}
              <span className="absolute right-5 top-4 text-6xl font-black tracking-tight text-primary/[0.04]">
                {String(
                  (currentPage - 1) * Number(result.meta?.limit ?? 10) +
                    index +
                    1,
                ).padStart(2, "0")}
              </span>

              <div className="relative">
                {/* Card top */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/20 to-violet-500/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>

                  <span className="rounded-full border bg-muted/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {department.code}
                  </span>
                </div>

                {/* Department name */}
                <div className="mt-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    Department
                  </p>

                  <h3 className="mt-2 text-xl font-semibold tracking-tight">
                    {department.name}
                  </h3>

                  <p className="mt-3 line-clamp-3 min-h-[66px] text-sm leading-6 text-muted-foreground">
                    {department.description ||
                      "Explore the academic opportunities, courses, and programs available through this department."}
                  </p>
                </div>

                {/* Faculty */}
                <div className="mt-6 flex items-center gap-3 rounded-2xl border bg-muted/20 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <GraduationCap className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground">Faculty</p>

                    <p className="truncate text-sm font-medium">
                      {department.faculty?.name || "Not assigned"}
                    </p>
                  </div>
                </div>

                {/* Information */}
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />

                    <span className="truncate">
                      {department.building || "Campus location not specified"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0 text-primary" />

                    <span className="truncate">
                      {department.email || "Email not available"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0 text-primary" />

                    <span>{department.phone || "Phone not available"}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {departments.length > 0 && totalPages > 1 && (
        <div className="mt-10">
          <CustomPagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
};

export default DepartmentCards;
