import Link from "next/link";
import { ArrowUpRight, Megaphone } from "lucide-react";

const news = [
  "Fall 2027 admissions are now open — apply before March 31",
  "Winter convocation · December 18 · Main Hall",
  "Library extends opening hours during finals week",
  "Research symposium: AI in Education · January 12",
  "Merit scholarship applications close November 30",
  "New Observatory night sessions every Friday",
];

function NewsItems({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center"
    >
      {news.map((item) => (
        <li
          key={item}
          className="flex items-center gap-4 px-6 text-sm whitespace-nowrap text-foreground/80"
        >
          <span className="size-1.5 rotate-45 bg-gold" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/** "Campus news" marquee strip, pauses on hover / focus. */
export default function NewsTicker() {
  return (
    <section aria-label="Campus news" className="relative border-y bg-card">
      <div className="flex items-stretch">
        <div className="relative z-10 flex shrink-0 items-center gap-2 bg-primary px-4 py-3 text-xs font-semibold tracking-[0.16em] text-primary-foreground uppercase sm:px-6">
          <Megaphone className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Campus news</span>
        </div>

        <div className="group relative flex flex-1 overflow-hidden mask-x-from-90% mask-x-to-100%">
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">
            <NewsItems />
            <NewsItems hidden />
          </div>
        </div>

        <Link
          href="/academic-calendar"
          className="hidden shrink-0 items-center gap-1 border-l px-5 text-sm font-semibold text-primary transition hover:bg-muted md:flex"
        >
          Academic calendar
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
