"use server";

import { Suspense } from "react";
import DepartmentLoadingTable from "../_components/Department/DepartmentLoadingTable";
import DepartmentTable from "../_components/Department/DepartmentTable";

type DepartmentPageProps = {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const DepartmentPage = async ({ searchParams }: DepartmentPageProps) => {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<DepartmentLoadingTable />}>
        <DepartmentTable searchParams={await searchParams} />
      </Suspense>
    </div>
  );
};

export default DepartmentPage;
