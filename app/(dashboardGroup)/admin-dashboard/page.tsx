import { Suspense } from "react";
import AdminDashboardOverviewLoading from "./_components/DashboardOverview/AdminDashboardOverviewLoading";
import AdminDashboardOverview from "./_components/DashboardOverview/AdminDashboardOverview";
const AdminDashboardPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<AdminDashboardOverviewLoading />}>
        <AdminDashboardOverview />
      </Suspense>
    </div>
  );
};

export default AdminDashboardPage;
