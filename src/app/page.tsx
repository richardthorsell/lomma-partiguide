import Link from "next/link";
import { Users, Scale, ListChecks, Newspaper, ArrowRight, History } from "lucide-react";
import { getAllParties, getLatestElectionPeriod } from "@/lib/queries/parties";
import { MandateChart } from "@/components/MandateChart";

const NAV_CARDS = [
  { href: "/partier", icon: Users, title: "Partier", desc: "Sök och filtrera bland alla partier." },
  { href: "/jamfor", icon: Scale, title: "Jämför partier", desc: "Ställ partier sida vid sida." },
  { href: "/sakfragor", icon: ListChecks, title: "Sakfrågor", desc: "Se alla partiers ståndpunkt i en fråga." },
  { href: "/valkompass-2022", icon: History, title: "Vallöften 2022 — Vad hände?", desc: "Partiernas löften från 2022, jämfört med verkligheten." },
  { href: "/nyheter", icon: Newspaper, title: "Nyheter", desc: "Senaste lokalpolitiska nyheterna." },
];

export default async function HomePage() {
  const [parties, period] = await Promise.all([getAllParties(), getLatestElectionPeriod()]);

  const partiesWithSeats = parties
    .map((party) => ({
      slug: party.slug,
      shortName: party.shortName,
      colorHex: party.colorHex,
      seats: party.mandates[0]?.seats ?? 0,
      isCoalitionMember: party.isCoalitionMember,
    }))
    .filter((p) => p.seats > 0)
    .sort((a, b) => b.seats - a.seats);

  const coalition = partiesWithSeats.filter((p) => p.isCoalitionMember);
  const coalitionSeats = coalition.reduce((sum, p) => sum + p.seats, 0);

  return (
    <div className="flex flex-col gap-14">
      <section className="relative -mx-4 overflow-hidden rounded-2xl bg-hero px-6 py-14 sm:px-10">
        <p className="mb-3 inline-block rounded-full border border-border-light bg-surface-light px-3 py-1 text-xs font-medium text-muted-light dark:border-border-dark dark:bg-surface-dark dark:text-muted-dark">
          Kommunvalet 2026
        </p>
        <h1 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Lomma kommun inför valet
        </h1>
        <p className="mt-3 max-w-lg text-muted-light dark:text-muted-dark">
          Sök, jämför och läs om partierna i Lomma kommunfullmäktige &mdash; grundfakta, sakfrågor och
          lokala nyheter på ett ställe.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/partier"
            className="inline-flex items-center gap-1.5 rounded-full bg-ink-light px-4 py-2 text-sm font-medium text-canvas-light transition-transform hover:scale-[1.02] dark:bg-ink-dark dark:text-canvas-dark"
          >
            Utforska partierna
            <ArrowRight size={15} />
          </Link>
          <Link
            href="/om"
            className="inline-flex items-center gap-1.5 rounded-full border border-border-light px-4 py-2 text-sm font-medium hover:bg-surface-light dark:border-border-dark dark:hover:bg-surface-dark"
          >
            Om källorna
          </Link>
        </div>
      </section>

      {period && (
        <section className="card p-6 sm:p-8">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold">
              Mandatfördelning {period.year}
              <span className="ml-2 text-sm font-normal text-muted-light dark:text-muted-dark">
                {period.totalSeats} mandat totalt
              </span>
            </h2>
            <p className="text-xs text-muted-light dark:text-muted-dark">
              Mandatperiod {new Date(period.termStart).toLocaleDateString("sv-SE")} &ndash;{" "}
              {new Date(period.termEnd).toLocaleDateString("sv-SE")}
            </p>
          </div>
          <MandateChart parties={partiesWithSeats} totalSeats={period.totalSeats} />
          <p className="mt-5 border-t border-border-light pt-4 text-sm text-muted-light dark:border-border-dark dark:text-muted-dark">
            Styrande koalition{" "}
            <span className="font-medium text-ink-light dark:text-ink-dark">
              ({coalition.map((p) => p.shortName).join(", ")})
            </span>{" "}
            har <strong className="text-ink-light dark:text-ink-dark">{coalitionSeats} av {period.totalSeats}</strong> mandat.
          </p>
        </section>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {NAV_CARDS.map(({ href, icon: Icon, title, desc }) => (
          <Link key={href} href={href} className="card card-hover group flex items-start gap-4 p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
              <Icon size={18} strokeWidth={2} />
            </span>
            <div>
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm text-muted-light dark:text-muted-dark">{desc}</p>
            </div>
            <ArrowRight
              size={16}
              className="ml-auto mt-2 shrink-0 text-muted-light opacity-0 transition-opacity group-hover:opacity-100 dark:text-muted-dark"
            />
          </Link>
        ))}
      </section>
    </div>
  );
}
