import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  GraduationCap,
  Mail,
  School,
  Sparkles,
  UserCheck,
} from "lucide-react";

const admissionSteps = [
  {
    step: "01",
    title: "Choose a Program",
    description:
      "Explore available academic programs and select the study path that matches your goals.",
    icon: BookOpen,
  },
  {
    step: "02",
    title: "Submit Application",
    description:
      "Provide your required personal, academic, and contact information through the admission process.",
    icon: ClipboardList,
  },
  {
    step: "03",
    title: "Document Review",
    description:
      "The university reviews submitted information and verifies the required admission documents.",
    icon: FileText,
  },
  {
    step: "04",
    title: "Admission Decision",
    description:
      "Eligible applicants are approved and prepared for student account and academic registration.",
    icon: UserCheck,
  },
];

const requirements = [
  "Completed academic information",
  "Valid contact information",
  "Required academic documents",
  "Selected department and program",
  "Admission year information",
  "Any additional university-required documents",
];

const studyPaths = [
  {
    title: "Departments",
    description:
      "Explore academic departments and the areas of study they represent.",
    href: "/departments",
    icon: School,
  },
  {
    title: "Programs",
    description:
      "Compare available study programs, duration, and credit requirements.",
    href: "/programs",
    icon: GraduationCap,
  },
  {
    title: "Courses",
    description:
      "Review the courses offered across different departments and programs.",
    href: "/courses",
    icon: BookOpen,
  },
  {
    title: "Academic Calendar",
    description:
      "Check semester timelines, registration periods, and important dates.",
    href: "/semesters",
    icon: CalendarDays,
  },
];

export default function AdmissionsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden border-b py-20 md:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "70px 70px",
          }}
        />

        <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-violet-500/10 blur-3xl" />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Admissions
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Start your
              <span className="mt-2 block bg-gradient-to-r from-primary via-violet-500 to-blue-500 bg-clip-text text-transparent">
                university journey
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Explore programs, understand admission requirements, and learn how
              to begin your journey as a student in our university community.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/programs"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-medium text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5"
              >
                Explore Programs
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-xl border bg-background/60 px-6 font-medium backdrop-blur transition hover:bg-muted"
              >
                Contact Admissions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ADMISSION PROCESS */}
      <section className="relative py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Admission Process
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              Your path from
              <span className="text-primary"> applicant to student</span>
            </h2>

            <p className="mt-5 text-muted-foreground">
              The admission process is designed to be clear, structured, and
              easy to follow.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:block" />

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {admissionSteps.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.step}
                    className="relative rounded-[26px] border bg-background/70 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <Icon className="h-5 w-5" />
                      </div>

                      <span className="text-sm font-bold text-muted-foreground">
                        {item.step}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold">{item.title}</h3>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* REQUIREMENTS */}
      <section className="relative border-y bg-muted/20 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Admission Requirements
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
                Prepare the information needed
                <span className="block text-primary">for your application</span>
              </h2>

              <p className="mt-6 max-w-xl leading-7 text-muted-foreground">
                Applicants should prepare their academic and personal
                information before starting the admission process.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {requirements.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border bg-background/70 p-4"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>

                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-16 rounded-full bg-primary/10 blur-3xl" />

              <div className="relative rounded-[30px] border bg-background/65 p-6 shadow-xl backdrop-blur-xl md:p-8">
                <div className="flex items-center gap-4 border-b pb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <GraduationCap className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      Application Overview
                    </p>

                    <h3 className="mt-1 text-xl font-semibold">
                      Student Admission
                    </h3>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <ApplicationRow
                    label="Personal Information"
                    status="Required"
                  />

                  <ApplicationRow label="Academic Records" status="Required" />

                  <ApplicationRow label="Program Selection" status="Required" />

                  <ApplicationRow
                    label="Document Review"
                    status="Verification"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STUDY PATHS */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Before You Apply
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              Explore your academic options
            </h2>

            <p className="mt-5 text-muted-foreground">
              Review departments, programs, courses, and semester information
              before choosing your academic path.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {studyPaths.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-[26px] border bg-background/70 p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-violet-500/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-7 text-lg font-semibold">{item.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
                    Explore
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* NOTE */}
      <section className="container mx-auto px-4 pb-12">
        <div className="flex flex-col gap-5 rounded-[28px] border bg-primary/5 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-semibold">Need help with admissions?</h3>

              <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
                Contact the university admissions team if you need help
                understanding programs, requirements, or the application
                process.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border bg-background px-5 text-sm font-medium transition hover:bg-muted"
          >
            Contact Us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function ApplicationRow({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border bg-background/60 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <CheckCircle2 className="h-4 w-4" />
        </div>

        <span className="text-sm font-medium">{label}</span>
      </div>

      <span className="rounded-full border bg-muted/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {status}
      </span>
    </div>
  );
}
