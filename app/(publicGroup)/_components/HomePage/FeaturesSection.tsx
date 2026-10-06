import {
  BookOpenCheck,
  CalendarDays,
  CreditCard,
  GraduationCap,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

const features = [
  {
    title: "Student Management",
    description:
      "Manage student profiles, programs, departments, admission records and academic progress.",
    icon: GraduationCap,
    tag: "Students",
  },
  {
    title: "Course & Section",
    description:
      "Organize courses, program mappings, sections, instructors and semester offerings.",
    icon: BookOpenCheck,
    tag: "Academics",
  },
  {
    title: "Semester Management",
    description:
      "Control academic years, semester timelines and registration periods.",
    icon: CalendarDays,
    tag: "Semester",
  },
  {
    title: "Registration",
    description:
      "Allow students to select available course sections and submit their registration.",
    icon: UsersRound,
    tag: "Registration",
  },
  {
    title: "Payments",
    description:
      "Manage fee structures, invoices, semester payments and payment history.",
    icon: CreditCard,
    tag: "Finance",
  },
  {
    title: "Role Security",
    description:
      "Separate permissions for students, instructors, admins and finance teams.",
    icon: ShieldCheck,
    tag: "Security",
  },
];

const FeaturesSection = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-4 inline-flex rounded-full border bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Connected Platform
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Everything connected in
            <span className="block bg-gradient-to-r from-primary via-violet-500 to-blue-500 bg-clip-text text-transparent">
              one academic ecosystem
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-muted-foreground">
            Every module works together so students, instructors and
            administrators can manage university operations from one place.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-3xl border bg-background/60 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
              >
                <div className="absolute right-4 top-4 text-5xl font-bold text-primary/[0.04]">
                  0{index + 1}
                </div>

                <div className="relative">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-violet-500/10 text-primary ring-1 ring-primary/10">
                      <Icon className="h-6 w-6" />
                    </div>

                    <span className="rounded-full border bg-muted/40 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {feature.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold">{feature.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>

                  <div className="mt-6 h-px w-full bg-gradient-to-r from-primary/30 via-border to-transparent" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
