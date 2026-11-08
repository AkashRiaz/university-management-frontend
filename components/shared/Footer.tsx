import Link from "next/link";
import { ArrowUpRight, GraduationCap, Mail, MapPin, Phone } from "lucide-react";

const exploreLinks = [
  { label: "About Us", href: "/about" },
  { label: "Campus Life", href: "/campus-life" },
  { label: "Programs", href: "/programs" },
  { label: "Contact", href: "/contact" },
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t bg-background">
      {/* subtle background glow */}
      <div className="pointer-events-none absolute -left-32 top-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-64 w-64 rounded-full bg-violet-500/5 blur-3xl" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "70px 70px",
        }}
      />

      <div className="container relative mx-auto px-4">
        {/* main footer */}
        <div className="grid gap-8 py-10 md:grid-cols-3 md:py-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
                <GraduationCap className="h-5 w-5" />
              </div>

              <div>
                <p className="font-semibold">University</p>

                <p className="text-xs text-muted-foreground">
                  Management System
                </p>
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              A connected platform for students, academics, campus life, and
              university services.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold">Explore</h3>

            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}

                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold">Contact</h3>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />

                <span>University Campus</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0 text-primary" />

                <span>info@university.edu</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0 text-primary" />

                <span>+880 1234-567890</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-2 border-t py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} University Management System.</p>

          <div className="flex gap-4">
            <Link
              href="/privacy-policy"
              className="transition hover:text-primary"
            >
              Privacy
            </Link>

            <Link href="/terms" className="transition hover:text-primary">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
