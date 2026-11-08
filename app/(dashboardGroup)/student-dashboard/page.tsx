import { Suspense } from "react";
import StudentDashboardOverview from "./_components/DashboardOverview/StudentDashboardOverview";
import StudentDashboardOverviewLoading from "./_components/DashboardOverview/StudentDashboardOverviewLoading";

const StudentDashboardPage = () => {
  return (
    <div className="mx-auto max-w-[1600px] p-2 md:p-5">
      <Suspense fallback={<StudentDashboardOverviewLoading />}>
        <StudentDashboardOverview />
      </Suspense>
    </div>
  );
};

export default StudentDashboardPage;
