/**
 * Theme constants shared by the server (no-flash script) and the client hook.
 * Keep this file free of browser-only APIs at module scope.
 */
export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "apex-theme";
export const THEME_OPTIONS: ThemePreference[] = ["light", "dark", "system"];

/**
 * Runs in <head> before first paint so the correct theme class is on <html>
 * immediately — no flash of the wrong theme on load or refresh.
 */
export const themeInitScript = `(function(){try{var p=localStorage.getItem("${THEME_STORAGE_KEY}");var d=p==="dark"||((!p||p==="system")&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light";}catch(e){}})();`;
