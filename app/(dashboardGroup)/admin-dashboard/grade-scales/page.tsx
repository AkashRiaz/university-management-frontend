import React, { Suspense } from "react";
import GradeScaleLoadingTable from "../_components/GradeScale/GradeScaleLoadingTable";
import GradeScaleTable from "../_components/GradeScale/GradeScaleTable";

type GradeScalePageProps = {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const GradeScalePage = async ({ searchParams }: GradeScalePageProps) => (
  <div className="flex flex-col gap-4 p-2 md:p-5">
    <Suspense fallback={<GradeScaleLoadingTable />}>
      <GradeScaleTable searchParams={await searchParams} />
    </Suspense>
  </div>
);

export default GradeScalePage;
