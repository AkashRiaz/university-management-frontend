import React, { Suspense } from "react";
import FeeStructureLoadingTable from "../_components/FeeStructure/FeeStructureLoadingTable";
import FeeStructureTable from "../_components/FeeStructure/FeeStructureTable";
type FeeStructurePageProps = {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const FeeStructurePage = async ({ searchParams }: FeeStructurePageProps) => (
  <div className="flex flex-col gap-4 p-2 md:p-5">
    <Suspense fallback={<FeeStructureLoadingTable />}>
      <FeeStructureTable searchParams={await searchParams} />
    </Suspense>
  </div>
);

export default FeeStructurePage;
