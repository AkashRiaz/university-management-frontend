import React, { Suspense } from "react";
import ScholarshipLoadingTable from "../_components/Scholarship/ScholarshipLoadingTable";
import ScholarshipTable from "../_components/Scholarship/ScholarshipTable";

type ScholarshipPageProps = {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const ScholarshipPage = async ({ searchParams }: ScholarshipPageProps) => (
  <div className="flex flex-col gap-4 p-2 md:p-5">
    <Suspense fallback={<ScholarshipLoadingTable />}>
      <ScholarshipTable searchParams={await searchParams} />
    </Suspense>
  </div>
);

export default ScholarshipPage;
