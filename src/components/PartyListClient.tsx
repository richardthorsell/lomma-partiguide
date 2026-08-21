"use client";

import { useMemo, useState } from "react";
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Sök parti eller förkortning..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-xs rounded-md border border-stone-300 px-3 py-2 text-sm"
        />
        <div className="flex gap-1">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                filter === opt.value ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-stone-500">Inga partier matchar din sökning.</p>
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
