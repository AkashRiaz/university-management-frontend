import { Suspense } from "react";
import InstructorTable from "../_components/instructor/InstructorTable";
import InstructorLoadingTable from "../_components/instructor/InstructorLoadingTable";

type InstructorPageProps = {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const AllInstructorsPage = async ({ searchParams }: InstructorPageProps) => {
  return (
    <div className="flex flex-col gap-4 p-2 md:p-5">
      <Suspense fallback={<InstructorLoadingTable />}>
        <InstructorTable searchParams={await searchParams} />
      </Suspense>
    </div>
  );
};

export default AllInstructorsPage;
