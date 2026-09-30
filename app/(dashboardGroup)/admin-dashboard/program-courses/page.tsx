import React, { Suspense } from "react";
import ProgramCourseLoadingTable from "../_components/ProgramCourse/ProgramCourseLoadingTable";
import ProgramCourseTable from "../_components/ProgramCourse/ProgramCourseTable";

type ProgramCoursePageProps = {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const ProgramCoursePage = async ({ searchParams }: ProgramCoursePageProps) => (
  <div className="flex flex-col gap-4 p-2 md:p-5">
    <Suspense fallback={<ProgramCourseLoadingTable />}>
      <ProgramCourseTable searchParams={await searchParams} />
    </Suspense>
  </div>
);

export default ProgramCoursePage;
