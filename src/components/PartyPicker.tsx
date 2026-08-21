"use client";

import { useRouter, useSearchParams } from "next/navigation";

type PartyOption = { slug: string; shortName: string; colorHex: string };

export function PartyPicker({ options, selected }: { options: PartyOption[]; selected: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function toggle(slug: string) {
    const next = selected.includes(slug) ? selected.filter((s) => s !== slug) : [...selected, slug];
    const params = new URLSearchParams(searchParams.toString());
    if (next.length > 0) {
      params.set("p", next.join(","));
    } else {
      params.delete("p");
    }
    router.push(`/jamfor?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((party) => {
        const isSelected = selected.includes(party.slug);
        return (
          <button
            key={party.slug}
            onClick={() => toggle(party.slug)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
              isSelected
                ? "text-white shadow-sm"
                : "border-border-light bg-surface-light text-ink-light hover:border-stone-400 dark:border-border-dark dark:bg-surface-dark dark:text-ink-dark dark:hover:border-stone-500"
            }`}
            style={isSelected ? { backgroundColor: party.colorHex, borderColor: party.colorHex } : undefined}
          >
            {party.shortName}
          </button>
        );
      })}
    </div>
  );
}
