import Image from "next/image";
import { campusPhotos, type CampusPhotoKey } from "@/lib/campus-photos";

/**
 * Photo backdrop for sub-page banners. Sits behind the banner content.
 *
 * The parent banner is always rendered as a dark section
 * (`dark relative isolate overflow-hidden bg-background text-foreground`):
 * the `dark` class scopes the dark-theme tokens to the banner only, so the
 * photo + navy overlay + light text look identical — and stay readable —
 * whether the site is in light or dark mode (same as the home hero).
 */
export default function BannerPhoto({ photo }: { photo: CampusPhotoKey }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <Image
        src={campusPhotos[photo].src}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-background/75" />
      <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
    </div>
  );
}
