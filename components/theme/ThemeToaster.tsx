"use client";

import { Toaster } from "sonner";
import { useTheme } from "@/hooks/useTheme";

/** Sonner toaster that follows the app theme instead of only the OS setting. */
export function ThemeToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      theme={resolvedTheme ?? "system"}
      toastOptions={{ className: "font-sans" }}
    />
  );
}
