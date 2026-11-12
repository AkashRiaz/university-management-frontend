"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  Library,
  Trophy,
  Users,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const CampusScene = dynamic(() => import("./CampusScene"), {
  ssr: false,
});

type CampusItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  label: string;
};

const campusItems: CampusItem[] = [
  {
    title: "Student Clubs",
    description:
      "Meet students with shared interests and build leadership, teamwork and lasting friendships.",
    icon: Users,
    label: "Community",
  },
  {
    title: "Campus Events",
    description:
      "Join workshops, cultural programs, seminars, competitions and university celebrations.",
    icon: CalendarDays,
    label: "Events",
  },
  {
    title: "Library & Study",
    description:
      "Access quiet study areas, academic resources and collaborative learning environments.",
    icon: Library,
    label: "Learning",
  },
  {
    title: "Sports & Activities",
    description:
      "Stay active with sports, tournaments, recreation and student-led activities.",
    icon: Trophy,
    label: "Activities",
  },
];

export default function CampusPreview() {
  return (
    <section className="relative isolate overflow-hidden border-y section-y">
      {/* Base */}
      <div className="absolute inset-0 bg-background" />

      {/* 3D */}
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <CampusScene />
      </div>

      {/* Dark/readability overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/35" />

      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "70px 70px",
        }}
      />

      {/* Glow */}
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-gold/10 blur-3xl" />

      <div className="page-container relative z-10">
        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="eyebrow-pill mb-5 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Campus Life
            </div>

            <h2 className="section-title max-w-xl">
              University life is
              <span className="block text-gradient-brand">
                more than classes
              </span>
            </h2>

            <p className="section-lead mt-5 max-w-xl">
              Experience a vibrant campus where learning, friendships,
              creativity, leadership and personal growth come together.
            </p>

            <Link
              href="/campus-life"
              className="group mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 font-medium text-primary-foreground shadow-lifted transition hover:-translate-y-0.5"
            >
              Explore Campus Life
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          {/* Cards */}
          <div className="relative">
            <div className="grid gap-5 sm:grid-cols-2">
              {campusItems.map((item, index) => {
                const Icon = item.icon;

                const offsets = [
                  "sm:-translate-y-6",
                  "sm:translate-y-8",
                  "sm:-translate-y-2",
                  "sm:translate-y-12",
                ];

                return (
                  <motion.div
                    key={item.title}
                    initial={{
                      opacity: 0,
                      y: 40,
                      scale: 0.96,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.55,
                      delay: index * 0.1,
                    }}
                    whileHover={{
                      y: -8,
                      rotateX: 2,
                      rotateY: index % 2 === 0 ? 2 : -2,
                    }}
                    className={`
                      group
                      relative
                      overflow-hidden
                      rounded-[28px]
                      border
                      border-border
                      bg-card/70
                      p-6
                      shadow-soft
                      backdrop-blur-xl
                      ${offsets[index]}
                    `}
                  >
                    {/* glow inside card */}
                    <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl transition duration-500 group-hover:bg-gold/15" />

                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>

                        <span className="rounded-full border bg-muted/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          {item.label}
                        </span>
                      </div>

                      <div className="mt-10">
                        <h3 className="text-xl font-semibold">{item.title}</h3>

                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                          {item.description}
                        </p>
                      </div>

                      <div className="my-6 h-px bg-linear-to-r from-gold/50 via-border to-transparent" />

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Student Experience
                        </span>

                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                          <ArrowUpRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
