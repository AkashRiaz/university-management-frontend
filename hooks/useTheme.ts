"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme";

/*
 * Tiny theme store built on useSyncExternalStore — no context provider needed,
 * every component that calls useTheme() stays in sync, including other tabs.
 * The initial class on <html> is set by `themeInitScript` before hydration.
 */

const DARK_QUERY = "(prefers-color-scheme: dark)";
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((listener) => listener());

function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

function resolve(preference: ThemePreference): ResolvedTheme {
  if (preference !== "system") return preference;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

function applyToDocument(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
}

function applyTheme(preference: ThemePreference, animate: boolean) {
  const resolved = resolve(preference);
  const root = document.documentElement;
  // Notify subscribers *after* the class flips (the animated path is async).
  const update = () => {
    applyToDocument(resolved);
    emit();
  };

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Soft crossfade between themes where the View Transitions API exists.
  if (animate && !prefersReducedMotion && "startViewTransition" in document) {
    root.classList.add("theme-switching");
    const transition = document.startViewTransition(update);
    transition.finished.finally(() => root.classList.remove("theme-switching"));
  } else {
    update();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  const media = window.matchMedia(DARK_QUERY);
  const onSystemChange = () => {
    if (readPreference() === "system") applyTheme("system", false);
    emit();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    applyTheme(readPreference(), false);
    emit();
  };

  media.addEventListener("change", onSystemChange);
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorage);
  };
}

const getResolvedSnapshot = (): ResolvedTheme =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

export function useTheme() {
  const theme = useSyncExternalStore<ThemePreference>(
    subscribe,
    readPreference,
    () => "system",
  );

  const resolvedTheme = useSyncExternalStore<ResolvedTheme | undefined>(
    subscribe,
    getResolvedSnapshot,
    () => undefined,
  );

  const setTheme = useCallback((next: ThemePreference) => {
    try {
      if (next === "system") localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode); the theme still applies.
    }
    applyTheme(next, true);
    emit();
  }, []);

  return { theme, resolvedTheme, setTheme };
}
