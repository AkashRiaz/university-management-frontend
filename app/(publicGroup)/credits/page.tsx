import type { Metadata } from "next";
import Image from "next/image";
import { campusPhotos } from "@/lib/campus-photos";

export const metadata: Metadata = {
  title: "Photo credits",
  description: "Attribution and licences for the photographs used on this site.",
};

const photos = Object.values(campusPhotos);

export default function CreditsPage() {
  return (
    <main className="page-container section-y">
      <p className="eyebrow">Attribution</p>
      <h1 className="display-title mt-3">Photo credits</h1>
      <p className="section-lead mt-5 max-w-2xl">
        The photographs on this site come from Wikimedia Commons and are used
        under the licences listed below. Thank you to every photographer.
      </p>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <li key={photo.source} className="surface overflow-hidden">
            <div className="relative aspect-[16/10] bg-muted">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-1 p-5 text-sm">
              <p className="font-semibold">{photo.alt}</p>
              <p className="text-muted-foreground">
                By {photo.author} ·{" "}
                {photo.licenseUrl ? (
                  <a
                    href={photo.licenseUrl}
                    target="_blank"
                    rel="noopener noreferrer license"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {photo.license}
                  </a>
                ) : (
                  photo.license
                )}
              </p>
              <a
                href={photo.source}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-primary underline-offset-4 hover:underline"
              >
                View original on Wikimedia Commons
              </a>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
