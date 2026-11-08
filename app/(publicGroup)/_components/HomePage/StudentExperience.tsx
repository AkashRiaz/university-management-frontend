"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpenCheck,
  CalendarDays,
  CreditCard,
  GraduationCap,
  Library,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Experience = {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  label: string;
};

const experiences: Experience[] = [
  {
    number: "01",
    title: "Course Registration",
    description:
      "Browse available courses, choose your preferred sections and build your semester registration.",
    icon: BookOpenCheck,
    label: "Academics",
  },
  {
    number: "02",
    title: "Academic Schedule",
    description:
      "Stay updated with semester timelines, registration periods, classes and important academic dates.",
    icon: CalendarDays,
    label: "Schedule",
  },
  {
    number: "03",
    title: "Semester Payments",
    description:
      "Check semester invoices, outstanding balances and payment history from your student account.",
    icon: CreditCard,
    label: "Finance",
  },
  {
    number: "04",
    title: "Academic Resources",
    description:
      "Access courses, learning resources and important academic information from one connected platform.",
    icon: Library,
    label: "Resources",
  },
  {
    number: "05",
    title: "Notifications",
    description:
      "Stay informed about registrations, payments, academic updates and important university announcements.",
    icon: Bell,
    label: "Updates",
  },
  {
    number: "06",
    title: "Student Journey",
    description:
      "Manage your university journey from admission and course registration through semester completion.",
    icon: GraduationCap,
    label: "Student Life",
  },
];

export default function StudentExperience() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;

    const scrollAmount = 380;

    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative overflow-hidden border-y bg-muted/20 py-20 md:py-28">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />

      <div className="pointer-events-none absolute -right-40 bottom-10 h-[450px] w-[450px] rounded-full bg-violet-500/5 blur-3xl" />

      {/* Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "70px 70px",
        }}
      />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex rounded-full border bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Student Experience
            </div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Everything students need
              <span className="block bg-gradient-to-r from-primary via-violet-500 to-blue-500 bg-clip-text text-transparent">
                throughout their journey
              </span>
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
              From selecting courses to managing payments and academic
              activities, students can handle their university journey
              through one connected platform.
            </p>
          </div>

          {/* Desktop slider controls */}
          <div className="hidden items-center gap-3 sm:flex">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Previous experience"
              className="flex h-12 w-12 items-center justify-center rounded-full border bg-background/70 text-foreground backdrop-blur transition hover:border-primary/40 hover:bg-primary hover:text-primary-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Next experience"
              className="flex h-12 w-12 items-center justify-center rounded-full border bg-background/70 text-foreground backdrop-blur transition hover:border-primary/40 hover:bg-primary hover:text-primary-foreground"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div className="relative">
          {/* left fade */}
          <div className="pointer-events-none absolute -left-1 top-0 z-10 hidden h-full w-12 bg-gradient-to-r from-background/80 to-transparent lg:block" />

          {/* right fade */}
          <div className="pointer-events-none absolute -right-1 top-0 z-10 hidden h-full w-20 bg-gradient-to-l from-background/80 to-transparent lg:block" />

          <motion.div
            ref={sliderRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {experiences.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.number}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                  }}
                  whileHover={{
                    y: -6,
                  }}
                  className="
                    group
                    relative
                    min-w-[85%]
                    snap-start
                    overflow-hidden
                    rounded-[28px]
                    border
                    bg-background/65
                    p-6
                    shadow-sm
                    backdrop-blur-xl
                    transition-shadow
                    duration-300
                    hover:border-primary/30
                    hover:shadow-xl
                    sm:min-w-[360px]
                    lg:min-w-[390px]
                  "
                >
                  {/* glow */}
                  <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-primary/20" />

                  {/* large number */}
                  <span className="absolute right-6 top-4 text-7xl font-black tracking-tighter text-primary/[0.04]">
                    {item.number}
                  </span>

                  <div className="relative">
                    {/* top */}
                    <div className="flex items-start justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/20 to-violet-500/10 text-primary shadow-sm">
                        <Icon className="h-6 w-6" />
                      </div>

                      <span className="rounded-full border bg-muted/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {item.label}
                      </span>
                    </div>

                    <div className="mt-12">
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                        Experience {item.number}
                      </p>

                      <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                        {item.title}
                      </h3>

                      <p className="mt-4 min-h-[72px] text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                    </div>

                    {/* divider */}
                    <div className="my-6 h-px bg-gradient-to-r from-primary/40 via-border to-transparent" />

                    {/* bottom action */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        University Portal
                      </span>

                      <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-primary/5 text-primary transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}

            {/* Extra spacing after final card */}
            <div className="min-w-2 shrink-0" />
          </motion.div>
        </div>

        {/* Mobile controls */}
        <div className="mt-4 flex items-center justify-between sm:hidden">
          <p className="text-xs text-muted-foreground">
            Swipe to explore
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Previous experience"
              className="flex h-10 w-10 items-center justify-center rounded-full border bg-background"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Next experience"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}