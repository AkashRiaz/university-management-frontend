"use server";

import { Suspense } from "react";
import ProgramCards from "../_components/Program/ProgramCards";
import ProgramCardsLoading from "../_components/Program/ProgramCardsLoading";

type ProgramsPageProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const ProgramsPage = async ({ searchParams }: ProgramsPageProps) => {
  const params = await searchParams;

  return (
    <main className="min-h-screen overflow-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden border-b py-16 md:py-20">
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

        <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Academics
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              Academic
              <span className="ml-3 bg-gradient-to-r from-primary via-violet-500 to-blue-500 bg-clip-text text-transparent">
                Programs
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-muted-foreground">
              Explore university programs designed to provide structured
              academic pathways, credit requirements, and specialized areas of
              study.
            </p>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <Suspense fallback={<ProgramCardsLoading />}>
          <ProgramCards searchParams={params} />
        </Suspense>
      </section>
    </main>
  );
};

export default ProgramsPage;
