import AuthShell from "../_components/AuthShell";
import VerifyStudentForm from "../_components/verifyStudent/VerifyStudentForm";

const VerifyStudentPage = () => {
  return (
    <AuthShell
      eyebrow="Student onboarding"
      heading="Welcome to Apex. Let's activate your student account."
      description="Use the one-time code sent by the registrar's office to confirm your university email and unlock your student dashboard."
    >
      <VerifyStudentForm />
    </AuthShell>
  );
};

export default VerifyStudentPage;
