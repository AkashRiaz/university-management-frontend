import Link from "next/link";
import { BookOpen, CalendarCheck, Users } from "lucide-react";
import { getMyInstructorSectionsAction } from "./_actions/sectionActions";

const InstructorDashboardPage = async () => {
  const result = await getMyInstructorSectionsAction();
  const sections = result.data || [];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Instructor dashboard</h1>
        <p className="text-sm text-muted-foreground">Manage your assigned sections and attendance.</p>
      </div>
      {!result.success ? (
        <div className="rounded-lg border border-destructive/30 p-6 text-sm text-destructive">{result.message}</div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <SummaryCard label="Assigned sections" value={sections.length} icon={BookOpen} />
            <SummaryCard label="Active sections" value={sections.filter((item) => item.section?.status === "OPEN").length} icon={CalendarCheck} />
            <SummaryCard label="Primary sections" value={sections.filter((item) => item.isPrimary).length} icon={Users} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {sections.map((assignment) => (
              <Link key={assignment.id} href={`/instructor-dashboard/sections/${assignment.section?.id}`} className="rounded-xl border p-5 transition hover:border-primary hover:bg-muted/30">
                <p className="text-xs text-muted-foreground">{assignment.section?.course?.code || "Course"}</p>
                <h2 className="mt-1 font-semibold">{assignment.section?.course?.title || "Assigned section"}</h2>
                <p className="mt-2 text-sm text-muted-foreground">Section {assignment.section?.name || "-"} · {assignment.section?.semester?.name || "Semester"}</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const SummaryCard = ({ label, value, icon: Icon }: { label: string; value: number; icon: typeof BookOpen }) => (
  <div className="rounded-xl border p-5">
    <Icon className="size-5 text-primary" />
    <p className="mt-3 text-sm text-muted-foreground">{label}</p>
    <p className="text-2xl font-semibold">{value}</p>
  </div>
);

export default InstructorDashboardPage;
