import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Landmark } from "lucide-react";
import { NavLinks } from "@/components/NavLinks";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Lomma Partiguide",
  description: "Sök och jämför de politiska partierna i Lomma kommun inför valet 2026.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className={inter.variable}>
      <body className="font-sans antialiased">
        <header className="sticky top-0 z-20 border-b border-border-light bg-canvas-light/80 backdrop-blur-md dark:border-border-dark dark:bg-canvas-dark/80">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
            <Link href="/" className="flex items-center gap-2 text-base font-semibold tracking-tight">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
                <Landmark size={16} strokeWidth={2.25} />
              </span>
              Lomma Partiguide
            </Link>
            <NavLinks />
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
        <footer className="border-t border-border-light dark:border-border-dark">
          <div className="mx-auto max-w-5xl px-4 py-8 text-xs text-muted-light dark:text-muted-dark">
            Oberoende, manuellt researchad tjänst inför valet 2026. Ej kopplad till Lomma kommun eller
            Valmyndigheten.
          </div>
        </footer>
      </body>
    </html>
  );
}
