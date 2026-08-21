import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Scale } from "lucide-react";
import { getPartyFacts } from "@/lib/queries/parties";
import { getCommitteeMembershipsForParty } from "@/lib/queries/committees";
import { getPledgesForParty } from "@/lib/queries/pledges";
import { IssuePositionBlock } from "@/components/IssuePositionBlock";
import { NewsCard } from "@/components/NewsCard";

const ROLE_LABEL: Record<string, string> = {
  ORDFORANDE: "Ordförande",
  KOMMUNALRAD: "Kommunal-/oppositionsråd",
  GRUPPLEDARE: "Gruppledare",
  LEDAMOT: "Ledamot",
  ERSATTARE: "Ersättare",
};

const COMMITTEE_ROLE_LABEL: Record<string, string> = {
  ORDFORANDE: "Ordförande",
  FORSTE_VICE_ORDFORANDE: "1:e vice ordförande",
  ANDRE_VICE_ORDFORANDE: "2:e vice ordförande",
  LEDAMOT: "Ledamot",
  ERSATTARE: "Ersättare",
  ADJUNGERAD: "Adjungerad",
};

export default async function PartyDetailPage({ params }: { params: { slug: string } }) {
  const party = await getPartyFacts(params.slug);
  if (!party) notFound();

  const committeeMemberships = await getCommitteeMembershipsForParty(params.slug);
  const pledges2022 = await getPledgesForParty(params.slug);
  const currentMandate = party.mandates[0];

  return (
    <div className="flex flex-col gap-10">
      <section
        className="-mx-4 rounded-2xl px-6 py-10 sm:px-10"
        style={{ background: `linear-gradient(135deg, ${party.colorHex}1a, transparent 60%)` }}
      >
        <div className="flex items-start gap-4">
          <span
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-semibold text-white shadow-sm"
            style={{ backgroundColor: party.colorHex }}
          >
            {party.shortName}
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{party.name}</h1>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {party.isCoalitionMember && (
                <span className="pill bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  Styrande koalition
                </span>
              )}
              {party.isLocalParty && (
                <span className="pill bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                  Lokalparti
                </span>
              )}
              {party.ideologyTags.map((tag) => (
                <span key={tag} className="pill bg-surface-light text-muted-light dark:bg-surface-dark dark:text-muted-dark">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-5 max-w-2xl text-ink-light dark:text-ink-dark">{party.description}</p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <div className="text-xs text-muted-light dark:text-muted-dark">Mandat {currentMandate?.electionPeriod.year}</div>
          <div className="mt-1 text-2xl font-semibold">{currentMandate?.seats ?? 0}</div>
        </div>
        {currentMandate?.voteSharePct && (
          <div className="card p-5">
            <div className="text-xs text-muted-light dark:text-muted-dark">Röstandel {currentMandate.electionPeriod.year}</div>
            <div className="mt-1 text-2xl font-semibold">{Number(currentMandate.voteSharePct)}%</div>
          </div>
        )}
        {currentMandate?.voteCount && (
          <div className="card p-5">
            <div className="text-xs text-muted-light dark:text-muted-dark">Röster {currentMandate.electionPeriod.year}</div>
            <div className="mt-1 text-2xl font-semibold">{currentMandate.voteCount.toLocaleString("sv-SE")}</div>
          </div>
        )}
      </section>

      <section className="flex flex-wrap gap-3 text-sm">
        {party.websiteUrl && (
          <a
            href={party.websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border-light px-3.5 py-2 hover:bg-surface-light dark:border-border-dark dark:hover:bg-surface-dark"
          >
            <ExternalLink size={14} /> Webbplats
          </a>
        )}
        {party.facebookUrl && (
          <a
            href={party.facebookUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border-light px-3.5 py-2 hover:bg-surface-light dark:border-border-dark dark:hover:bg-surface-dark"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.878h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94Z" />
            </svg>
            Facebook
          </a>
        )}
        <Link
          href={`/jamfor?p=${party.slug}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-border-light px-3.5 py-2 hover:bg-surface-light dark:border-border-dark dark:hover:bg-surface-dark"
        >
          <Scale size={14} /> Jämför med andra partier
        </Link>
      </section>

      {party.people.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold tracking-tight">Namnkunniga företrädare</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {party.people.map((person) => (
              <div key={person.id} className="card p-4">
                <div className="font-medium">{person.name}</div>
                <div className="text-xs text-muted-light dark:text-muted-dark">{ROLE_LABEL[person.role] ?? person.role}</div>
                {person.bio && <p className="mt-1.5 text-sm text-muted-light dark:text-muted-dark">{person.bio}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {committeeMemberships.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold tracking-tight">Nämnduppdrag</h2>
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <tbody>
                {committeeMemberships.map((m) => (
                  <tr key={m.id} className="border-b border-border-light last:border-0 dark:border-border-dark">
                    <td className="p-3">
                      <Link href={`/namnder/${m.committee.slug}`} className="font-medium hover:underline">
                        {m.committee.name}
                      </Link>
                    </td>
                    <td className="p-3 text-muted-light dark:text-muted-dark">{m.person.name}</td>
                    <td className="p-3 text-right text-muted-light dark:text-muted-dark">
                      {COMMITTEE_ROLE_LABEL[m.role]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {party.policyPositions.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold tracking-tight">Sakfrågor</h2>
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

      {pledges2022.length > 0 && (
        <section>
          <div className="mb-4 flex items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold tracking-tight">Valplattform 2022</h2>
            <Link href="/valkompass-2022" className="text-xs text-muted-light hover:underline dark:text-muted-dark">
              Jämför alla partier
            </Link>
          </div>
          <p className="mb-3 text-xs text-muted-light dark:text-muted-dark">
            Partiets svar i SVT:s lokala Valkompass inför valet 2022 &mdash; visar vad partiet gick till val på,
            inte nödvändigtvis dagens politik.
          </p>
          <div className="card divide-y divide-border-light dark:divide-border-dark">
            {pledges2022.map((pledge) => (
              <div key={pledge.id} className="p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-light dark:text-muted-dark">
                  {pledge.topic}
                </div>
                <p className="mt-1 text-sm font-medium">{pledge.position}</p>
                {pledge.motivation && (
                  <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">{pledge.motivation}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {party.newsItems.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold tracking-tight">Relaterade nyheter</h2>
          <div className="flex flex-col gap-3">
            {party.newsItems.map(({ newsItem }) => (
              <NewsCard
                key={newsItem.id}
                title={newsItem.title}
                url={newsItem.url}
                sourceName={newsItem.sourceName}
                publishedAt={newsItem.publishedAt}
                summary={newsItem.summary}
                details={newsItem.details}
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
