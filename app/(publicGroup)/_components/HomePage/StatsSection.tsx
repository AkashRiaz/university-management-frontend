import { BookOpen, Building2, GraduationCap, Users } from "lucide-react";

const stats = [
  {
    label: "Active Students",
    value: "10K+",
    description: "Learning across programs",
    icon: GraduationCap,
  },
  {
    label: "Instructors",
    value: "500+",
    description: "Academic professionals",
    icon: Users,
  },
  {
    label: "Courses",
    value: "300+",
    description: "Across all departments",
    icon: BookOpen,
  },
  {
    label: "Departments",
    value: "20+",
    description: "Academic disciplines",
    icon: Building2,
  },
];

const StatsSection = () => {
  return (
    <section className="relative overflow-hidden border-b py-14">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container relative mx-auto px-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="group relative overflow-hidden rounded-2xl border bg-background/70 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition group-hover:bg-primary/20" />

                <div className="relative flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-3xl font-bold tracking-tight">
                      {item.value}
                    </p>

                    <p className="mt-1 font-medium">{item.label}</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
