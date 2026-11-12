import PageTransition from "@/components/shared/PageTransition";

// Re-mounts on every navigation inside this segment, which plays the
// standard page-enter animation (see components/shared/PageTransition).
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
