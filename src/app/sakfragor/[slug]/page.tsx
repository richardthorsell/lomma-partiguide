import { notFound } from "next/navigation";
import Link from "next/link";
import { getIssueAreaWithPositions } from "@/lib/queries/issueAreas";

export default async function IssueAreaPage({ params }: { params: { slug: string } }) {
  const issueArea = await getIssueAreaWithPositions(params.slug);
  if (!issueArea) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/sakfragor" className="text-sm text-stone-500 hover:underline">
          &larr; Alla sakfrågor
        </Link>
        <h1 className="text-2xl font-semibold">{issueArea.name}</h1>
      </div>

      {issueArea.policyPositions.length === 0 ? (
        <p className="text-stone-500">Ingen registrerad ståndpunkt för denna fråga ännu.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {issueArea.policyPositions.map((position) => (
            <div key={position.id} className="rounded-lg border border-stone-200 bg-white p-4">
              <div className="mb-1 flex items-center gap-2">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: position.party.colorHex }}
                >
                  {position.party.shortName}
                </span>
                <Link href={`/partier/${position.party.slug}`} className="text-sm font-medium hover:underline">
                  {position.party.name}
                </Link>
              </div>
              <p className="text-sm text-stone-700">{position.summary}</p>
              {position.details && <p className="mt-1 text-sm text-stone-500">{position.details}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
