import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";

const CTASection = () => {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="relative overflow-hidden rounded-[32px] border bg-gradient-to-br from-primary via-indigo-600 to-violet-600 px-6 py-16 text-primary-foreground shadow-2xl md:px-12 md:py-20">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute -left-5 -top-5 h-40 w-40 rounded-full border border-white/10" />

        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur">
            <GraduationCap className="h-7 w-7" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            Everything you need for your academic journey
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-white/75">
            Access courses, semester registrations, invoices, payments and
            academic services through one connected university platform.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 font-medium text-slate-950 transition hover:bg-white/90"
            >
              Access Student Portal
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>

            <Link
              href="/about"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 font-medium backdrop-blur transition hover:bg-white/10"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
