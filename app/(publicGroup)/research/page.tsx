import Link from "next/link";
import {
  ArrowRight,
  Atom,
  Beaker,
  BookOpen,
  BrainCircuit,
  FlaskConical,
  GraduationCap,
  Microscope,
  Network,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

const researchAreas = [
  {
    title: "Artificial Intelligence",
    description:
      "Explore intelligent systems, machine learning, data-driven applications, and emerging AI technologies.",
    icon: BrainCircuit,
    label: "Technology",
  },
  {
    title: "Software & Computing",
    description:
      "Research modern software systems, distributed applications, algorithms, and computing technologies.",
    icon: Network,
    label: "Computing",
  },
  {
    title: "Science & Innovation",
    description:
      "Encourage experimental research, scientific exploration, and innovative solutions across disciplines.",
    icon: FlaskConical,
    label: "Science",
  },
  {
    title: "Interdisciplinary Research",
    description:
      "Connect researchers from different academic fields to solve complex real-world challenges.",
    icon: Atom,
    label: "Collaboration",
  },
];

const researchProcess = [
  {
    step: "01",
    title: "Identify a Research Problem",
    description:
      "Begin with a meaningful academic, scientific, social, or technological question.",
    icon: Search,
  },
  {
    step: "02",
    title: "Develop the Research",
    description:
      "Study existing knowledge, design methods, collect information, and test ideas.",
    icon: Beaker,
  },
  {
    step: "03",
    title: "Collaborate & Analyze",
    description:
      "Work with instructors, students, and research teams to analyze findings and improve outcomes.",
    icon: Users,
  },
  {
    step: "04",
    title: "Share Knowledge",
    description:
      "Present findings through reports, academic projects, publications, and research activities.",
    icon: BookOpen,
  },
];

const opportunities = [
  {
    title: "Student Research",
    description:
      "Students can develop academic research skills by participating in projects and guided research activities.",
    icon: GraduationCap,
  },
  {
    title: "Faculty Research",
    description:
      "Faculty members contribute through academic studies, innovation, publications, and collaborative projects.",
    icon: Microscope,
  },
  {
    title: "Research Collaboration",
    description:
      "Different departments can work together on interdisciplinary projects and shared research interests.",
    icon: Users,
  },
];

export default function ResearchPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b py-20 md:py-28">
        {/* Grid */}
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

        {/* Glows */}
        <div className="pointer-events-none absolute -left-32 top-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-[450px] w-[450px] rounded-full bg-violet-500/10 blur-3xl" />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Research & Innovation
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Discover ideas that
              <span className="mt-2 block bg-gradient-to-r from-primary via-violet-500 to-blue-500 bg-clip-text text-transparent">
                create new possibilities
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Our research environment encourages students and faculty to
              explore new ideas, investigate meaningful problems, and develop
              knowledge that can contribute to society and technology.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="#research-areas"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-medium text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5"
              >
                Explore Research Areas
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>

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

      {/* Research Areas */}
      <section id="research-areas" className="relative py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Research Areas
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              Explore areas of
              <span className="text-primary"> academic discovery</span>
            </h2>

            <p className="mt-5 text-muted-foreground">
              Research can span technology, science, computing, and
              interdisciplinary areas across the university.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {researchAreas.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-[28px] border bg-background/70 p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
                >
                  <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-primary/10 blur-3xl transition group-hover:bg-primary/20" />

                  <span className="absolute right-6 top-4 text-7xl font-black text-primary/[0.04]">
                    0{index + 1}
                  </span>

                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/20 to-violet-500/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>

                      <span className="rounded-full border bg-muted/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {item.label}
                      </span>
                    </div>

                    <h3 className="mt-9 text-2xl font-semibold tracking-tight">
                      {item.title}
                    </h3>

                    <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>

                    <div className="mt-7 h-px bg-gradient-to-r from-primary/40 via-border to-transparent" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Research Process */}
      <section className="relative border-y bg-muted/20 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Research Journey
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              From an idea to
              <span className="text-primary"> meaningful knowledge</span>
            </h2>

            <p className="mt-5 text-muted-foreground">
              Research is a structured process of asking questions,
              investigating evidence, analyzing findings, and sharing results.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:block" />

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {researchProcess.map((item) => {
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

      {/* Research Opportunities */}
      <section className="relative py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            {/* Left */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Research Community
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
                Research grows through
                <span className="block text-primary">collaboration</span>
              </h2>

              <p className="mt-6 max-w-xl leading-7 text-muted-foreground">
                Students, instructors, departments, and research teams can work
                together to exchange ideas, investigate problems, and create
                meaningful academic outcomes.
              </p>

              <Link
                href="/departments"
                className="group mt-7 inline-flex items-center gap-2 font-medium text-primary"
              >
                Explore Academic Departments
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Right */}
            <div className="space-y-4">
              {opportunities.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group flex gap-5 rounded-[26px] border bg-background/70 p-6 backdrop-blur transition hover:border-primary/30 hover:shadow-lg"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>

                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Research Environment */}
      <section className="container mx-auto px-4 pb-20">
        <div className="relative overflow-hidden rounded-[30px] border bg-gradient-to-br from-primary via-indigo-600 to-violet-600 px-6 py-12 text-primary-foreground shadow-xl md:px-10 md:py-16">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `
                linear-gradient(to right, white 1px, transparent 1px),
                linear-gradient(to bottom, white 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />

          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full border border-white/10" />

          <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

          <div className="relative mx-auto max-w-2xl text-center">
            <Microscope className="mx-auto h-11 w-11" />

            <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
              Explore, investigate, and create knowledge
            </h2>

            <p className="mx-auto mt-5 max-w-xl leading-7 text-white/75">
              Research is an opportunity to move beyond the classroom,
              investigate important questions, and contribute new ideas to
              academic and professional communities.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/academics"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 font-medium text-slate-950 transition hover:bg-white/90"
              >
                Explore Academics
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 font-medium backdrop-blur transition hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
