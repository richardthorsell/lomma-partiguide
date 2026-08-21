type MandateChartParty = {
  slug: string;
  shortName: string;
  colorHex: string;
  seats: number;
};

export function MandateChart({ parties, totalSeats }: { parties: MandateChartParty[]; totalSeats: number }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-8 w-full overflow-hidden rounded-md border border-stone-200">
        {parties.map((party) => (
          <div
            key={party.slug}
            style={{ width: `${(party.seats / totalSeats) * 100}%`, backgroundColor: party.colorHex }}
            title={`${party.shortName}: ${party.seats} mandat`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-600">
        {parties.map((party) => (
          <span key={party.slug} className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: party.colorHex }} />
            {party.shortName} {party.seats}
          </span>
        ))}
      </div>
    </div>
  );
}
