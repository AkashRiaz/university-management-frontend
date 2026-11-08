import { notFound } from "next/navigation";
import UpdateDepartmentForm from "../../_components/Department/UpdateDepartmentForm";
import { getDepartmentByIdAction } from "../../_actions/departmentActions";
import { getAllFaculties } from "../../_actions/facultyActions";

const DepartmentEditPage = async ({ params }: { params: Promise<{ departmentId: string }> }) => {
  const { departmentId } = await params;
  const [departmentResult, facultyResult] = await Promise.all([
    getDepartmentByIdAction(departmentId),
    getAllFaculties({ query: { limit: "100" } }),
  ]);
  if (!departmentResult.success || !departmentResult.data) notFound();
  return <div className="grid min-h-svh lg:grid-cols-3"><div className="col-span-3 flex flex-col gap-4 p-6 md:p-10"><div className="flex flex-1 items-center justify-center"><div className="w-full max-w-2xl"><UpdateDepartmentForm department={departmentResult.data} faculties={facultyResult.data || []} /></div></div></div></div>;
};

export default DepartmentEditPage;
