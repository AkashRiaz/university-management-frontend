import { notFound } from "next/navigation";
import UpdateInstructorProfile from "../../_components/instructor/UpdateInstructorProfile";
import { getInstructorByIdAction } from "../../_actions/instructorActions";
import { getAllDepartmentsAction } from "../../_actions/departmentActions";

type InstructorProfilePageProps = {
  params: Promise<{ instructorId: string }>;
};

const InstructorProfilePage = async ({
  params,
}: InstructorProfilePageProps) => {
  const { instructorId } = await params;
  const [instructorResult, departmentResult] = await Promise.all([
    getInstructorByIdAction(instructorId),
    getAllDepartmentsAction(),
  ]);

  if (!instructorResult.success || !instructorResult.data) {
    notFound();
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-3xl">
        <UpdateInstructorProfile
          instructor={instructorResult.data}
          departments={departmentResult?.data || []}
        />
      </div>
    </div>
  );
};

export default InstructorProfilePage;
