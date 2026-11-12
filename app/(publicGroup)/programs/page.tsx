"use server";

import { Suspense } from "react";
import ProgramCards from "../_components/Program/ProgramCards";
import ProgramCardsLoading from "../_components/Program/ProgramCardsLoading";
import BannerPhoto from "../_components/BannerPhoto";

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
      <section className="dark relative isolate overflow-hidden border-b bg-background text-foreground page-hero-y">
        <BannerPhoto photo="graduation" />
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

        <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />

        <div className="page-container relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">
              Academics
            </p>

            <h1 className="display-title mt-3">
              Academic
              <span className="ml-3 text-gradient-brand">
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
      <section className="page-container section-y">
        <Suspense fallback={<ProgramCardsLoading />}>
          <ProgramCards searchParams={params} />
        </Suspense>
      </section>
    </main>
  );
};

export default ProgramsPage;
