import AuthShell from "../_components/AuthShell";
import VerifyInstructorForm from "../_components/verifyInstructor/VerifyInstructorForm";

const VerifyInstructorPage = () => (
  <AuthShell
    eyebrow="Faculty onboarding"
    heading="Teach, track and inspire — all from one workspace."
    description="Confirm your instructor email with the one-time code from administration to access your sections, rosters and attendance tools."
  >
    <VerifyInstructorForm />
  </AuthShell>
);

export default VerifyInstructorPage;
