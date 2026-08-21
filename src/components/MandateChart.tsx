type MandateChartParty = {
  slug: string;
  shortName: string;
  colorHex: string;
  seats: number;
};

export function MandateChart({ parties, totalSeats }: { parties: MandateChartParty[]; totalSeats: number }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full">
        {parties.map((party) => (
          <div
            key={party.slug}
            style={{ width: `${(party.seats / totalSeats) * 100}%`, backgroundColor: party.colorHex }}
            title={`${party.shortName}: ${party.seats} mandat`}
            className="transition-all"
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {parties.map((party) => (
          <span key={party.slug} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: party.colorHex }} />
            <span className="font-medium">{party.shortName}</span>
            <span className="text-muted-light dark:text-muted-dark">{party.seats}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
