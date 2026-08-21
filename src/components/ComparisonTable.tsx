type ComparedParty = {
  slug: string;
  name: string;
  shortName: string;
  colorHex: string;
  seats: number;
  positionsByIssueSlug: Record<string, string | undefined>;
};

type ComparisonTableProps = {
  parties: ComparedParty[];
  issueAreas: { slug: string; name: string }[];
};

export function ComparisonTable({ parties, issueAreas }: ComparisonTableProps) {
  if (parties.length === 0) {
    return <p className="text-sm text-stone-500">Välj minst ett parti ovan för att jämföra.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
      <table className="w-full min-w-[600px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-stone-200">
            <th className="w-40 p-3 text-left font-medium text-stone-500">Sakfråga</th>
            {parties.map((party) => (
              <th key={party.slug} className="p-3 text-left">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                  style={{ backgroundColor: party.colorHex }}
                >
                  {party.shortName}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-stone-100">
            <td className="p-3 font-medium text-stone-500">Mandat</td>
            {parties.map((party) => (
              <td key={party.slug} className="p-3">
                {party.seats}
              </td>
            ))}
          </tr>
          {issueAreas.map((issueArea) => (
            <tr key={issueArea.slug} className="border-b border-stone-100 align-top">
              <td className="p-3 font-medium text-stone-500">{issueArea.name}</td>
              {parties.map((party) => (
                <td key={party.slug} className="p-3 text-stone-700">
                  {party.positionsByIssueSlug[issueArea.slug] ?? (
                    <span className="text-stone-400">Ingen uppgift</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
