import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import ClockHands from "./ClockHands";

/*
 * Illustrated campus skyline, split into depth layers so each can move at
 * its own speed (parallax). Every layer shares the same 1440×560 viewBox and
 * is anchored bottom-right, so they always line up.
 *
 * Colours come from CSS tokens (--scene-*, see globals.css):
 * light theme = campus at dawn, dark theme = campus at night.
 */

const VIEWBOX = "0 0 1440 560";

function Layer({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox={VIEWBOX}
      preserveAspectRatio="xMaxYMax slice"
      aria-hidden="true"
      focusable="false"
      className={cn("absolute inset-0 size-full", className)}
    >
      {children}
    </svg>
  );
}

/* ---------------------------------------------------------------- Sky ---- */

// Deterministic pseudo-random stars: identical on server and client.
const STARS = Array.from({ length: 46 }, (_, index) => {
  const seed = (index * 9301 + 49297) % 233280;
  const random = seed / 233280;
  const seed2 = (seed * 9301 + 49297) % 233280;
  return {
    x: Math.round(((index * 137.5) % 1440) + random * 24),
    y: Math.round((seed2 / 233280) * 300 + 10),
    r: random > 0.8 ? 1.6 : random > 0.45 ? 1.1 : 0.7,
    delay: `${(random * 3).toFixed(2)}s`,
  };
});

export function SkyDetails() {
  return (
    <Layer>
      {/* Stars (night only) */}
      <g className="scene-stars" fill="var(--scene-window)">
        {STARS.map((star, index) => (
          <circle
            key={index}
            className="scene-star"
            cx={star.x}
            cy={star.y}
            r={star.r}
            style={{ animationDelay: star.delay }}
          />
        ))}
      </g>

      {/* Birds (dawn only) */}
      <g
        className="scene-day-only"
        fill="none"
        stroke="var(--scene-near)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      >
        <path d="M1150 190 q8 -8 16 0 q8 -8 16 0" />
        <path d="M1190 168 q6 -6 12 0 q6 -6 12 0" />
        <path d="M1124 160 q5 -5 10 0 q5 -5 10 0" />
      </g>
    </Layer>
  );
}

/* --------------------------------------------------------- Far hills ---- */

export function FarHills() {
  return (
    <Layer>
      <path
        fill="var(--scene-far)"
        d="M0 390 C160 340 300 360 440 350 C600 338 720 312 880 330 C1040 348 1180 318 1300 308 C1370 302 1410 312 1440 318 L1440 560 L0 560 Z"
      />
    </Layer>
  );
}

/* --------------------------------------------- Distant campus skyline ---- */

export function DistantCampus() {
  return (
    <Layer>
      <g fill="var(--scene-mid)">
        {/* left */}
        <rect x="20" y="410" width="110" height="150" />
        <rect x="150" y="360" width="28" height="200" />
        <polygon points="150,360 164,312 178,360" />
        <rect x="230" y="420" width="140" height="140" />
        <path d="M245 420 A55 55 0 0 1 355 420 Z" />
        <rect x="296" y="352" width="8" height="16" />
        {/* middle */}
        <rect x="480" y="420" width="120" height="140" />
        <polygon points="474,420 540,392 606,420" />
        <rect x="610" y="404" width="80" height="156" />
        {/* right */}
        <rect x="1080" y="330" width="110" height="230" />
        <rect x="1250" y="300" width="36" height="260" />
        <polygon points="1250,300 1268,236 1286,300" />
        <rect x="1300" y="360" width="140" height="200" />
      </g>

      {/* faint lit windows in the distance */}
      <g fill="var(--scene-window)" fillOpacity="0.4" className="scene-stars">
        {[0, 1, 2].map((index) => (
          <rect
            key={`l${index}`}
            x={36 + index * 30}
            y="436"
            width="8"
            height="12"
          />
        ))}
        {[0, 1, 2, 3].map((index) => (
          <rect
            key={`r${index}`}
            x={1316 + index * 30}
            y="384"
            width="8"
            height="12"
          />
        ))}
        <rect x="1100" y="352" width="8" height="12" />
        <rect x="1130" y="352" width="8" height="12" />
      </g>
    </Layer>
  );
}

/* ------------------------------------------------ Main campus buildings ---- */

const HALL_WINDOWS = Array.from({ length: 8 }, (_, index) => 545 + index * 46);
const WING_WINDOWS = [0, 1, 2];

export function MainCampus() {
  return (
    <Layer>
      {/* Greek-revival library (left) */}
      <g transform="translate(-70 0)">
        <rect
          x="180"
          y="450"
          width="190"
          height="110"
          fill="var(--scene-near)"
        />
        <polygon points="172,450 275,408 378,450" fill="var(--scene-near)" />
        <polygon points="196,444 275,414 354,444" fill="var(--scene-shade)" />
        <rect
          x="176"
          y="448"
          width="198"
          height="8"
          fill="var(--scene-shade)"
        />
        <g fill="var(--scene-shade)">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <rect
              key={index}
              x={192 + index * 30}
              y="460"
              width="10"
              height="90"
            />
          ))}
        </g>
      </g>

      {/* Observatory (left-centre) */}
      <g transform="translate(-680 0)">
        <rect
          x="1120"
          y="470"
          width="140"
          height="90"
          fill="var(--scene-near)"
        />
        <path d="M1130 470 A60 60 0 0 1 1250 470 Z" fill="var(--scene-near)" />
        <rect
          x="1185"
          y="418"
          width="10"
          height="44"
          fill="var(--scene-window)"
          className="scene-windows"
        />
      </g>

      {/* Main hall with clock tower (right) */}
      <g transform="translate(300 0)">
        {/* wings */}
        <rect
          x="380"
          y="420"
          width="150"
          height="140"
          fill="var(--scene-near)"
        />
        <polygon points="372,420 455,384 538,420" fill="var(--scene-near)" />
        <rect
          x="910"
          y="420"
          width="150"
          height="140"
          fill="var(--scene-near)"
        />
        <polygon points="902,420 985,384 1068,420" fill="var(--scene-near)" />

        {/* main body + roof */}
        <rect
          x="520"
          y="380"
          width="400"
          height="180"
          fill="var(--scene-near)"
        />
        <polygon points="510,382 720,322 930,382" fill="var(--scene-shade)" />

        {/* windows */}
        <g fill="var(--scene-window)" className="scene-windows">
          {HALL_WINDOWS.map((x) => (
            <rect key={`a${x}`} x={x} y="398" width="22" height="38" rx="11" />
          ))}
          {HALL_WINDOWS.map((x) => (
            <rect key={`b${x}`} x={x} y="452" width="22" height="32" rx="11" />
          ))}
          {WING_WINDOWS.map((index) => (
            <rect
              key={`l${index}`}
              x={402 + index * 42}
              y="442"
              width="18"
              height="34"
              rx="9"
            />
          ))}
          {WING_WINDOWS.map((index) => (
            <rect
              key={`r${index}`}
              x={932 + index * 42}
              y="442"
              width="18"
              height="34"
              rx="9"
            />
          ))}
        </g>

        {/* clock tower */}
        <rect
          x="680"
          y="200"
          width="80"
          height="190"
          fill="var(--scene-near)"
        />
        <rect
          x="672"
          y="190"
          width="96"
          height="14"
          fill="var(--scene-shade)"
        />
        <polygon points="680,192 720,88 760,192" fill="var(--scene-near)" />
        <polygon points="670,192 677,160 684,192" fill="var(--scene-near)" />
        <polygon points="756,192 763,160 770,192" fill="var(--scene-near)" />
        <line
          x1="720"
          y1="88"
          x2="720"
          y2="66"
          stroke="var(--scene-near)"
          strokeWidth="3"
        />
        <circle cx="720" cy="64" r="4" fill="var(--scene-window)" />

        {/* belfry + entrance */}
        <rect
          x="706"
          y="292"
          width="28"
          height="52"
          rx="14"
          fill="var(--scene-window)"
          className="scene-windows"
        />
        <rect
          x="700"
          y="452"
          width="40"
          height="58"
          rx="20"
          fill="var(--scene-shade)"
        />

        {/* clock face showing the visitor's local time */}
        <circle
          cx="720"
          cy="245"
          r="24"
          fill="var(--scene-window)"
          className="scene-windows"
        />
        <circle
          cx="720"
          cy="245"
          r="24"
          fill="none"
          stroke="var(--scene-shade)"
          strokeWidth="3"
        />
        <g stroke="var(--scene-shade)" strokeWidth="2">
          {[0, 90, 180, 270].map((angle) => (
            <line
              key={angle}
              x1="720"
              y1="225"
              x2="720"
              y2="229"
              transform={`rotate(${angle} 720 245)`}
            />
          ))}
        </g>
        <ClockHands cx={720} cy={245} />
      </g>
    </Layer>
  );
}

/* --------------------------------------------------------- Foreground ---- */

const TREES = [
  { x: 28, s: 1.15 },
  { x: 92, s: 0.9 },
  { x: 372, s: 1 },
  { x: 410, s: 0.75 },
  { x: 610, s: 0.95 },
  { x: 655, s: 1.2 },
  { x: 1392, s: 1.1 },
  { x: 1432, s: 0.85 },
];

const LAMPS = [900, 1140];

export function Foreground({
  ground = "var(--background)",
}: {
  ground?: string;
}) {
  return (
    <Layer>
      {/* lamp posts */}
      {LAMPS.map((x) => (
        <g key={x}>
          <circle
            cx={x}
            cy="458"
            r="22"
            fill="var(--scene-lamp)"
            fillOpacity="0.22"
            className="scene-lamp-glow"
          />
          <rect
            x={x - 2}
            y="462"
            width="4"
            height="52"
            fill="var(--scene-shade)"
          />
          <circle cx={x} cy="460" r="5" fill="var(--scene-lamp)" />
        </g>
      ))}

      {/* trees */}
      <g fill="var(--scene-tree)">
        {TREES.map(({ x, s }) => (
          <g key={x} transform={`translate(${x} 0)`}>
            <rect x="-3" y={505 - 46 * s} width="6" height={46 * s} />
            <circle cx="0" cy={505 - 58 * s} r={24 * s} />
            <circle cx={-16 * s} cy={505 - 42 * s} r={18 * s} />
            <circle cx={16 * s} cy={505 - 44 * s} r={19 * s} />
          </g>
        ))}
      </g>

      {/* ground blends seamlessly into the next section */}
      <path
        fill={ground}
        d="M0 515 C240 498 480 528 720 512 C960 498 1200 526 1440 508 L1440 560 L0 560 Z"
      />
    </Layer>
  );
}
