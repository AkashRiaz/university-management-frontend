import React, { Suspense } from "react";
import SemesterLoadingTable from "../_components/Semester/SemesterLoadingTable";
import SemesterTable from "../_components/Semester/SemesterTable";

type SemesterPageProps = {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const SemesterPage = async ({ searchParams }: SemesterPageProps) => (
  <div className="flex flex-col gap-4 p-2 md:p-5">
    <Suspense fallback={<SemesterLoadingTable />}>
      <SemesterTable searchParams={await searchParams} />
    </Suspense>
  </div>
);

export default SemesterPage;
