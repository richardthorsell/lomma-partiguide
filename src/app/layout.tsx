import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lomma Partiguide",
  description: "Sök och jämför de politiska partierna i Lomma kommun inför valet 2026.",
};

const NAV_LINKS = [
  { href: "/", label: "Grundfakta" },
  { href: "/partier", label: "Partier" },
  { href: "/jamfor", label: "Jämför" },
  { href: "/sakfragor", label: "Sakfrågor" },
  { href: "/nyheter", label: "Nyheter" },
  { href: "/om", label: "Om tjänsten" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body>
        <header className="border-b border-stone-200 bg-white">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
            <Link href="/" className="text-lg font-semibold">
              Lomma Partiguide
            </Link>
            <nav className="flex flex-wrap gap-4 text-sm">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="text-stone-600 hover:text-stone-950">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-8 text-xs text-stone-500">
          Oberoende, manuellt researchad tjänst inför valet 2026. Ej kopplad till Lomma kommun eller Valmyndigheten.
        </footer>
      </body>
    </html>
  );
}
