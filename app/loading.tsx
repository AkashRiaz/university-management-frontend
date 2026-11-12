import { BrandMark } from "@/components/shared/Logo";

export default function Loading() {
  return (
    <main
      role="status"
      aria-live="polite"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12 text-foreground"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-120 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="grid-texture pointer-events-none absolute inset-0 text-primary opacity-[0.04]"
      />

      <section className="relative z-10 flex w-full max-w-xl animate-fade-in flex-col items-center text-center">
        <div className="relative flex size-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-primary/15" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary border-r-gold [animation-duration:1.1s]" />
          <BrandMark className="h-12" />
        </div>

        <p className="eyebrow mt-10">Apex University</p>
        <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Preparing your portal
        </h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
          We&apos;re getting everything ready for you. This will only take a
          moment.
        </p>

        <div className="mt-8 h-1.5 w-48 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-2/5 animate-pulse rounded-full bg-linear-to-r from-primary to-gold" />
        </div>
      </section>
    </main>
  );
}
