import React, { Suspense } from "react";
import GradeLoadingTable from "../../_components/Grade/GradeLoadingTable";
import GradeTable from "../../_components/Grade/GradeTable";

type GradeScaleGradesPageProps = {
  params: Promise<{ gradeScaleId: string }>;
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const GradeScaleGradesPage = async ({
  params,
  searchParams,
}: GradeScaleGradesPageProps) => {
  const { gradeScaleId } = await params;

  return (
    <div className="flex flex-col gap-4 p-2 md:p-5">
      <Suspense fallback={<GradeLoadingTable />}>
        <GradeTable
          gradeScaleId={gradeScaleId}
          searchParams={await searchParams}
        />
      </Suspense>
    </div>
  );
};

export default GradeScaleGradesPage;
