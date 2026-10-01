import React, { Suspense } from "react";
import FeeStructureItemLoadingTable from "../../../_components/FeeStructureItem/FeeStructureItemLoadingTable";
import FeeStructureItemTable from "../../../_components/FeeStructureItem/FeeStructureItemTable";

type FeeStructureItemsPageProps = {
  params: Promise<{ feeStructureId: string }>;
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const FeeStructureItemsPage = async ({
  params,
  searchParams,
}: FeeStructureItemsPageProps) => {
  const { feeStructureId } = await params;

  return (
    <div className="flex flex-col gap-4 p-2 md:p-5">
      <Suspense fallback={<FeeStructureItemLoadingTable />}>
        <FeeStructureItemTable
          feeStructureId={feeStructureId}
          searchParams={await searchParams}
        />
      </Suspense>
    </div>
  );
};

export default FeeStructureItemsPage;
