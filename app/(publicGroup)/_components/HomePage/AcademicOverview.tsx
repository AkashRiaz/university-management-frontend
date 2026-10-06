import {
  BookOpen,
  Building2,
  GraduationCap,
  Layers3,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const AcademicOverview = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Academic Structure
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              See how every part of the university
              <span className="block text-primary">connects together</span>
            </h2>

            <p className="mt-6 max-w-xl leading-7 text-muted-foreground">
              Departments contain programs, programs define courses and students
              register for sections during each academic semester. Your system
              keeps all these relationships connected.
            </p>

            <div className="mt-8 space-y-4">
              <OverviewItem
                icon={Building2}
                title="Department → Program"
                description="Each academic program belongs to a department."
              />

              <OverviewItem
                icon={BookOpen}
                title="Program → Courses"
                description="Program courses decide what students are eligible to study."
              />

              <OverviewItem
                icon={UserRound}
                title="Student → Registration"
                description="Students create semester registrations based on their program."
              />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-20 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative rounded-3xl border bg-background/65 p-6 shadow-2xl backdrop-blur-xl">
              <FlowNode
                icon={Building2}
                title="Department"
                subtitle="Computer Science"
              />

              <Connector />

              <FlowNode
                icon={Layers3}
                title="Program"
                subtitle="BSc in Computer Science"
              />

              <Connector />

              <div className="grid grid-cols-2 gap-3">
                <FlowNode
                  icon={BookOpen}
                  title="Course"
                  subtitle="CSE101"
                  compact
                />

                <FlowNode
                  icon={BookOpen}
                  title="Course"
                  subtitle="CSE203"
                  compact
                />
              </div>

              <Connector />

              <FlowNode
                icon={GraduationCap}
                title="Student Registration"
                subtitle="Spring Semester"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function OverviewItem({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h3 className="font-semibold">{title}</h3>

        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function FlowNode({
  icon: Icon,
  title,
  subtitle,
  compact = false,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border bg-background/80 ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{title}</p>

        <p className="truncate text-sm font-semibold">{subtitle}</p>
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex h-8 justify-center">
      <div className="h-full w-px bg-gradient-to-b from-primary/60 to-primary/10" />
    </div>
  );
}

export default AcademicOverview;
