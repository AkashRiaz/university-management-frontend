import { getMyInstructorProfileAction, type InstructorProfile } from "../_actions/profileActions";
import InstructorProfileForm from "../_components/InstructorProfileForm";

const InstructorProfilePage = async () => {
  const result = await getMyInstructorProfileAction();
  const data = result.data;
  const profile = data as InstructorProfile;

  if (!result.success || !profile) {
    return <div className="p-4 text-sm text-destructive md:p-6">{result.message}</div>;
  }

  return <div className="p-4 md:p-6"><InstructorProfileForm profile={profile} /></div>;
};

export default InstructorProfilePage;
