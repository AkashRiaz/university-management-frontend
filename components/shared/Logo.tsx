import { cn } from "@/lib/utils";

/**
 * Apex University brand — the ONLY logo used across the app.
 *
 * - <BrandMark />  the shield emblem on its own (favicon-style, loaders, small spaces)
 * - <Logo />       emblem + "Apex University" wordmark (navbar, sidebar, footer, auth)
 *
 * The mark is coloured with theme tokens, so it adapts to light/dark and to
 * always-dark surfaces (`.hero-surface`). The same artwork lives in app/icon.svg.
 */
export function BrandMark({
  className,
  title,
}: {
  className?: string;
  /** Accessible name; omit when the mark sits next to visible brand text. */
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 72"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={cn("h-10 w-auto shrink-0", className)}
    >
      {/* shield */}
      <path
        d="M32 2 L60 11 V35 C60 53 48 64 32 70 C16 64 4 53 4 35 V11 Z"
        fill="var(--primary)"
        stroke="var(--gold)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* star */}
      <path
        d="M32 12 l2.6 5.6 6.1 .6 -4.6 4.1 1.3 6 -5.4 -3.1 -5.4 3.1 1.3 -6 -4.6 -4.1 6.1 -.6 Z"
        fill="var(--gold)"
      />
      {/* open book */}
      <path
        d="M14 34 C20 30.5 26.5 31 32 35 V54 C26.5 50 20 49.5 14 53 Z"
        fill="var(--primary-foreground)"
      />
      <path
        d="M50 34 C44 30.5 37.5 31 32 35 V54 C37.5 50 44 49.5 50 53 Z"
        fill="var(--primary-foreground)"
        opacity="0.85"
      />
    </svg>
  );
}

const SIZES = {
  sm: { mark: "h-9", name: "text-base", sub: "text-[10px]" },
  md: { mark: "h-11", name: "text-xl", sub: "text-[11px]" },
  lg: { mark: "h-14", name: "text-2xl", sub: "text-xs" },
} as const;

export function Logo({
  size = "md",
  subtitle = "Est. 1924",
  className,
  showWordmark = true,
  wordmarkClassName,
}: {
  size?: keyof typeof SIZES;
  subtitle?: string | null;
  className?: string;
  showWordmark?: boolean;
  /** e.g. "hidden sm:block" to show only the emblem on very small screens */
  wordmarkClassName?: string;
}) {
  const s = SIZES[size];

  return (
    <span className={cn("flex min-w-0 items-center gap-3", className)}>
      <BrandMark
        className={cn(s.mark, "drop-shadow-sm")}
        title={showWordmark ? undefined : "Apex University"}
      />
      {showWordmark && (
        <span className={cn("min-w-0 leading-tight", wordmarkClassName)}>
          <span
            className={cn(
              "block truncate font-heading font-bold tracking-tight whitespace-nowrap",
              s.name,
            )}
          >
            Apex University
          </span>
          {subtitle && (
            <span
              className={cn(
                "mt-0.5 block truncate font-semibold tracking-[0.18em] text-gold uppercase",
                s.sub,
              )}
            >
              {subtitle}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
