import { notFound } from "next/navigation";
import UpdateProgramForm from "../../_components/Program/UpdateProgramForm";
import { getProgramByIdAction } from "../../_actions/programActions";
import { getAllDepartmentsAction } from "../../_actions/departmentActions";

const ProgramEditPage = async ({ params }: { params: Promise<{ programId: string }> }) => {
  const { programId } = await params;
  const [programResult, departmentResult] = await Promise.all([
    getProgramByIdAction(programId),
    getAllDepartmentsAction({ query: { limit: "100" } }),
  ]);
  if (!programResult.success || !programResult.data) notFound();
  return <div className="grid min-h-svh lg:grid-cols-3"><div className="col-span-3 flex flex-col gap-4 p-6 md:p-10"><div className="flex flex-1 items-center justify-center"><div className="w-full max-w-2xl"><UpdateProgramForm program={programResult.data} departments={departmentResult.data || []} /></div></div></div></div>;
};

export default ProgramEditPage;
