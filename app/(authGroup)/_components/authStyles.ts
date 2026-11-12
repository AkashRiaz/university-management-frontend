/**
 * Shared class names for every auth form (login, student/instructor verify).
 * One source of truth keeps the three screens visually identical and makes
 * the light/dark theme work through semantic tokens only.
 */
export const authStyles = {
  header: "mb-8 space-y-2",
  title: "font-heading text-3xl font-bold tracking-tight text-foreground",
  subtitle: "text-sm leading-relaxed text-muted-foreground",

  field: "space-y-2",
  label: "text-sm font-medium text-foreground",
  inputWrapper: "relative",
  input:
    "h-12 w-full rounded-xl border border-input bg-card px-4 text-sm text-foreground shadow-xs transition placeholder:text-muted-foreground/80 focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20",
  inputIcon:
    "pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground",
  error: "flex items-center gap-1 text-xs font-medium text-destructive",

  otpGroup: "flex justify-between gap-2 pt-1",
  otpBox:
    "h-13 w-full max-w-12 rounded-xl border border-input bg-card text-center font-mono text-xl font-semibold text-foreground shadow-xs transition focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/25 disabled:opacity-50",

  primaryButton:
    "mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground shadow-soft transition hover:bg-primary/90 hover:shadow-lifted active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60",
  socialButton:
    "inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border bg-card text-sm font-medium text-foreground shadow-xs transition hover:bg-muted disabled:opacity-50",
  textButton:
    "inline-flex items-center gap-1 text-xs font-medium text-primary transition hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline",

  divider: "relative my-6 flex items-center justify-center",
  dividerLine: "w-full border-t",
  dividerText:
    "absolute bg-background px-3 text-xs font-medium tracking-wide text-muted-foreground uppercase",

  footnote:
    "mt-8 flex items-center justify-center gap-2 rounded-xl border bg-muted/40 px-4 py-3 text-xs font-medium text-muted-foreground",
} as const;
