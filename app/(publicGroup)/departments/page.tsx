"use server";
import { Suspense } from "react";
import DepartmentCards from "../_components/Department/DepartmentCards";
import DepartmentCardsLoading from "../_components/Department/DepartmentCardsLoading";
import BannerPhoto from "../_components/BannerPhoto";

type DepartmentsPageProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const DepartmentsPage = async ({ searchParams }: DepartmentsPageProps) => {
  const params = await searchParams;

  return (
    <main className="min-h-screen overflow-hidden">
      {/* Hero */}
      <section className="dark relative isolate overflow-hidden border-b bg-background text-foreground page-hero-y">
        <BannerPhoto photo="heritageBuilding" />
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
                Departments
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-muted-foreground">
              Explore the academic departments that organize our programs,
              courses, faculty members, and areas of study across the
              university.
            </p>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="page-container section-y">
        <Suspense fallback={<DepartmentCardsLoading />}>
          <DepartmentCards searchParams={params} />
        </Suspense>
      </section>
    </main>
  );
};

export default DepartmentsPage;
