import React, { Suspense } from "react";
import AcademicYearLoadingTable from "../_components/AcademicYear/AcademicYearLoadingTable";
import AcademicYearTable from "../_components/AcademicYear/AcademicYearTable";

type AcademicYearPageProps = {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};
const AcademicYearPage = async ({ searchParams }: AcademicYearPageProps) => {
  return (
    <div className="flex flex-col gap-4 p-2 md:p-5">
      <Suspense fallback={<AcademicYearLoadingTable />}>
        <AcademicYearTable searchParams={await searchParams} />
      </Suspense>
    </div>
  );
};

export default AcademicYearPage;
