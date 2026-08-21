"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PartyCard } from "@/components/PartyCard";

export type PartyListItem = {
  slug: string;
  name: string;
  shortName: string;
  colorHex: string;
  description: string;
  seats: number;
  isCoalitionMember: boolean;
  isLocalParty: boolean;
};

type Filter = "all" | "coalition" | "opposition" | "local";

export function PartyListClient({ parties }: { parties: PartyListItem[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    return parties.filter((party) => {
      const matchesQuery =
        query.trim().length === 0 ||
        party.name.toLowerCase().includes(query.toLowerCase()) ||
        party.shortName.toLowerCase().includes(query.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "coalition" && party.isCoalitionMember) ||
        (filter === "opposition" && !party.isCoalitionMember) ||
        (filter === "local" && party.isLocalParty);

      return matchesQuery && matchesFilter;
    });
  }, [parties, query, filter]);

  const filterOptions: { value: Filter; label: string }[] = [
    { value: "all", label: "Alla" },
    { value: "coalition", label: "Styrande" },
    { value: "opposition", label: "Opposition" },
    { value: "local", label: "Lokalparti" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark" />
          <input
            type="text"
            placeholder="Sök parti eller förkortning..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full border border-border-light bg-surface-light py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-brand-400 dark:border-border-dark dark:bg-surface-dark"
          />
        </div>
        <div className="flex gap-1 rounded-full border border-border-light p-1 dark:border-border-dark">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filter === opt.value
                  ? "bg-ink-light text-canvas-light dark:bg-ink-dark dark:text-canvas-dark"
                  : "text-muted-light hover:text-ink-light dark:text-muted-dark dark:hover:text-ink-dark"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-light dark:text-muted-dark">{filtered.length} partier</span>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-light dark:text-muted-dark">Inga partier matchar din sökning.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((party) => (
            <PartyCard key={party.slug} {...party} />
          ))}
        </div>
      )}
    </div>
  );
}
