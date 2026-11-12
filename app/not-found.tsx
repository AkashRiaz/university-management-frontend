"use client";

import { ArrowLeft, Home, SearchX } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  return (
    <main
      id="main-content"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12 text-foreground"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-136 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="grid-texture pointer-events-none absolute inset-0 text-primary opacity-[0.04]"
      />

      <section className="relative z-10 mx-auto flex w-full max-w-2xl animate-fade-up flex-col items-center text-center">
        <Link href="/" aria-label="Apex University home">
          <Logo size="sm" />
        </Link>

        <p
          aria-hidden="true"
          className="text-gradient-brand mt-10 font-heading text-[8rem] leading-none font-black tracking-tighter sm:text-[11rem]"
        >
          404
        </p>

        <div className="mt-6 flex size-14 items-center justify-center rounded-full border bg-card text-primary shadow-soft">
          <SearchX className="size-6" strokeWidth={1.8} aria-hidden="true" />
        </div>
        <p className="eyebrow mt-6">Page not found</p>
        <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-5xl">
          We can&apos;t find that page
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
          The link may be broken, or this page may have moved to another place
          in the university portal.
        </p>

        <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/"
            className="group flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:-translate-y-0.5 hover:shadow-lifted"
          >
            <Home className="size-4" aria-hidden="true" />
            Back to home
          </Link>
          <button
            type="button"
            onClick={() => router.back()}
            className="group flex items-center justify-center gap-2 rounded-full border bg-card px-7 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:bg-muted"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            Go back
          </button>
        </div>
      </section>
    </main>
  );
}
