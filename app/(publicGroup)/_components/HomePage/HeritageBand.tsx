"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";
import { campusPhotos } from "@/lib/campus-photos";

const VALUES = ["Knowledge", "Integrity", "Discovery", "Service", "Excellence"];
const ROW = Array.from({ length: 3 }, () => VALUES).flat();

const milestones = [
  { year: "1924", label: "Founded as Apex College" },
  { year: "1968", label: "University research charter" },
  { year: "2001", label: "Digital library opens" },
  { year: "2026", label: "Connected campus portal" },
];

/**
 * Heritage section: two rows of giant serif words slide in opposite
 * directions as you scroll, framing the founders' motto and a timeline.
 */
export default function HeritageBand() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const still = reduceMotion ? ["-10%", "-10%"] : null;
  const rowA = useTransform(scrollYProgress, [0, 1], still ?? ["0%", "-22%"]);
  const rowB = useTransform(scrollYProgress, [0, 1], still ?? ["-22%", "0%"]);
  const cardY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [60, -60],
  );
  // The photo drifts inside its frame (classic image parallax).
  const photoY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ["0%", "0%"] : ["-8%", "8%"],
  );

  return (
    <section
      ref={ref}
      aria-labelledby="heritage-heading"
      className="relative overflow-hidden section-y"
    >
      {/* giant scrolling words (decorative) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 space-y-2 select-none"
      >
        <motion.p
          style={{ x: rowA }}
          className="text-outline font-heading text-[clamp(3.5rem,11vw,9.5rem)] leading-none font-bold whitespace-nowrap"
        >
          {ROW.map((word, index) => (
            <span key={index} className="px-6">
              {word} ·
            </span>
          ))}
        </motion.p>
        <motion.p
          style={{ x: rowB }}
          className="font-heading text-[clamp(3.5rem,11vw,9.5rem)] leading-none font-bold whitespace-nowrap text-primary/[0.07] italic"
        >
          {ROW.map((word, index) => (
            <span key={index} className="px-6">
              {word} ·
            </span>
          ))}
        </motion.p>
      </div>

      <div className="page-container relative">
        <motion.div
          style={{ y: cardY }}
          className="surface mx-auto max-w-4xl overflow-hidden bg-card/90 backdrop-blur-md"
        >
          <div className="grid md:grid-cols-[1fr_1.1fr]">
            {/* motto */}
            <div className="hero-surface relative flex min-h-80 flex-col justify-end overflow-hidden p-8">
              <motion.div
                aria-hidden="true"
                style={{ y: photoY }}
                className="absolute -inset-y-[10%] inset-x-0"
              >
                <Image
                  src={campusPhotos.heritageBuilding.src}
                  alt=""
                  fill
                  placeholder="blur"
                  sizes="(min-width: 768px) 430px, 100vw"
                  className="object-cover"
                />
              </motion.div>
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-hero via-hero/50 to-transparent"
              />
              <div className="relative">
                <p className="font-heading text-2xl italic">
                  &ldquo;Lux et Scientia&rdquo;
                </p>
                <p className="mt-1 text-xs font-semibold tracking-[0.2em] text-gold uppercase">
                  Light &amp; Knowledge · since 1924
                </p>
              </div>
            </div>

            {/* story */}
            <div className="p-8 md:p-10">
              <p className="eyebrow">Our heritage</p>
              <h2
                id="heritage-heading"
                className="mt-3 text-3xl font-bold md:text-4xl"
              >
                A century of lighting the way
              </h2>
              <blockquote className="mt-5 border-l-2 border-gold pl-4 text-muted-foreground">
                <Quote className="mb-2 size-5 text-gold" aria-hidden="true" />
                <p className="leading-7">
                  We built this university so that every curious mind — whatever
                  its origin — could find a lamp to read by and a community to
                  grow with.
                </p>
                <footer className="mt-3 text-sm font-semibold text-foreground">
                  — The Founders, 1924
                </footer>
              </blockquote>

              <ol className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5">
                {milestones.map((milestone) => (
                  <li key={milestone.year} className="border-t pt-3">
                    <p className="font-heading text-2xl font-bold text-primary">
                      {milestone.year}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {milestone.label}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
