import { Suspense } from "react";
import StudentDashboardOverview from "./_components/DashboardOverview/StudentDashboardOverview";
import StudentDashboardOverviewLoading from "./_components/DashboardOverview/StudentDashboardOverviewLoading";

const StudentDashboardPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<StudentDashboardOverviewLoading />}>
        <StudentDashboardOverview />
      </Suspense>
    </div>
  );
};

export default StudentDashboardPage;
