import AuthShell from "../_components/AuthShell";
import LoginForm from "../_components/login/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="University portal"
      heading="Your academic life, organised in one place."
      description="Sign in to manage courses, registrations, attendance, results and payments — wherever you are on campus."
    >
      <LoginForm />
    </AuthShell>
  );
}
