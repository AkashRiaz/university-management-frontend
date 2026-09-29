import React, { Suspense } from "react";
import ProgramLoadingTable from "../_components/Program/ProgramLoadingTable";
import ProgramTable from "../_components/Program/ProgramTable";
type ProgramPageProps = {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const ProgramPage = async ({ searchParams }: ProgramPageProps) => {
  return (
    <div className="flex flex-col gap-4 p-2 md:p-5">
      <Suspense fallback={<ProgramLoadingTable />}>
        <ProgramTable searchParams={await searchParams} />
      </Suspense>
    </div>
  );
};

export default ProgramPage;
