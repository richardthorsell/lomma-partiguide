import { notFound } from "next/navigation";
import Link from "next/link";
import { getPartyFacts } from "@/lib/queries/parties";
import { IssuePositionBlock } from "@/components/IssuePositionBlock";
import { NewsCard } from "@/components/NewsCard";

const ROLE_LABEL: Record<string, string> = {
  ORDFORANDE: "Ordförande",
  KOMMUNALRAD: "Kommunal-/oppositionsråd",
  GRUPPLEDARE: "Gruppledare",
  LEDAMOT: "Ledamot",
  ERSATTARE: "Ersättare",
};

export default async function PartyDetailPage({ params }: { params: { slug: string } }) {
  const party = await getPartyFacts(params.slug);
  if (!party) notFound();

  const currentMandate = party.mandates[0];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start gap-4">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white"
          style={{ backgroundColor: party.colorHex }}
        >
          {party.shortName}
        </span>
        <div>
          <h1 className="text-2xl font-semibold">{party.name}</h1>
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-stone-500">
            {party.isCoalitionMember && <span className="text-emerald-700">Del av styrande koalition</span>}
            {party.isLocalParty && <span>Lokalparti</span>}
            {party.ideologyTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <p className="text-stone-700">{party.description}</p>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <div className="text-xs text-stone-500">Mandat {currentMandate?.electionPeriod.year}</div>
          <div className="text-2xl font-semibold">{currentMandate?.seats ?? 0}</div>
        </div>
        {currentMandate?.voteSharePct && (
          <div className="rounded-lg border border-stone-200 bg-white p-4">
            <div className="text-xs text-stone-500">Röstandel {currentMandate.electionPeriod.year}</div>
            <div className="text-2xl font-semibold">{Number(currentMandate.voteSharePct)}%</div>
          </div>
        )}
        {currentMandate?.voteCount && (
          <div className="rounded-lg border border-stone-200 bg-white p-4">
            <div className="text-xs text-stone-500">Röster {currentMandate.electionPeriod.year}</div>
            <div className="text-2xl font-semibold">{currentMandate.voteCount.toLocaleString("sv-SE")}</div>
          </div>
        )}
      </section>

      <section className="flex flex-wrap gap-3 text-sm">
        {party.websiteUrl && (
          <a href={party.websiteUrl} target="_blank" rel="noreferrer" className="rounded-md border border-stone-300 px-3 py-1.5 hover:bg-stone-100">
            Webbplats
          </a>
        )}
        {party.facebookUrl && (
          <a href={party.facebookUrl} target="_blank" rel="noreferrer" className="rounded-md border border-stone-300 px-3 py-1.5 hover:bg-stone-100">
            Facebook
          </a>
        )}
        <Link href={`/jamfor?p=${party.slug}`} className="rounded-md border border-stone-300 px-3 py-1.5 hover:bg-stone-100">
          Jämför med andra partier
        </Link>
      </section>

      {party.people.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-medium">Namnkunniga företrädare</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {party.people.map((person) => (
              <div key={person.id} className="rounded-lg border border-stone-200 bg-white p-4">
                <div className="font-medium">{person.name}</div>
                <div className="text-xs text-stone-500">{ROLE_LABEL[person.role] ?? person.role}</div>
                {person.bio && <p className="mt-1 text-sm text-stone-600">{person.bio}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {party.policyPositions.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-medium">Sakfrågor</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {party.policyPositions.map((position) => (
              <IssuePositionBlock
                key={position.id}
                issueAreaName={position.issueArea.name}
                summary={position.summary}
                details={position.details}
                sourceUrl={position.sourceUrl}
              />
            ))}
          </div>
        </section>
      )}

      {party.newsItems.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-medium">Relaterade nyheter</h2>
          <div className="flex flex-col gap-3">
            {party.newsItems.map(({ newsItem }) => (
              <NewsCard
                key={newsItem.id}
                title={newsItem.title}
                url={newsItem.url}
                sourceName={newsItem.sourceName}
                publishedAt={newsItem.publishedAt}
                summary={newsItem.summary}
                sentiment={newsItem.sentiment}
                parties={[{ slug: party.slug, shortName: party.shortName, colorHex: party.colorHex }]}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
