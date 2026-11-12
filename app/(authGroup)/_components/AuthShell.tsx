import Link from "next/link";
import type { ReactNode } from "react";
import Image from "next/image";
import { BookOpenCheck, ShieldCheck, Users } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { campusPhotos } from "@/lib/campus-photos";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

type AuthShellProps = {
  /** Short label above the panel heading, e.g. "Student portal". */
  eyebrow: string;
  /** Large statement shown in the branded side panel. */
  heading: string;
  /** Supporting copy under the heading. */
  description: string;
  children: ReactNode;
};

const highlights = [
  { icon: BookOpenCheck, label: "Courses, grades & schedules in one place" },
  { icon: Users, label: "Built for students, instructors and staff" },
  { icon: ShieldCheck, label: "Secure, verified university accounts" },
];

/**
 * Shared layout for every authentication screen.
 * Desktop: branded panel (left) + form (right). Mobile: form only, full width.
 */
export default function AuthShell({
  eyebrow,
  heading,
  description,
  children,
}: AuthShellProps) {
  return (
    <main
      id="main-content"
      className="grid min-h-dvh bg-background lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]"
    >
      {/* Branded panel */}
      <aside className="hero-surface relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        {/* Campus photo under a navy overlay keeps the copy readable */}
        <Image
          src={campusPhotos.studentsCampus.src}
          alt=""
          fill
          priority
          placeholder="blur"
          sizes="(min-width: 1024px) 50vw, 0px"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-hero via-hero/85 to-hero/55"
        />

        <Link href="/" aria-label="Apex University home" className="relative w-fit">
          <Logo />
        </Link>

        <div className="relative max-w-lg animate-fade-up">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-4 font-heading text-4xl leading-tight font-bold xl:text-5xl">
            {heading}
          </h1>
          <p className="mt-5 text-base leading-7 text-hero-muted">{description}</p>

          <ul className="mt-10 space-y-4">
            {highlights.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-hero-foreground/90">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-hero-foreground/10">
                  <Icon className="size-4 text-gold" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-hero-muted">
          © {new Date().getFullYear()} Apex University · Management System
        </p>
      </aside>

      {/* Form column */}
      <section className="relative flex flex-col px-4 py-6 sm:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Apex University home" className="lg:invisible">
            <Logo size="sm" />
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md animate-fade-up">{children}</div>
        </div>
      </section>
    </main>
  );
}
