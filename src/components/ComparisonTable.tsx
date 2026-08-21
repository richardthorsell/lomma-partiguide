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
    return (
      <div className="card flex items-center justify-center p-10 text-sm text-muted-light dark:text-muted-dark">
        Välj minst ett parti ovan för att jämföra.
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border-light dark:border-border-dark">
            <th className="sticky left-0 w-40 bg-surface-light p-4 text-left font-medium text-muted-light dark:bg-surface-dark dark:text-muted-dark">
              Sakfråga
            </th>
            {parties.map((party) => (
              <th key={party.slug} className="min-w-[180px] p-4 text-left">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: party.colorHex }}
                >
                  {party.shortName}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border-light dark:border-border-dark">
            <td className="sticky left-0 bg-surface-light p-4 font-medium text-muted-light dark:bg-surface-dark dark:text-muted-dark">
              Mandat
            </td>
            {parties.map((party) => (
              <td key={party.slug} className="p-4 font-medium">
                {party.seats}
              </td>
            ))}
          </tr>
          {issueAreas.map((issueArea) => (
            <tr key={issueArea.slug} className="border-b border-border-light align-top last:border-0 dark:border-border-dark">
              <td className="sticky left-0 bg-surface-light p-4 font-medium text-muted-light dark:bg-surface-dark dark:text-muted-dark">
                {issueArea.name}
              </td>
              {parties.map((party) => (
                <td key={party.slug} className="p-4 leading-relaxed text-ink-light dark:text-ink-dark">
                  {party.positionsByIssueSlug[issueArea.slug] ?? (
                    <span className="text-muted-light dark:text-muted-dark">Ingen uppgift</span>
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
