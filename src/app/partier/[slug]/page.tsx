import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Scale } from "lucide-react";
import { getPartyFacts } from "@/lib/queries/parties";
import { getCommitteeMembershipsForParty } from "@/lib/queries/committees";
import { getPledgesForParty } from "@/lib/queries/pledges";
import { IssuePositionBlock } from "@/components/IssuePositionBlock";
import { NewsCard } from "@/components/NewsCard";
import { PledgeCard } from "@/components/PledgeCard";

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
  const pledgesRaw = await getPledgesForParty(params.slug);
  const pledges2022 = [...pledgesRaw].sort((a, b) => {
    const aHas = a.outcomeStatus !== "NOT_VERIFIED" ? 0 : 1;
    const bHas = b.outcomeStatus !== "NOT_VERIFIED" ? 0 : 1;
    return aHas - bHas;
  });
  const currentMandate = party.mandates[0];

  const sections = [
    { id: "namnduppdrag", label: "Nämnduppdrag", show: committeeMemberships.length > 0 },
    { id: "sakfragor", label: "Sakfrågor", show: party.policyPositions.length > 0 },
    { id: "valloften", label: "Vallöften 2022", show: pledges2022.length > 0 },
    { id: "nyheter", label: "Nyheter", show: party.newsItems.length > 0 },
  ].filter((s) => s.show);

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

      {sections.length > 1 && (
        <nav
          aria-label="Hoppa till avsnitt"
          className="flex flex-wrap gap-1 rounded-full border border-border-light bg-surface-light px-2 py-1.5 dark:border-border-dark dark:bg-surface-dark"
        >
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-muted-light hover:bg-canvas-light hover:text-ink-light dark:text-muted-dark dark:hover:bg-canvas-dark dark:hover:text-ink-dark"
            >
              {s.label}
            </a>
          ))}
        </nav>
      )}

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
        <section id="namnduppdrag" className="scroll-mt-16">
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
        <section id="sakfragor" className="scroll-mt-16">
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
        <section id="valloften" className="scroll-mt-16">
          <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">Vallöften 2022 &mdash; Vad hände?</h2>
              <span
                className={`pill ${
                  party.isCoalitionMember
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "bg-surface-light text-muted-light dark:bg-canvas-dark dark:text-muted-dark"
                }`}
              >
                {party.isCoalitionMember ? "Styr idag" : "Opposition idag"}
              </span>
            </div>
            <Link href="/valkompass-2022" className="text-xs text-muted-light hover:underline dark:text-muted-dark">
              Jämför alla partier
            </Link>
          </div>
          <p className="mb-4 text-xs text-muted-light dark:text-muted-dark">
            Partiets svar i SVT:s lokala Valkompass inför valet 2022, ställt mot vad som faktiskt beslutades i
            kommunfullmäktige sedan dess. {party.isCoalitionMember
              ? "Som styrande parti har man störst möjlighet att driva igenom sina löften."
              : "Som oppositionsparti saknar man oftast egen majoritet och kan sällan driva igenom ett löfte helt på egen hand, även om partiet velat."}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {pledges2022.map((pledge) => (
              <PledgeCard
                key={pledge.id}
                topic={pledge.topic}
                position={pledge.position}
                motivation={pledge.motivation}
                outcomeStatus={pledge.outcomeStatus}
                outcomeDescription={pledge.outcomeDescription}
              />
            ))}
          </div>
        </section>
      )}

      {party.newsItems.length > 0 && (
        <section id="nyheter" className="scroll-mt-16">
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
