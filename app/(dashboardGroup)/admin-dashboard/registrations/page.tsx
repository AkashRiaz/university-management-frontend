import { AlertCircle } from "lucide-react";
import { getAllRegistrationsAction } from "../../_actions/registrationActions";
import RegistrationApprovalTable from "../_components/Registration/RegistrationApprovalTable";

const RegistrationsPage = async () => {
  const result = await getAllRegistrationsAction({ limit: "100" });

  if (!result.success) {
    return <div className="m-5 rounded-xl border border-destructive/20 bg-card p-10 text-center text-destructive"><AlertCircle className="mx-auto size-5" /><p className="mt-2">{result.message}</p></div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div><h1 className="text-2xl font-semibold">Registration Approval</h1><p className="text-sm text-muted-foreground">Review submitted student registrations and approve or reject them.</p></div>
      <RegistrationApprovalTable initialRegistrations={Array.isArray(result.data) ? result.data : []} />
    </div>
  );
};

export default RegistrationsPage;
