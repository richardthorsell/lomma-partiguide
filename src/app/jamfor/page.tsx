import { getAllParties, getPartiesBySlug } from "@/lib/queries/parties";
import { getAllIssueAreas } from "@/lib/queries/issueAreas";
import { PartyPicker } from "@/components/PartyPicker";
import { ComparisonTable } from "@/components/ComparisonTable";

export default async function JamforPage({ searchParams }: { searchParams: { p?: string } }) {
  const selectedSlugs = searchParams.p ? searchParams.p.split(",").filter(Boolean) : [];

  const [allParties, issueAreas, selectedParties] = await Promise.all([
    getAllParties(),
    getAllIssueAreas(),
    selectedSlugs.length > 0 ? getPartiesBySlug(selectedSlugs) : Promise.resolve([]),
  ]);

  const options = allParties.map((p) => ({ slug: p.slug, shortName: p.shortName, colorHex: p.colorHex }));

  const orderedSelected = selectedSlugs
    .map((slug) => selectedParties.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const comparedParties = orderedSelected.map((party) => ({
    slug: party.slug,
    name: party.name,
    shortName: party.shortName,
    colorHex: party.colorHex,
    seats: party.mandates[0]?.seats ?? 0,
    positionsByIssueSlug: Object.fromEntries(
      party.policyPositions.map((pos) => [pos.issueArea.slug, pos.summary])
    ),
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Jämför partier</h1>
        <p className="mt-1 text-muted-light dark:text-muted-dark">Välj partier nedan för en sida-vid-sida-jämförelse.</p>
      </div>
      <PartyPicker options={options} selected={selectedSlugs} />
      <ComparisonTable
        parties={comparedParties}
        issueAreas={issueAreas.map((a) => ({ slug: a.slug, name: a.name }))}
      />
    </div>
  );
}
