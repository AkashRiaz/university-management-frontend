"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, BadgeCheck, CalendarDays, Globe2 } from "lucide-react";
import { campusPhotos } from "@/lib/campus-photos";

const highlights = [
  { icon: BadgeCheck, label: "Fully accredited" },
  { icon: Globe2, label: "Students from 40+ countries" },
  { icon: CalendarDays, label: "Fall 2027 intake open" },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion() ?? false;

  // 0 → 1 while the hero scrolls out of view.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const still = (value: number) => (reduceMotion ? 0 : value);
  // Background building drifts slowest; collage photos at different speeds.
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, still(180)]);
  const backPhotoY = useTransform(scrollYProgress, [0, 1], [0, still(-60)]);
  const frontPhotoY = useTransform(scrollYProgress, [0, 1], [0, still(-140)]);
  const badgeY = useTransform(scrollYProgress, [0, 1], [0, still(-220)]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, still(120)]);
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.75],
    [1, reduceMotion ? 1 : 0],
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className="hero-surface relative isolate flex min-h-[max(640px,calc(100svh-5rem))] items-center overflow-hidden"
    >
      {/* ---------------------------------------- Campus photo (parallax) */}
      <motion.div
        aria-hidden="true"
        style={{ y: backgroundY }}
        className="absolute -inset-y-24 inset-x-0 -z-20"
      >
        <Image
          src={campusPhotos.campusMain.src}
          alt=""
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-[center_45%]"
        />
      </motion.div>

      {/* readability overlays */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-hero via-hero/85 to-hero/35"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-t from-hero to-transparent"
      />

      <div className="page-container relative grid items-center gap-14 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        {/* ---------------------------------------- Copy */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="max-w-2xl animate-fade-up"
        >
          <p className="eyebrow-pill backdrop-blur">Est. 1924 · Lux et Scientia</p>

          <h1
            id="hero-heading"
            className="mt-6 font-heading text-4xl leading-[1.06] font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Where curious minds become{" "}
            <em className="text-gold italic">tomorrow&apos;s leaders.</em>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-hero-muted md:text-lg">
            Join a historic campus with a modern heart — and manage every
            course, class and payment from one connected university portal.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admissions"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gold px-6 font-semibold text-gold-foreground shadow-lifted transition hover:-translate-y-0.5 hover:bg-gold/90"
            >
              Apply for Fall 2027
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-hero-foreground/25 bg-hero-foreground/10 px-6 font-semibold backdrop-blur transition hover:-translate-y-0.5 hover:bg-hero-foreground/15"
            >
              Student &amp; Staff Portal
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-hero-foreground/85">
            {highlights.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="size-4 text-gold" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* ---------------------------------------- Photo collage */}
        <div className="relative hidden h-[480px] lg:block">
          <motion.figure
            style={{ y: backPhotoY }}
            className="absolute top-0 right-0 w-[78%] overflow-hidden rounded-3xl border border-hero-foreground/15 shadow-lifted"
          >
            <Image
              src={campusPhotos.studentsLibrary.src}
              alt={campusPhotos.studentsLibrary.alt}
              placeholder="blur"
              sizes="(min-width: 1024px) 380px, 0px"
              className="aspect-[4/3] w-full object-cover"
            />
          </motion.figure>

          <motion.figure
            style={{ y: frontPhotoY }}
            className="absolute bottom-0 left-0 w-[58%] overflow-hidden rounded-3xl border-4 border-hero shadow-lifted"
          >
            <Image
              src={campusPhotos.graduation.src}
              alt={campusPhotos.graduation.alt}
              placeholder="blur"
              sizes="(min-width: 1024px) 300px, 0px"
              className="aspect-[4/3] w-full object-cover"
            />
          </motion.figure>

          <motion.div
            style={{ y: badgeY }}
            className="absolute right-4 bottom-16 rounded-2xl border border-hero-foreground/15 bg-hero/80 px-5 py-4 shadow-lifted backdrop-blur-md"
          >
            <p className="font-heading text-3xl font-bold text-gold">94%</p>
            <p className="mt-1 text-xs text-hero-muted">
              graduates employed
              <br />
              within six months
            </p>
          </motion.div>
        </div>
      </div>

      {/* scroll cue */}
      <div
        aria-hidden="true"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-hero-muted uppercase md:flex"
      >
        <span className="flex h-9 w-5.5 justify-center rounded-full border-2 border-hero-foreground/40 pt-1.5">
          <span className="h-2 w-1 animate-scroll-cue rounded-full bg-gold" />
        </span>
        Scroll to explore
      </div>
    </section>
  );
}
