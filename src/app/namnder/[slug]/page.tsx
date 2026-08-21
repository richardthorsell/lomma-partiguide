import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCommitteeWithMembers } from "@/lib/queries/committees";

const ROLE_LABEL: Record<string, string> = {
  ORDFORANDE: "Ordförande",
  FORSTE_VICE_ORDFORANDE: "1:e vice ordförande",
  ANDRE_VICE_ORDFORANDE: "2:e vice ordförande",
  LEDAMOT: "Ledamot",
  ERSATTARE: "Ersättare",
  ADJUNGERAD: "Adjungerad",
};

const ROLE_ORDER = ["ORDFORANDE", "FORSTE_VICE_ORDFORANDE", "ANDRE_VICE_ORDFORANDE", "LEDAMOT", "ERSATTARE", "ADJUNGERAD"];

export default async function CommitteeDetailPage({ params }: { params: { slug: string } }) {
  const committee = await getCommitteeWithMembers(params.slug);
  if (!committee) notFound();

  const leadership = committee.memberships.filter((m) =>
    ["ORDFORANDE", "FORSTE_VICE_ORDFORANDE", "ANDRE_VICE_ORDFORANDE"].includes(m.role)
  );
  const ledamoter = committee.memberships.filter((m) => m.role === "LEDAMOT");
  const ersattare = committee.memberships.filter((m) => m.role === "ERSATTARE" || m.role === "ADJUNGERAD");

  const partyCounts = new Map<string, { name: string; shortName: string; colorHex: string; count: number }>();
  for (const m of ledamoter.concat(leadership)) {
    if (!m.person.party) continue;
    const key = m.person.party.slug;
    const existing = partyCounts.get(key);
    if (existing) existing.count += 1;
    else
      partyCounts.set(key, {
        name: m.person.party.name,
        shortName: m.person.party.shortName,
        colorHex: m.person.party.colorHex,
        count: 1,
      });
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href="/namnder"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-light hover:text-ink-light dark:text-muted-dark dark:hover:text-ink-dark"
        >
          <ArrowLeft size={14} /> Alla nämnder
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{committee.name}</h1>
      </div>

      {partyCounts.size > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {Array.from(partyCounts.values())
            .sort((a, b) => b.count - a.count)
            .map((p) => (
              <span key={p.shortName} className="pill text-white" style={{ backgroundColor: p.colorHex }}>
                {p.shortName} {p.count}
              </span>
            ))}
        </div>
      )}

      {[
        { title: "Ledning", rows: leadership },
        { title: "Ledamöter", rows: ledamoter },
        { title: "Ersättare", rows: ersattare },
      ].map(
        (group) =>
          group.rows.length > 0 && (
            <section key={group.title}>
              <h2 className="mb-3 text-lg font-semibold tracking-tight">{group.title}</h2>
              <div className="card overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse text-sm">
                  <tbody>
                    {group.rows
                      .sort((a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role))
                      .map((m) => (
                        <tr key={m.id} className="border-b border-border-light last:border-0 dark:border-border-dark">
                          <td className="p-3 font-medium">{m.person.name}</td>
                          <td className="p-3 text-muted-light dark:text-muted-dark">{ROLE_LABEL[m.role]}</td>
                          <td className="p-3 text-right">
                            {m.person.party ? (
                              <Link href={`/partier/${m.person.party.slug}`}>
                                <span
                                  className="pill text-white"
                                  style={{ backgroundColor: m.person.party.colorHex }}
                                >
                                  {m.person.party.shortName}
                                </span>
                              </Link>
                            ) : (
                              <span className="pill bg-surface-light text-muted-light dark:bg-surface-dark dark:text-muted-dark">
                                Oberoende
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          )
      )}
    </div>
  );
}
