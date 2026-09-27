import React, { Suspense } from "react";
import StudentTable from "../_components/student/StudentTable";
import StudentLoadingTable from "../_components/student/StudentLoadingTable";
type StudentPageProps = {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};
const AllStudentPageForAdmin = async ({ searchParams }: StudentPageProps) => {
  return (
    <div className="flex flex-col gap-4 p-2 md:p-5">
      <Suspense fallback={<StudentLoadingTable />}>
        <StudentTable searchParams={await searchParams} />
      </Suspense>
    </div>
  );
};

export default AllStudentPageForAdmin;
