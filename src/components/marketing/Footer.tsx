import Link from "next/link";
import Image from "next/image";
import { Globe, Link2, Mail } from "lucide-react";

const columns = [
  {
    title: "Learn",
    links: [
      { href: "/courses", label: "All Courses" },
      { href: "/#instructors", label: "Instructors" },
      { href: "/login", label: "Student Login" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#founder", label: "About" },
      { href: "/#testimonials", label: "Reviews" },
      { href: "/courses", label: "Pricing" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/", label: "Help Center" },
      { href: "/", label: "Contact Us" },
      { href: "/", label: "Terms & Privacy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-neutral-200/70 bg-neutral-950 text-neutral-300">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <div className="inline-flex rounded-xl bg-white/95 px-4 py-3">
              <Image
                src="/logo.png"
                alt="Data Science Skills Academy"
                width={2240}
                height={932}
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="mt-4 max-w-sm text-sm text-neutral-400">
              Career-focused data science education. Real instructors, real
              projects, real outcomes.
            </p>
            <div className="mt-6 flex gap-4">
              <Globe className="h-5 w-5 text-neutral-400 transition-colors hover:text-white" />
              <Link2 className="h-5 w-5 text-neutral-400 transition-colors hover:text-white" />
              <Mail className="h-5 w-5 text-neutral-400 transition-colors hover:text-white" />
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-neutral-500">
          © {new Date().getFullYear()} DataSkills. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
