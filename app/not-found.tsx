"use client";

import { ArrowLeft, GraduationCap, Home, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b1728] px-6 py-12 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_34%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/10 blur-[130px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #7dd3fc 1px, transparent 1px), linear-gradient(to bottom, #7dd3fc 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <section className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        <div className="flex items-center gap-2 text-sm font-semibold tracking-wide text-sky-200">
          <GraduationCap className="h-5 w-5 text-sky-300" />
          My University
        </div>

        <div className="relative mt-12">
          <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/15 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-300/10" />
          <p className="relative bg-gradient-to-b from-white via-sky-100 to-sky-500 bg-clip-text text-[9rem] font-black leading-[0.8] tracking-[-0.14em] text-transparent drop-shadow-[0_0_35px_rgba(56,189,248,0.2)] sm:text-[13rem]">
            404
          </p>
        </div>

        <div className="mt-10 flex h-14 w-14 items-center justify-center rounded-full border border-sky-300/20 bg-sky-400/10 text-sky-300">
          <SearchX className="h-6 w-6" strokeWidth={1.8} />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.32em] text-sky-300/80">
          Page not found
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-50 sm:text-5xl">
          We can&apos;t find that page
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-slate-400 sm:text-base">
          The link may be broken, or this page may have moved to another place
          in the university portal.
        </p>

        <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/"
            className="group flex items-center justify-center gap-2 rounded-full bg-sky-300 px-7 py-3 text-sm font-semibold text-[#0b1728] shadow-lg shadow-sky-950/30 transition hover:-translate-y-0.5 hover:bg-sky-200"
          >
            <Home className="h-4 w-4" />
            Back to home
          </Link>
          <button
            onClick={() => router.back()}
            className="group flex items-center justify-center gap-2 rounded-full border border-blue-200/20 bg-blue-950/40 px-7 py-3 text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:border-sky-300/40 hover:bg-blue-900/50"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Go back
          </button>
        </div>
      </section>
    </main>
  );
}
