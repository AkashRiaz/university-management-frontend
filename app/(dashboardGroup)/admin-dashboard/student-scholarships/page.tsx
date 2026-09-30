import React, { Suspense } from "react";
import StudentScholarshipLoadingTable from "../_components/StudentScholarship/StudentScholarshipLoadingTable";
import StudentScholarshipTable from "../_components/StudentScholarship/StudentScholarshipTable";

type StudentScholarshipPageProps = {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const StudentScholarshipPage = async ({
  searchParams,
}: StudentScholarshipPageProps) => (
  <div className="flex flex-col gap-4 p-2 md:p-5">
    <Suspense fallback={<StudentScholarshipLoadingTable />}>
      <StudentScholarshipTable searchParams={await searchParams} />
    </Suspense>
  </div>
);

export default StudentScholarshipPage;
