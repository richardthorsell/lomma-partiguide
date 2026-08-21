import Link from "next/link";

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
    <Link
      href={`/partier/${slug}`}
      className="flex flex-col gap-2 rounded-lg border border-stone-200 bg-white p-4 transition hover:border-stone-400"
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: colorHex }}
        >
          {shortName}
        </span>
        <div>
          <div className="font-medium">{name}</div>
          <div className="flex gap-2 text-xs text-stone-500">
            {seats !== undefined && <span>{seats} mandat</span>}
            {isCoalitionMember && <span className="text-emerald-700">Styrande</span>}
            {isLocalParty && <span>Lokalparti</span>}
          </div>
        </div>
      </div>
      <p className="line-clamp-3 text-sm text-stone-600">{description}</p>
    </Link>
  );
}
