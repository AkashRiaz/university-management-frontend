"use server";

import { getStudentDashboardOverviewAction } from "@/app/(dashboardGroup)/_actions/dashboardActions";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  BookOpenCheck,
  Building2,
  CalendarDays,
  CircleDollarSign,
  GraduationCap,
} from "lucide-react";

const formatCurrency = (amount?: number | null) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

const StudentDashboardOverview = async () => {
  const result = await getStudentDashboardOverviewAction();

  if (!result.success || !result.data) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-10 text-center">
        <AlertCircle className="mx-auto h-6 w-6 text-destructive" />

        <h3 className="mt-4 font-semibold">Failed to load dashboard</h3>

        <p className="mt-2 text-sm text-muted-foreground">{result.message}</p>
      </div>
    );
  }

  const { student, currentSemester, registration, courses, invoice } =
    result.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">Welcome back,</p>

        <h1 className="mt-1 text-2xl font-bold">{student.user.name}</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Heres an overview of your current academic activity.
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StudentStatCard
          title="Semester"
          value={currentSemester?.name || "Not Active"}
          icon={CalendarDays}
        />

        <StudentStatCard
          title="Registration"
          value={registration?.status || "Not Started"}
          icon={GraduationCap}
        />

        <StudentStatCard
          title="Courses"
          value={String(courses.count)}
          icon={BookOpenCheck}
        />

        <StudentStatCard
          title="Credits"
          value={String(courses.totalCredits)}
          icon={GraduationCap}
        />
      </div>

      {/* Academic + invoice */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5">
          <h2 className="font-semibold">Academic Information</h2>

          <div className="mt-5 space-y-4">
            <InfoRow
              icon={Building2}
              label="Department"
              value={student.department.name}
            />

            <InfoRow
              icon={GraduationCap}
              label="Program"
              value={student.program.name}
            />

            <InfoRow
              icon={CalendarDays}
              label="Current Semester"
              value={currentSemester?.name || "-"}
            />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CircleDollarSign className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold">Invoice</h2>

              <p className="text-sm text-muted-foreground">
                Current semester payment
              </p>
            </div>
          </div>

          {invoice ? (
            <div className="mt-6">
              <p className="text-xs text-muted-foreground">Due Amount</p>

              <p className="mt-2 text-3xl font-bold text-primary">
                {formatCurrency(invoice.dueAmount)}
              </p>
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">
              No invoice available for the current semester.
            </p>
          )}
        </div>
      </div>

      {/* Courses */}
      <div className="rounded-2xl border bg-card p-5">
        <h2 className="font-semibold">Registered Courses</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Courses selected for your current registration
        </p>

        {courses.items.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No courses registered yet.
          </p>
        ) : (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {courses.items.map((item) => (
              <div key={item.id} className="rounded-xl border p-4">
                <p className="text-xs font-semibold text-primary">
                  {item.section.course.code}
                </p>

                <h3 className="mt-1 font-medium">
                  {item.section.course.title}
                </h3>

                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.section.course.credit} Credits</span>

                  <span>{item.section.course.courseType}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StudentStatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: LucideIcon;
}) => {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <Icon className="h-5 w-5 text-primary" />

      <p className="mt-5 text-sm text-muted-foreground">{title}</p>

      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
};

const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border p-4">
      <Icon className="h-4 w-4 text-primary" />

      <div>
        <p className="text-xs text-muted-foreground">{label}</p>

        <p className="mt-1 text-sm font-medium">{value}</p>
      </div>
    </div>
  );
};

export default StudentDashboardOverview;
