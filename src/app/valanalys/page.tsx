import { getAllParties } from "@/lib/queries/parties";
import { ValAnalysQuiz } from "@/components/ValAnalysQuiz";

export default async function ValanalysPage() {
  const parties = await getAllParties();
  const options = parties
    .filter((p) => (p.mandates[0]?.seats ?? 0) > 0)
    .map((p) => ({ slug: p.slug, shortName: p.shortName, name: p.name, colorHex: p.colorHex }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 inline-block rounded-full border border-border-light bg-surface-light px-3 py-1 text-xs font-medium text-muted-light dark:border-border-dark dark:bg-surface-dark dark:text-muted-dark">
          8 frågor, tar ~1 minut
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Valanalys &mdash; hitta ditt parti</h1>
        <p className="mt-2 max-w-2xl text-muted-light dark:text-muted-dark">
          Svara på ett urval sakfrågor och se vilket parti i Lomma kommunfullmäktige som ligger närmast dina
          åsikter, baserat på partiernas svar i SVT:s lokala Valkompass 2022.
        </p>
      </div>

      <ValAnalysQuiz parties={options} />
    </div>
  );
}
