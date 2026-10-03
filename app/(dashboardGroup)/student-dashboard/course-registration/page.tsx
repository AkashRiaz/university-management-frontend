import { getAllSemestersAction } from "../../admin-dashboard/_actions/semesterActions";
import { getMyInvoicesAction } from "../_actions/paymentActions";
import { getMyRegistrationsAction } from "../_actions/registrationActions";
import type { IInvoice } from "@/types/invoice.type";
import RegistrationWorkspace from "../_components/RegistrationWorkspace";

const CourseRegistrationPage = async () => {
  const [semesterResult, registrationResult, invoiceResult] = await Promise.all([
    getAllSemestersAction({ query: { limit: "100" } }),
    getMyRegistrationsAction({ limit: "100" }),
    getMyInvoicesAction(),
  ]);
  const invoices = Array.isArray(invoiceResult.data)
    ? (invoiceResult.data as IInvoice[])
    : [];

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <RegistrationWorkspace
        semesters={semesterResult.data || []}
        initialRegistrations={
          Array.isArray(registrationResult.data) ? registrationResult.data : []
        }
        invoices={invoices}
      />
    </div>
  );
};

export default CourseRegistrationPage;
