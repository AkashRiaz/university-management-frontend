import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  GraduationCap,
  Layers3,
  Library,
  Sparkles,
  Users,
} from "lucide-react";
import BannerPhoto from "../_components/BannerPhoto";

const academicAreas = [
  {
    title: "Departments",
    description:
      "Explore the academic departments that organize programs, courses, instructors, and areas of study.",
    icon: Building2,
    href: "/departments",
    label: "Academic Units",
  },
  {
    title: "Programs",
    description:
      "Discover undergraduate and graduate programs designed around structured academic pathways.",
    icon: GraduationCap,
    href: "/programs",
    label: "Study Paths",
  },
  {
    title: "Courses",
    description:
      "Browse courses, credits, course levels, and program-specific academic offerings.",
    icon: BookOpen,
    href: "/courses",
    label: "Learning",
  },
  {
    title: "Semesters",
    description:
      "Understand academic years, semester timelines, registration periods, and study cycles.",
    icon: CalendarDays,
    href: "/academic-calendar",
    label: "Schedule",
  },
];

const journey = [
  {
    step: "01",
    title: "Choose a Program",
    description:
      "Students begin by joining an academic program within a department.",
  },
  {
    step: "02",
    title: "Follow the Curriculum",
    description:
      "Each program defines the courses students should complete semester by semester.",
  },
  {
    step: "03",
    title: "Register for Sections",
    description:
      "Students select available sections for courses offered during the semester.",
  },
  {
    step: "04",
    title: "Complete the Semester",
    description:
      "Attend classes, complete academic activities, and progress through the program.",
  },
];

const highlights = [
  {
    title: "Structured Curriculum",
    description:
      "Courses are mapped to programs and semester levels for a clear academic pathway.",
    icon: Layers3,
  },
  {
    title: "Learning Resources",
    description:
      "Students can access academic resources, study materials, and organized learning environments.",
    icon: Library,
  },
  {
    title: "Academic Community",
    description:
      "Students, instructors, and departments work together in one connected academic environment.",
    icon: Users,
  },
];

export default function AcademicsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      {/* HERO */}
      <section className="dark relative isolate overflow-hidden border-b bg-background text-foreground page-hero-y">
        <BannerPhoto photo="libraryHall" />

        {/* grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "72px 72px",
          }}
        />

        {/* glows */}
        <div className="pointer-events-none absolute -left-32 top-10 h-[380px] w-[380px] rounded-full bg-primary/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-gold/10 blur-3xl" />

        <div className="page-container relative">
          <div className="mx-auto max-w-4xl text-center">
            <div className="eyebrow-pill mb-5">
              <Sparkles className="h-3.5 w-3.5" />
              Academics
            </div>

            <h1 className="display-title">
              Build your future through
              <span className="mt-2 block text-gradient-brand">
                structured academic learning
              </span>
            </h1>

            <p className="section-lead mx-auto mt-5 max-w-2xl">
              Explore departments, programs, courses, semesters, and academic
              pathways designed to guide students through every stage of their
              university journey.
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
                href="/departments"
                className="inline-flex h-12 items-center justify-center rounded-xl border bg-background/60 px-6 font-medium backdrop-blur transition hover:bg-muted"
              >
                View Departments
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ACADEMIC AREAS */}
      <section className="relative section-y">
        <div className="page-container">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="eyebrow">
              Academic Structure
            </p>

            <h2 className="section-title mt-3">
              Everything that shapes your
              <span className="text-primary"> academic journey</span>
            </h2>

            <p className="mt-5 text-muted-foreground">
              Our academic system connects departments, programs, courses, and
              semesters into one organized learning structure.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {academicAreas.map((item, index) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group relative overflow-hidden rounded-[26px] border bg-background/70 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl"
                >
                  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition group-hover:bg-primary/20" />

                  <span className="absolute right-5 top-4 text-5xl font-black text-primary/[0.04]">
                    0{index + 1}
                  </span>

                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/10 bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>

                    <p className="eyebrow mt-8">
                      {item.label}
                    </p>

                    <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
                      Explore
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONNECTED ACADEMIC FLOW */}
      <section className="relative border-y bg-muted/20 section-y">
        <div className="page-container">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            {/* LEFT */}
            <div>
              <p className="eyebrow">
                Academic Journey
              </p>

              <h2 className="section-title mt-3">
                See how your studies
                <span className="block text-primary">connect together</span>
              </h2>

              <p className="mt-6 max-w-xl leading-7 text-muted-foreground">
                Every student belongs to a program, each program contains a
                structured curriculum, and courses are offered through
                semester-based sections.
              </p>

              <div className="mt-8 rounded-3xl border bg-background/60 p-5 backdrop-blur">
                <div className="space-y-3">
                  <FlowRow
                    icon={Building2}
                    label="Department"
                    value="Academic Unit"
                  />

                  <FlowConnector />

                  <FlowRow
                    icon={GraduationCap}
                    label="Program"
                    value="Student Study Path"
                  />

                  <FlowConnector />

                  <FlowRow
                    icon={BookOpen}
                    label="Course"
                    value="Program Curriculum"
                  />

                  <FlowConnector />

                  <FlowRow
                    icon={CalendarDays}
                    label="Semester"
                    value="Course Offering"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-4">
              {journey.map((item) => (
                <div
                  key={item.step}
                  className="group relative overflow-hidden rounded-2xl border bg-background/70 p-5 backdrop-blur transition hover:border-primary/30 hover:shadow-lg"
                >
                  <div className="flex gap-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20">
                      {item.step}
                    </div>

                    <div>
                      <h3 className="font-semibold">{item.title}</h3>

                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="section-y">
        <div className="page-container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="eyebrow">
              Academic Experience
            </p>

            <h2 className="section-title mt-3">
              Designed for meaningful learning
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-[26px] border bg-background/70 p-6 transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-primary/15 to-gold/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-7 text-xl font-semibold">{item.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>

                  <div className="mt-6 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page-container pb-16 md:pb-24">
        <div className="relative overflow-hidden rounded-[30px] border hero-surface border-hero-foreground/10 px-6 py-12 text-center shadow-lifted md:px-10 md:py-16">
          <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full border border-hero-foreground/10" />

          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />

          <div className="relative mx-auto max-w-2xl">
            <GraduationCap className="mx-auto h-10 w-10" />

            <h2 className="section-title mt-3">
              Find the academic path that fits your future
            </h2>

            <p className="mt-4 leading-7 text-hero-muted">
              Explore our programs, departments, and courses to better
              understand the opportunities available throughout your university
              journey.
            </p>

            <Link
              href="/programs"
              className="group mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-gold px-6 font-semibold text-gold-foreground shadow-soft transition hover:-translate-y-0.5 hover:bg-gold/90"
            >
              Browse Programs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function FlowRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-background/70 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function FlowConnector() {
  return (
    <div className="flex h-4 justify-center">
      <div className="h-full w-px bg-gradient-to-b from-primary/50 to-primary/10" />
    </div>
  );
}
