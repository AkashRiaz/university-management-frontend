"use server";

import { getAdminDashboardOverviewAction } from "@/app/(dashboardGroup)/_actions/dashboardActions";
import {
  AlertCircle,
  BookOpenCheck,
  Building2,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  FileCheck2,
  GraduationCap,
  Layers3,
  School,
  UserCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type OverviewCardProps = {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

const formatDate = (date?: string) => {
  if (!date) return "-";

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

const statusClass = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-emerald-500/10 text-emerald-600";

    case "PENDING":
      return "bg-amber-500/10 text-amber-600";

    case "REJECTED":
      return "bg-destructive/10 text-destructive";

    case "DRAFT":
      return "bg-blue-500/10 text-blue-600";

    default:
      return "bg-muted text-muted-foreground";
  }
};

const AdminDashboardOverview = async () => {
  const result = await getAdminDashboardOverviewAction();

  if (!result.success || !result.data) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertCircle className="h-5 w-5" />
        </div>

        <h3 className="mt-4 font-semibold text-destructive">
          Failed to load dashboard
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">{result.message}</p>
      </div>
    );
  }

  const {
    counts,
    registrationStatus,
    finance,
    currentSemester,
    recentRegistrations,
  } = result.data;

  const overviewCards: OverviewCardProps[] = [
    {
      title: "Students",
      value: counts.students,
      description: "Registered students",
      icon: GraduationCap,
    },
    {
      title: "Instructors",
      value: counts.instructors,
      description: "Academic instructors",
      icon: Users,
    },
    {
      title: "Departments",
      value: counts.departments,
      description: "Academic departments",
      icon: Building2,
    },
    {
      title: "Programs",
      value: counts.programs,
      description: "Academic programs",
      icon: School,
    },
    {
      title: "Courses",
      value: counts.courses,
      description: "University courses",
      icon: BookOpenCheck,
    },
    {
      title: "Semesters",
      value: counts.semesters,
      description: "Academic semesters",
      icon: CalendarDays,
    },
    {
      title: "Registrations",
      value: counts.registrations,
      description: "Semester registrations",
      icon: FileCheck2,
    },
    {
      title: "Invoices",
      value: counts.invoices,
      description: "Student invoices",
      icon: CircleDollarSign,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          Dashboard
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
          Admin Overview
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Monitor university academics, registrations and financial activity.
        </p>
      </div>

      {/* Overview cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((item) => (
          <OverviewCard key={item.title} {...item} />
        ))}
      </div>

      {/* Registration + Semester */}
      <div className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
        {/* Registrations */}
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div>
            <h2 className="font-semibold">Registration Overview</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Registration status across the university
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <RegistrationCard
              title="Draft"
              value={registrationStatus.draft}
              icon={Clock3}
            />

            <RegistrationCard
              title="Pending"
              value={registrationStatus.pending}
              icon={Clock3}
            />

            <RegistrationCard
              title="Approved"
              value={registrationStatus.approved}
              icon={UserCheck}
            />

            <RegistrationCard
              title="Rejected"
              value={registrationStatus.rejected}
              icon={AlertCircle}
            />
          </div>
        </div>

        {/* Current semester */}
        <div className="relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm">
          <div className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Current Semester
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  {currentSemester?.name || "No Active Semester"}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarDays className="h-5 w-5" />
              </div>
            </div>

            {currentSemester ? (
              <>
                <div className="mt-4">
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
                    {currentSemester.status}
                  </span>
                </div>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Academic Year</span>

                    <span className="font-medium">
                      {currentSemester.academicYear?.name || "-"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Start</span>

                    <span>{formatDate(currentSemester.startDate)}</span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">End</span>

                    <span>{formatDate(currentSemester.endDate)}</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="mt-5 text-sm text-muted-foreground">
                There is currently no active semester.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Finance + University totals */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Finance */}
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CircleDollarSign className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold">Finance Overview</h2>

              <p className="text-sm text-muted-foreground">
                Current invoice summary
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">Total Invoices</p>

              <p className="mt-2 text-2xl font-bold">{finance.totalInvoices}</p>
            </div>

            <div className="rounded-xl border bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">
                Outstanding Amount
              </p>

              <p className="mt-2 text-xl font-bold text-primary">
                {formatCurrency(finance.totalOutstandingAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Small system summary */}
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Layers3 className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold">Academic System</h2>

              <p className="text-sm text-muted-foreground">
                University structure overview
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <MiniStat label="Departments" value={counts.departments} />

            <MiniStat label="Programs" value={counts.programs} />

            <MiniStat label="Courses" value={counts.courses} />
          </div>
        </div>
      </div>

      {/* Recent registrations */}
      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <div>
          <h2 className="font-semibold">Recent Registrations</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Latest student semester registrations
          </p>
        </div>

        {recentRegistrations.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No recent registrations found.
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {recentRegistrations.map((registration) => (
              <div
                key={registration.id}
                className="flex flex-col gap-4 rounded-xl border p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <GraduationCap className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-medium">
                      {registration.student?.user?.name || "Unknown Student"}
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {registration.registrationNumber}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <p className="text-[11px] text-muted-foreground">
                      Department
                    </p>

                    <p className="text-sm font-medium">
                      {registration.student?.department?.code || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-muted-foreground">Program</p>

                    <p className="text-sm font-medium">
                      {registration.student?.program?.code || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-muted-foreground">
                      Semester
                    </p>

                    <p className="text-sm font-medium">
                      {registration.semester?.name || "-"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(
                      registration.status,
                    )}`}
                  >
                    {registration.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const OverviewCard = ({
  title,
  value,
  description,
  icon: Icon,
}: OverviewCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-primary/10 blur-3xl transition group-hover:bg-primary/20" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>

          <p className="text-2xl font-bold">{value}</p>
        </div>

        <h3 className="mt-5 font-semibold">{title}</h3>

        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

const RegistrationCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
}) => {
  return (
    <div className="rounded-xl border bg-muted/20 p-4">
      <div className="flex items-center gap-2 text-primary">
        <Icon className="h-4 w-4" />

        <span className="text-xs font-medium">{title}</span>
      </div>

      <p className="mt-3 text-2xl font-bold">{value}</p>
    </div>
  );
};

const MiniStat = ({ label, value }: { label: string; value: number }) => {
  return (
    <div className="rounded-xl border bg-muted/20 p-4 text-center">
      <p className="text-xl font-bold">{value}</p>

      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
};

export default AdminDashboardOverview;
