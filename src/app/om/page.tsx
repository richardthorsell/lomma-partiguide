import Link from "next/link";

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
          Uppgifter om vilka som sitter i kommunfullmäktige, kommunstyrelsen och kommunens nämnder är hämtade
          direkt från kommunens officiella förtroendemannaregister (Troman) och visas under{" "}
          <Link href="/namnder" className="underline">
            Nämnder
          </Link>
          .
        </p>
        <p>
          Under{" "}
          <Link href="/nyheter" className="underline">
            Nyheter
          </Link>{" "}
          och{" "}
          <Link href="/valkompass-2022" className="underline">
            Vallöften 2022
          </Link>{" "}
          redovisar vi konkreta voteringsresultat och enskilda ledamöters röster i utvalda, särskilt
          omdebatterade ärenden (t.ex. skolstängningar och folkomröstningarna) &mdash; hämtade direkt ur
          kommunfullmäktiges och nämndernas justerade sammanträdesprotokoll. Det är inte en fullständig,
          systematisk sammanställning av varje enskild omröstning i varje ärende sedan 2022 &mdash; det
          skulle kräva att gå igenom tusentals sidor protokoll &mdash; utan ett urval av de ärenden som
          bedömts mest relevanta för att följa upp partiernas vallöften.
        </p>
        <p>
          Underlaget är ofullständigt för vissa partier och sakfrågor &mdash; där information saknas eller
          inte gått att verifiera är det tydligt markerat (till exempel som &quot;Oklart&quot; eller
          &quot;Inte verifierat&quot; under Vallöften 2022). Vissa nämnder har själva inte publicerat
          fullständiga protokoll för hela perioden 2022&ndash;2025, vilket också begränsar vad som går att
          verifiera. Facebook-inlägg samlas ännu inte in strukturerat i denna version.
        </p>
        <p>
          Researcharbetet &mdash; sökning, läsning av protokoll och sammanställning av data &mdash; har
          utförts med hjälp av en AI-assistent (Claude, Anthropic) under mänsklig styrning och granskning.
          Källor anges genomgående så att varje uppgift går att kontrollera mot originalet.
        </p>
        <p className="text-sm text-muted-light dark:text-muted-dark">Senast uppdaterad: 25 augusti 2026.</p>
      </div>
    </div>
  );
}
