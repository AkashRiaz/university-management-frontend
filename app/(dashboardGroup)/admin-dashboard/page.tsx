import { Suspense } from "react";
import AdminDashboardOverviewLoading from "./_components/DashboardOverview/AdminDashboardOverviewLoading";
import AdminDashboardOverview from "./_components/DashboardOverview/AdminDashboardOverview";
const AdminDashboardPage = () => {
  return (
    <div className="mx-auto max-w-[1600px] p-2 md:p-5">
      <Suspense fallback={<AdminDashboardOverviewLoading />}>
        <AdminDashboardOverview />
      </Suspense>
    </div>
  );
};

export default AdminDashboardPage;
