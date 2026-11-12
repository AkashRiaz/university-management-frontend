import { BookOpen, CreditCard, GraduationCap, UserCog } from "lucide-react";
import { Parallax } from "@/components/shared/Parallax";

// Alternate drift so the card row gains depth while scrolling.
const DEPTH = [10, 34, 18, 42];

const roles = [
  {
    title: "Student",
    subtitle: "Learn & Register",
    description:
      "Select courses, manage registrations, monitor payments and access academic information.",
    icon: GraduationCap,
  },
  {
    title: "Instructor",
    subtitle: "Teach & Manage",
    description:
      "View assigned sections, courses, schedules and academic responsibilities.",
    icon: BookOpen,
  },
  {
    title: "Administrator",
    subtitle: "Control & Organize",
    description:
      "Manage academic structures, users, semesters, programs and registration approvals.",
    icon: UserCog,
  },
  {
    title: "Finance",
    subtitle: "Invoice & Payment",
    description:
      "Configure fees, issue invoices and track student semester payments.",
    icon: CreditCard,
  },
];

const RolesSection = () => {
  return (
    <section className="relative border-y bg-muted/20 section-y">
      <div className="page-container">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="eyebrow">Role Based Platform</p>

          <h2 className="section-title mt-3">
            One platform.
            <span className="text-primary"> Different experiences.</span>
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {roles.map((role, index) => {
            const Icon = role.icon;

            return (
              <Parallax key={role.title} distance={DEPTH[index]}>
                <div className="group h-full relative overflow-hidden rounded-3xl border bg-background/70 p-6 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition group-hover:bg-primary/20" />

                  <div className="relative">
                    <div className="mb-10 flex h-14 w-14 items-center justify-center rounded-2xl border bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>

                    <p className="text-xs font-medium uppercase tracking-[0.15em] text-primary">
                      {role.subtitle}
                    </p>

                    <h3 className="mt-2 text-xl font-semibold">{role.title}</h3>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {role.description}
                    </p>
                  </div>
                </div>
              </Parallax>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RolesSection;
