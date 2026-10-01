import React, { Suspense } from "react";
import ClassScheduleLoadingTable from "../_components/ClassSchedule/ClassScheduleLoadingTable";
import ClassScheduleTable from "../_components/ClassSchedule/ClassScheduleTable";

type ClassSchedulesPageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

const ClassSchedulesPage = async ({
  searchParams,
}: ClassSchedulesPageProps) => {
  return (
    <div className="flex flex-col gap-4 p-2 md:p-5">
      <Suspense fallback={<ClassScheduleLoadingTable />}>
        <ClassScheduleTable searchParams={await searchParams} />
      </Suspense>
    </div>
  );
};

export default ClassSchedulesPage;
