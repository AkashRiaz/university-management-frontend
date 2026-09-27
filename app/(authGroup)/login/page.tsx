import LoginForm from "../_components/login/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0b1728] flex items-center justify-center p-6 gap-8 flex-wrap relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.1),_transparent_34%)] pointer-events-none" />
      <LoginForm />
    </main>
  );
}
