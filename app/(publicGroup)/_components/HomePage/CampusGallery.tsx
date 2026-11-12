import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Parallax } from "@/components/shared/Parallax";
import { campusPhotos, type CampusPhotoKey } from "@/lib/campus-photos";
import { cn } from "@/lib/utils";

type Tile = {
  photo: CampusPhotoKey;
  label: string;
  title: string;
  className: string;
};

// Two columns that drift at different speeds give the grid depth.
const COLUMNS: { distance: number; tiles: Tile[] }[] = [
  {
    distance: 18,
    tiles: [
      {
        photo: "studentsWalking",
        label: "Student life",
        title: "A campus that never stands still",
        className: "aspect-[4/5]",
      },
      {
        photo: "researchLab",
        label: "Research",
        title: "Hands-on labs from year one",
        className: "aspect-[4/3]",
      },
    ],
  },
  {
    distance: 48,
    tiles: [
      {
        photo: "libraryHall",
        label: "Academics",
        title: "Libraries built for deep work",
        className: "aspect-[4/3]",
      },
      {
        photo: "studentsCampus",
        label: "Community",
        title: "Friendships that last a lifetime",
        className: "aspect-[4/5]",
      },
    ],
  },
];

function PhotoTile({ photo, label, title, className }: Tile) {
  const image = campusPhotos[photo];

  return (
    <figure
      className={cn(
        "group relative overflow-hidden rounded-3xl border bg-muted shadow-soft",
        className,
      )}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        placeholder="blur"
        sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-hero/90 via-hero/20 to-transparent"
      />
      <figcaption className="on-hero absolute inset-x-0 bottom-0 p-5 text-hero-foreground">
        <span className="text-[11px] font-semibold tracking-[0.18em] text-gold uppercase">
          {label}
        </span>
        <span className="mt-1 block font-heading text-lg leading-snug font-semibold">
          {title}
        </span>
      </figcaption>
    </figure>
  );
}

/** "Life at Apex" photo section with layered parallax columns. */
export default function CampusGallery() {
  return (
    <section aria-labelledby="gallery-heading" className="section-y overflow-hidden">
      <div className="page-container grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-32">
          <p className="eyebrow">Life at Apex</p>
          <h2 id="gallery-heading" className="section-title mt-3">
            Learn, discover and belong
          </h2>
          <p className="section-lead mt-5">
            From candle-lit reading rooms to modern research labs, our campus is
            where ideas turn into friendships, projects and careers.
          </p>
          <Link
            href="/campus-life"
            className="group mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground shadow-soft transition hover:-translate-y-0.5 hover:shadow-lifted"
          >
            Explore campus life
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {COLUMNS.map((column, index) => (
            <Parallax
              key={index}
              distance={column.distance}
              className={cn("grid gap-5", index === 1 && "sm:mt-16")}
            >
              {column.tiles.map((tile) => (
                <PhotoTile key={tile.photo} {...tile} />
              ))}
            </Parallax>
          ))}
        </div>
      </div>
    </section>
  );
}
