import { notFound } from "next/navigation";
import { getAllDepartmentsAction } from "../../_actions/departmentActions";
import {
  getStudentByIdAction,
} from "../../_actions/studentActions";
import { getAllProgramsAction } from "../../_actions/programActions";
import UpdateStudentProfile from "../../_components/student/UpdateStudentProfile";

type StudentProfilePageProps = {
  params: Promise<{ studentId: string }>;
};

const StudentProfilePage = async ({ params }: StudentProfilePageProps) => {
  const { studentId } = await params;
  const [studentResult, departmentResult, programResult] = await Promise.all([
    getStudentByIdAction(studentId),
    getAllDepartmentsAction(),
    getAllProgramsAction({ query: { limit: "100" } }),
  ]);

  if (!studentResult.success || !studentResult.data) {
    notFound();
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <UpdateStudentProfile
          student={studentResult.data}
          departments={departmentResult?.data || []}
          programs={programResult?.data || []}
        />
      </div>
    </div>
  );
};

export default StudentProfilePage;
