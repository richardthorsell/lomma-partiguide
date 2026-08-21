import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { PledgeOutcomeBadge } from "@/components/PledgeOutcomeBadge";

type PledgeCardParty = { slug: string; name: string; shortName: string; colorHex: string };

type PledgeCardProps = {
  topic: string;
  position: string;
  motivation?: string | null;
  outcomeStatus: "FULFILLED" | "PARTIALLY_FULFILLED" | "NOT_FULFILLED" | "UNCLEAR" | "NOT_VERIFIED";
  outcomeDescription?: string | null;
  party?: PledgeCardParty;
};

export function PledgeCard({ topic, position, motivation, outcomeStatus, outcomeDescription, party }: PledgeCardProps) {
  return (
    <div className="card overflow-hidden">
      <div className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {party && (
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                style={{ backgroundColor: party.colorHex }}
              >
                {party.shortName}
              </span>
            )}
            {party ? (
              <Link href={`/partier/${party.slug}`} className="text-sm font-medium hover:underline">
                {party.name}
              </Link>
            ) : (
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-light dark:text-muted-dark">
                {topic}
              </span>
            )}
          </div>
          <span className="pill bg-surface-light text-[10px] font-semibold uppercase tracking-wide text-muted-light dark:bg-canvas-dark dark:text-muted-dark">
            Lovade 2022
          </span>
        </div>
        <p className="mt-2 text-sm font-medium text-ink-light dark:text-ink-dark">{position}</p>
        {motivation && <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">{motivation}</p>}
      </div>

      {outcomeDescription && (
        <>
          <div className="flex items-center gap-2 px-4 text-muted-light dark:text-muted-dark">
            <div className="h-px flex-1 bg-border-light dark:bg-border-dark" />
            <ArrowDown size={14} />
            <div className="h-px flex-1 bg-border-light dark:bg-border-dark" />
          </div>
          <div className="bg-canvas-light p-4 dark:bg-canvas-dark">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-light dark:text-muted-dark">
                Vad hände
              </span>
              <PledgeOutcomeBadge status={outcomeStatus} />
            </div>
            <p className="text-sm text-ink-light dark:text-ink-dark">{outcomeDescription}</p>
          </div>
        </>
      )}
    </div>
  );
}
