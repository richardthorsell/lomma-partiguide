import Link from "next/link";
import { ArrowRight } from "lucide-react";

type PartyCardProps = {
  slug: string;
  name: string;
  shortName: string;
  colorHex: string;
  description: string;
  seats?: number;
  isCoalitionMember: boolean;
  isLocalParty: boolean;
};

export function PartyCard({
  slug,
  name,
  shortName,
  colorHex,
  description,
  seats,
  isCoalitionMember,
  isLocalParty,
}: PartyCardProps) {
  return (
    <Link href={`/partier/${slug}`} className="card card-hover group flex flex-col gap-3 p-5">
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: colorHex }}
        >
          {shortName}
        </span>
        <div className="min-w-0">
          <div className="truncate font-medium">{name}</div>
          <div className="flex flex-wrap gap-1.5 pt-0.5 text-xs">
            {seats !== undefined && (
              <span className="text-muted-light dark:text-muted-dark">{seats} mandat</span>
            )}
            {isCoalitionMember && (
              <span className="pill bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                Styrande
              </span>
            )}
            {isLocalParty && (
              <span className="pill bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                Lokalparti
              </span>
            )}
          </div>
        </div>
        <ArrowRight
          size={16}
          className="ml-auto shrink-0 self-start text-muted-light opacity-0 transition-opacity group-hover:opacity-100 dark:text-muted-dark"
        />
      </div>
      <p className="line-clamp-3 text-sm text-muted-light dark:text-muted-dark">{description}</p>
    </Link>
  );
}
