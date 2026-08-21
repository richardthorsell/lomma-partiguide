import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getIssueAreaWithPositions } from "@/lib/queries/issueAreas";

export default async function IssueAreaPage({ params }: { params: { slug: string } }) {
  const issueArea = await getIssueAreaWithPositions(params.slug);
  if (!issueArea) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/sakfragor"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-light hover:text-ink-light dark:text-muted-dark dark:hover:text-ink-dark"
        >
          <ArrowLeft size={14} /> Alla sakfrågor
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{issueArea.name}</h1>
      </div>

      {issueArea.policyPositions.length === 0 ? (
        <p className="text-muted-light dark:text-muted-dark">Ingen registrerad ståndpunkt för denna fråga ännu.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {issueArea.policyPositions.map((position) => (
            <div key={position.id} className="card p-5">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: position.party.colorHex }}
                >
                  {position.party.shortName}
                </span>
                <Link href={`/partier/${position.party.slug}`} className="text-sm font-medium hover:underline">
                  {position.party.name}
                </Link>
              </div>
              <p className="text-sm leading-relaxed text-ink-light dark:text-ink-dark">{position.summary}</p>
              {position.details && (
                <p className="mt-1.5 text-sm text-muted-light dark:text-muted-dark">{position.details}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
