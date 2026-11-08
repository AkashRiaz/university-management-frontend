"use client";

import { ArrowUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";

interface DashboardMainContentProps {
  children: ReactNode;
}

const SHOW_BACK_TO_TOP_AFTER = 600; // px

const DashboardMainContent = ({ children }: DashboardMainContentProps) => {
  const pathname = usePathname();

  const mainReference = useRef<HTMLElement | null>(null);

  // Mutable values that must NOT trigger renders live in refs:
  // the latest scroll offset and the pending animation-frame id.
  const scrollTopRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  // The only piece of React state: flips at most twice per long scroll,
  // instead of re-rendering on every one of the ~60+ scroll events per second.
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    mainReference.current?.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  useEffect(() => {
    const element = mainReference.current;
    if (!element) return;

    const onScroll = () => {
      scrollTopRef.current = element.scrollTop;
      // requestAnimationFrame throttling: at most one update per painted frame.
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        const shouldShow = scrollTopRef.current > SHOW_BACK_TO_TOP_AFTER;
        // Bail-out: React skips the render when the value is unchanged.
        setShowBackToTop(shouldShow);
      });
    };

    element.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      element.removeEventListener("scroll", onScroll);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <main
      ref={mainReference}
      className="relative min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-background"
    >
      {children}

      <button
        type="button"
        aria-label="Back to top"
        tabIndex={showBackToTop ? 0 : -1}
        onClick={() =>
          mainReference.current?.scrollTo({ top: 0, behavior: "smooth" })
        }
        className={`fixed right-5 bottom-5 z-30 flex size-10 items-center justify-center rounded-full border bg-background text-foreground shadow-md transition-all duration-200 hover:bg-muted ${
          showBackToTop
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <ArrowUp className="size-4" />
      </button>
    </main>
  );
};

export default DashboardMainContent;
