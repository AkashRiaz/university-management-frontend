import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Parallax } from "@/components/shared/Parallax";
import {
  DistantCampus,
  FarHills,
  Foreground,
  MainCampus,
} from "./skyline/SkylineLayers";

const CTASection = () => {
  return (
    <section className="page-container section-y">
      <div className="relative overflow-hidden hero-surface rounded-[32px] border border-hero-foreground/10 px-6 pt-16 pb-[min(44vw,320px)] shadow-lifted md:px-12 md:pt-20">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full border border-hero-foreground/10" />
        <div className="absolute -left-5 -top-5 h-40 w-40 rounded-full border border-gold/20" />

        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />

        <div
          aria-hidden="true"
          className="grid-texture absolute inset-0 text-hero-foreground opacity-[0.06]"
        />

        {/* Night campus skyline with layered parallax (decorative) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 aspect-[1440/560] min-h-[260px] mask-t-from-70%"
        >
          <Parallax distance={50} className="absolute -inset-x-10 inset-y-0">
            <FarHills />
          </Parallax>
          <Parallax distance={32} className="absolute -inset-x-10 inset-y-0">
            <DistantCampus />
          </Parallax>
          <Parallax distance={14} className="absolute -inset-x-10 inset-y-0">
            <MainCampus />
          </Parallax>
          <div className="absolute -inset-x-10 inset-y-0">
            <Foreground ground="var(--hero)" />
          </div>
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <p className="eyebrow">Admissions open · Fall 2027</p>

          <h2 className="section-title mt-4">
            Everything you need for your academic journey
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-hero-muted">
            Access courses, semester registrations, invoices, payments and
            academic services through one connected university platform.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gold px-6 font-semibold text-gold-foreground shadow-soft transition hover:-translate-y-0.5 hover:bg-gold/90"
            >
              Access Student Portal
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>

            <Link
              href="/about"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-hero-foreground/25 bg-hero-foreground/5 px-6 font-medium backdrop-blur transition hover:bg-hero-foreground/10"
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
