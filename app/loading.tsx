import { GraduationCap, LoaderCircle, Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b1728] px-6 py-12 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_34%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/10 blur-[130px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #7dd3fc 1px, transparent 1px), linear-gradient(to bottom, #7dd3fc 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <section className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
        <div className="flex items-center gap-2 text-sm font-semibold tracking-wide text-sky-200">
          <GraduationCap className="h-5 w-5 text-sky-300" />
          My University
        </div>

        <div className="relative mt-14 flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-sky-300/10" />
          <div className="absolute inset-2 rounded-full border border-dashed border-sky-300/25 animate-[spin_8s_linear_infinite]" />
          <div className="absolute inset-5 rounded-full bg-sky-400/15 blur-2xl" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-sky-300/20 bg-sky-400/10 text-sky-200 shadow-[0_0_35px_rgba(56,189,248,0.18)]">
            <LoaderCircle className="h-7 w-7 animate-spin text-sky-300" />
          </div>
          <Sparkles className="absolute -right-1 top-1 h-5 w-5 animate-pulse text-sky-300" />
        </div>

        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.32em] text-sky-300/80">
          Please wait
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-50 sm:text-5xl">
          Preparing your portal
        </h1>
        <p className="mt-5 max-w-md text-sm leading-7 text-slate-400 sm:text-base">
          We&apos;re getting everything ready for you. This will only take a
          moment.
        </p>

        <div className="mt-9 h-1.5 w-48 overflow-hidden rounded-full bg-blue-950/70">
          <div className="h-full w-2/5 animate-pulse rounded-full bg-gradient-to-r from-sky-400 to-blue-500" />
        </div>
      </section>
    </main>
  );
}
