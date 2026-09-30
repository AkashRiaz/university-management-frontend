import React, { Suspense } from "react";
import CourseLoadingTable from "../_components/Course/CourseLoadingTable";
import CourseTable from "../_components/Course/CourseTable";

type CoursePageProps = {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const CoursePage = async ({ searchParams }: CoursePageProps) => (
  <div className="flex flex-col gap-4 p-2 md:p-5">
    <Suspense fallback={<CourseLoadingTable />}>
      <CourseTable searchParams={await searchParams} />
    </Suspense>
  </div>
);

export default CoursePage;
