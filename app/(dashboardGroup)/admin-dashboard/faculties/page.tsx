import React, { Suspense } from "react";
import FacultyLoadingTable from "../_components/Faculty/FacultyLoadingTable";
import FacultyTable from "../_components/Faculty/FacultyTable";

type FacultyPageProps = {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const FacultyPage = async ({ searchParams }: FacultyPageProps) => {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<FacultyLoadingTable />}>
        <FacultyTable searchParams={await searchParams} />
      </Suspense>
    </div>
  );
};

export default FacultyPage;
