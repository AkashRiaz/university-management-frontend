import { ViewTransition, type ReactNode } from "react";

/**
 * Standard route-change animation for the whole app.
 *
 * Used from `template.tsx` files: a template re-mounts on every navigation,
 * so this boundary "exits" with the old page and "enters" with the new one.
 * Next.js runs navigations inside a React transition, which activates the
 * browser View Transitions API. Styling lives in globals.css (`.page`).
 *
 * - Unsupported browsers simply swap pages without animation.
 * - `prefers-reduced-motion` disables the animation (see globals.css).
 * - `default="none"` keeps unrelated updates (search, refresh) still.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      {children}
    </ViewTransition>
  );
}
