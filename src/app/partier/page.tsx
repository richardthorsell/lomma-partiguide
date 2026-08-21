import { getAllParties } from "@/lib/queries/parties";
import { PartyListClient } from "@/components/PartyListClient";

export default async function PartierPage() {
  const parties = await getAllParties();

  const items = parties.map((party) => ({
    slug: party.slug,
    name: party.name,
    shortName: party.shortName,
    colorHex: party.colorHex,
    description: party.description,
    seats: party.mandates[0]?.seats ?? 0,
    isCoalitionMember: party.isCoalitionMember,
    isLocalParty: party.isLocalParty,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Partier</h1>
        <p className="mt-1 text-muted-light dark:text-muted-dark">
          Alla partier som ställde upp i Lomma i valet 2022.
        </p>
      </div>
      <PartyListClient parties={items} />
    </div>
  );
}
