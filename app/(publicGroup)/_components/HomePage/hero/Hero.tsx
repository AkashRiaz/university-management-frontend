"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const HeroScene = dynamic(() => import("./scene"), {
  ssr: false,
});

function Poster() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Main glow */}
      <div
        className="absolute left-[68%] top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 40% 35%, rgba(59,130,246,0.30), rgba(139,92,246,0.18) 42%, transparent 72%)",
        }}
      />

      {/* Ring */}
      <div
        className="absolute left-[68%] top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/15"
        style={{
          boxShadow: "0 0 120px rgba(99,102,241,0.14) inset",
        }}
      />

      {/* Additional glow */}
      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
    </div>
  );
}

const academicItems = [
  {
    code: "CSE101",
    name: "Programming",
    status: "Registered",
  },
  {
    code: "CSE203",
    name: "Data Structures",
    status: "Available",
  },
  {
    code: "MAT201",
    name: "Discrete Math",
    status: "Registered",
  },
];

export default function Hero() {
  const [show3d, setShow3d] = useState(false);

  useEffect(() => {
    // 3D is decorative only.
    // Avoid loading it on reduced motion / slow or low-memory devices.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: {
        saveData?: boolean;
        effectiveType?: string;
      };
    };

    if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) {
      return;
    }

    if (nav.connection?.saveData) {
      return;
    }

    if (
      nav.connection?.effectiveType &&
      /2g/.test(nav.connection.effectiveType)
    ) {
      return;
    }

    let timerId: number | undefined;
    let idleId: number | undefined;

    const loadScene = () => {
      const idle =
        window.requestIdleCallback ??
        ((callback: () => void) => window.setTimeout(callback, 1000));

      timerId = window.setTimeout(() => {
        idleId = idle(
          () => {
            setShow3d(true);
          },
          {
            timeout: 2000,
          },
        );
      }, 900);
    };

    if (document.readyState === "complete") {
      loadScene();
    } else {
      window.addEventListener("load", loadScene, {
        once: true,
      });
    }

    return () => {
      window.removeEventListener("load", loadScene);

      if (timerId) {
        window.clearTimeout(timerId);
      }

      if (idleId && window.cancelIdleCallback) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);

  return (
    <section className="relative isolate min-h-[calc(100vh-72px)] overflow-hidden border-b">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />

      {/* Grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(to bottom, black, transparent 85%)",
        }}
      />

      {/* 3D background */}
      <div className="pointer-events-none absolute inset-0">
        {show3d ? <HeroScene /> : <Poster />}
      </div>

      {/* Left readable gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          background:
            "linear-gradient(to right, hsl(var(--background)) 0%, hsl(var(--background) / 0.96) 34%, hsl(var(--background) / 0.52) 55%, transparent 74%)",
        }}
      />

      {/* Mobile overlay */}
      <div className="pointer-events-none absolute inset-0 bg-background/70 lg:hidden" />

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{
          background:
            "linear-gradient(to top, hsl(var(--background)), transparent)",
        }}
      />

      <div className="container relative mx-auto px-4">
        <div className="grid min-h-[calc(100vh-72px)] items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          {/* Left */}
          <div className="relative z-10 max-w-3xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-2 text-sm shadow-sm backdrop-blur">
              <GraduationCap className="h-4 w-4 text-primary" />

              <span className="font-medium">Smart University Management</span>

              <span className="h-1 w-1 rounded-full bg-muted-foreground" />

              <span className="text-muted-foreground">
                Built for modern education
              </span>
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Your complete
              <span className="relative block">
                <span className="bg-gradient-to-r from-primary via-violet-500 to-blue-500 bg-clip-text text-transparent">
                  academic journey
                </span>

                <span className="absolute -bottom-2 left-0 h-px w-40 bg-gradient-to-r from-primary to-transparent" />
              </span>
              in one platform
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
              Connect students, instructors, courses, semesters, registrations,
              payments, and academic administration through one secure
              university management system.
            </p>

            {/* CTA */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-medium text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"
              >
                Access Student Portal
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/about"
                className="inline-flex h-12 items-center justify-center rounded-xl border bg-background/60 px-6 font-medium backdrop-blur transition hover:bg-muted"
              >
                Explore the Platform
              </Link>
            </div>

            {/* mini stats */}
            <dl className="mt-12 grid max-w-xl grid-cols-3 gap-3 border-t pt-7 sm:gap-8">
              <div>
                <dt className="text-xs text-muted-foreground sm:text-sm">
                  Academic System
                </dt>

                <dd className="mt-1 text-xl font-bold sm:text-2xl">Unified</dd>
              </div>

              <div>
                <dt className="text-xs text-muted-foreground sm:text-sm">
                  Role Access
                </dt>

                <dd className="mt-1 text-xl font-bold sm:text-2xl">Secure</dd>
              </div>

              <div>
                <dt className="text-xs text-muted-foreground sm:text-sm">
                  Platform
                </dt>

                <dd className="mt-1 text-xl font-bold sm:text-2xl">24/7</dd>
              </div>
            </dl>
          </div>

          {/* Right foreground dashboard */}
          <div className="relative z-10 mx-auto w-full max-w-[430px] lg:translate-x-6">
            <div className="absolute -inset-10 -z-10 rounded-full bg-primary/10 blur-3xl" />

            <div className="overflow-hidden rounded-[28px] border bg-background/65 p-2 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[22px] border bg-card/85 p-5 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Student Portal
                    </p>

                    <h2 className="mt-1 text-xl font-semibold">
                      Spring Semester
                    </h2>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-5 rounded-2xl bg-primary/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Registration progress
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        Almost ready to submit
                      </p>
                    </div>

                    <span className="text-sm font-bold text-primary">75%</span>
                  </div>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-primary to-violet-500" />
                  </div>
                </div>

                {/* info cards */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <InfoCard
                    icon={CalendarDays}
                    label="Semester"
                    value="Spring 2026"
                  />

                  <InfoCard icon={CheckCircle2} label="Status" value="Draft" />
                </div>

                {/* courses */}
                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />

                      <p className="text-sm font-semibold">My Courses</p>
                    </div>

                    <span className="text-xs text-muted-foreground">
                      {academicItems.length} courses
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {academicItems.map((course) => (
                      <li
                        key={course.code}
                        className="flex items-center gap-3 rounded-xl border bg-background/60 p-3"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                          {course.code.slice(0, 3)}
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-primary">
                            {course.code}
                          </p>

                          <p className="truncate text-sm">{course.name}</p>
                        </div>

                        <span
                          className={`ml-auto rounded-full px-2.5 py-1 text-[10px] font-medium ${
                            course.status === "Registered"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-amber-500/10 text-amber-600"
                          }`}
                        >
                          {course.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* footer */}
                <div className="mt-5 flex items-center justify-between rounded-xl border border-dashed p-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Registration
                    </p>

                    <p className="mt-0.5 text-sm font-medium">
                      3 courses selected
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* floating decoration */}
            <div className="absolute -left-10 top-16 hidden rounded-2xl border bg-background/70 p-3 shadow-xl backdrop-blur md:block">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
                  <BookOpen className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-[10px] text-muted-foreground">
                    Available Courses
                  </p>

                  <p className="text-sm font-bold">12</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-8 bottom-20 hidden rounded-2xl border bg-background/70 p-3 shadow-xl backdrop-blur md:block">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-[10px] text-muted-foreground">Payment</p>

                  <p className="text-sm font-bold">Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-background/60 p-3">
      <Icon className="mb-3 h-4 w-4 text-primary" />

      <p className="text-[11px] text-muted-foreground">{label}</p>

      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
