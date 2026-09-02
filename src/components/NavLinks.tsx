"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Grundfakta" },
  { href: "/partier", label: "Partier" },
  { href: "/jamfor", label: "Jämför" },
  { href: "/sakfragor", label: "Sakfrågor" },
  { href: "/namnder", label: "Nämnder" },
  { href: "/valkompass-2022", label: "Vallöften 2022" },
  { href: "/valanalys", label: "Valanalys" },
  { href: "/nyheter", label: "Nyheter" },
  { href: "/om", label: "Om" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-1 text-sm">
      {NAV_LINKS.map((link) => {
        const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
              isActive
                ? "bg-ink-light text-canvas-light dark:bg-ink-dark dark:text-canvas-dark"
                : "text-muted-light hover:bg-stone-100 hover:text-ink-light dark:text-muted-dark dark:hover:bg-white/5 dark:hover:text-ink-dark"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
