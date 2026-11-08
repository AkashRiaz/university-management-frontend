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
    <div className="p-4 md:p-6">
      <StudentProfileForm profile={profile} />
    </div>
  );
};

export default StudentProfilePage;
