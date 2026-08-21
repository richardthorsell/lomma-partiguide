export default function OmPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Om tjänsten</h1>
      <div className="card flex flex-col gap-4 p-6 text-ink-light dark:text-ink-dark">
        <p>
          Lomma Partiguide är ett oberoende, privat researchprojekt inför kommunvalet 2026. Tjänsten är inte
          kopplad till Lomma kommun, Valmyndigheten eller något politiskt parti.
        </p>
        <p>
          Grundfakta och mandatfördelning för 2022 är hämtade från SVT Nyheters valresultattjänst och
          Lomma kommuns officiella sida för mandatfördelning, med Valmyndigheten som ursprunglig källa.
          Partiernas beskrivningar, sakfrågepositioner och nyheter är manuellt sammanställda från respektive
          partis egna webbplatser och lokala nyhetskällor under augusti 2026.
        </p>
        <p>
          Underlaget är ofullständigt för vissa partier &mdash; där lokal information saknades är det tydligt
          markerat i partiets sakfrågor. Facebook-inlägg samlas ännu inte in strukturerat i denna version.
        </p>
        <p className="text-sm text-muted-light dark:text-muted-dark">Senast uppdaterad: 21 augusti 2026.</p>
      </div>
    </div>
  );
}
