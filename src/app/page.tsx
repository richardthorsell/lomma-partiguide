import Link from "next/link";
import { getAllParties, getLatestElectionPeriod } from "@/lib/queries/parties";
import { MandateChart } from "@/components/MandateChart";

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
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="mb-2 text-2xl font-semibold">Lomma kommun inför valet 2026</h1>
        <p className="text-stone-600">
          Sök, jämför och läs om partierna i Lomma kommunfullmäktige. Underlaget är manuellt researchat
          &mdash; se{" "}
          <Link href="/om" className="underline">
            Om tjänsten
          </Link>{" "}
          för källor.
        </p>
      </section>

      {period && (
        <section className="rounded-lg border border-stone-200 bg-white p-5">
          <h2 className="mb-1 font-medium">
            Mandatfördelning {period.year} &mdash; {period.totalSeats} mandat
          </h2>
          <p className="mb-4 text-sm text-stone-500">
            Mandatperiod {new Date(period.termStart).toLocaleDateString("sv-SE")} &ndash;{" "}
            {new Date(period.termEnd).toLocaleDateString("sv-SE")}
          </p>
          <MandateChart parties={partiesWithSeats} totalSeats={period.totalSeats} />
          <p className="mt-4 text-sm text-stone-600">
            Styrande koalition ({coalition.map((p) => p.shortName).join(", ")}) har{" "}
            <strong>{coalitionSeats} av {period.totalSeats}</strong> mandat.
          </p>
        </section>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href="/partier" className="rounded-lg border border-stone-200 bg-white p-4 hover:border-stone-400">
          <h3 className="font-medium">Partier</h3>
          <p className="text-sm text-stone-600">Sök och filtrera bland alla partier.</p>
        </Link>
        <Link href="/jamfor" className="rounded-lg border border-stone-200 bg-white p-4 hover:border-stone-400">
          <h3 className="font-medium">Jämför partier</h3>
          <p className="text-sm text-stone-600">Ställ partier sida vid sida.</p>
        </Link>
        <Link href="/sakfragor" className="rounded-lg border border-stone-200 bg-white p-4 hover:border-stone-400">
          <h3 className="font-medium">Sakfrågor</h3>
          <p className="text-sm text-stone-600">Se alla partiers ståndpunkt i en fråga.</p>
        </Link>
        <Link href="/nyheter" className="rounded-lg border border-stone-200 bg-white p-4 hover:border-stone-400">
          <h3 className="font-medium">Nyheter</h3>
          <p className="text-sm text-stone-600">Senaste lokalpolitiska nyheterna.</p>
        </Link>
      </section>
    </div>
  );
}
