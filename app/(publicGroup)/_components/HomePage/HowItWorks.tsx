import {
  BookOpen,
  CheckCircle2,
  CreditCard,
  FileCheck2,
  LogIn,
} from "lucide-react";

const steps = [
  {
    title: "Login",
    description: "Student accesses their secure academic dashboard.",
    icon: LogIn,
  },
  {
    title: "Create Registration",
    description: "Start a semester registration in DRAFT status.",
    icon: FileCheck2,
  },
  {
    title: "Choose Sections",
    description: "Select available course sections for the semester.",
    icon: BookOpen,
  },
  {
    title: "Complete Payment",
    description: "Pay the semester invoice before submission.",
    icon: CreditCard,
  },
  {
    title: "Admin Approval",
    description: "Submit registration for administrative review.",
    icon: CheckCircle2,
  },
];

const HowItWorks = () => {
  return (
    <section className="relative overflow-hidden border-y bg-muted/20 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Student Registration Flow
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            A clear path from
            <span className="text-primary"> login to approval</span>
          </h2>

          <p className="mt-5 text-muted-foreground">
            Every step connects directly with your semester, selected courses,
            invoice and registration status.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:block" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="relative rounded-2xl border bg-background/70 p-5 backdrop-blur"
                >
                  <div className="relative z-10 mb-5 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                      <Icon className="h-6 w-6" />
                    </div>

                    <span className="text-sm font-bold text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="font-semibold">{step.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border px-3 py-1.5">DRAFT</span>

          <span>→</span>

          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-amber-600">
            PENDING
          </span>

          <span>→</span>

          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-600">
            APPROVED
          </span>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
