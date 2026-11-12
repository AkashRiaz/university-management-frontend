import { getMyStudentProfileAction } from "../_actions/profileActions";
import StudentProfileForm from "../_components/StudentProfileForm";

const StudentProfilePage = async () => {
  const result = await getMyStudentProfileAction();
  const data = result.data;
  const profile =
    data && "studentProfile" in data ? data.studentProfile : data;

  if (!result.success || !profile || !("id" in profile)) {
    return <div className="p-6 text-sm text-destructive">{result.message}</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <StudentProfileForm profile={profile} />
    </div>
  );
};

export default StudentProfilePage;
