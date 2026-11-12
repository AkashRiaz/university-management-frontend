import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Serif } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeToaster } from "@/components/theme/ThemeToaster";
import { themeInitScript } from "@/lib/theme";

// Body / UI text: clean sans-serif for legibility in forms, tables and dashboards.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Headings: a classic serif for the academic, institutional voice.
const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
});

// Monospace is only used in one place, so don't preload it on every page.
const geistMono = Geist_Mono({
  preload: false,
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Apex University",
    template: "%s | Apex University",
  },
  description:
    "Apex University management portal for students, instructors and administrators.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1424" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The theme class is set by `themeInitScript` before hydration, so the
    // server markup intentionally differs from the client on <html>.
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        geistSans.variable,
        geistMono.variable,
        notoSerif.variable,
      )}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-background font-sans">
        <a
          href="#main-content"
          className="sr-only z-[100] rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to main content
        </a>

        <TooltipProvider>{children}</TooltipProvider>

        <ThemeToaster />
      </body>
    </html>
  );
}
