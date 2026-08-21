import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getPledgeTopics } from "@/lib/queries/pledges";

const HIGHLIGHTS = [
  "Kommunhuset/gymnasiet byggdes trots ett nej i 2024 års folkomröstning — kommunfullmäktige röstade 25–20 för att fortsätta bygget.",
  "Kommunalskatten sänktes till 2026, men bara med 10 öre (19,64 → 19,54 kr) — en fjärdedel av de 40 öre Kristdemokraterna utlovade 2022.",
  "Ingen privatisering av äldreomsorgen skedde, som M, S, C, MP och Fokus alla ville — men revisionen riktade ändå en formell anmärkning mot socialnämnden för kvalitetsbrister 2024.",
  "Två folkomröstningar hölls faktiskt 2024, trots att de flesta partier sagt nej till fler omröstningar 2022 — men de kom via medborgarnas eget folkinitiativ, inte partipolitik.",
  "S och Fokus Bjärred prioriterade mindre klasser/grupper 2022 — istället stängdes två skolor (Strandskolan, Löddesnässkolan) 2025 och eleverna slogs samman i större enheter.",
];

export default async function Valkompass2022Page() {
  const topics = await getPledgeTopics();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Valkompass 2022</h1>
        <p className="mt-1 text-muted-light dark:text-muted-dark">
          Vad partierna svarade i SVT:s lokala valkompass inför valet 2022 &mdash; 15 konkreta frågor om Lomma
          kommun. Välj en fråga för att se alla partiers svar bredvid varandra, inklusive vad som faktiskt
          hände på de punkter vi kunnat verifiera mot kommunfullmäktiges protokoll. Vänsterpartiet deltog
          inte i den lokala valkompassen och saknas därför här.
        </p>
      </div>

      <div className="card p-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-light dark:text-muted-dark">
          Löfte mot verklighet &mdash; det viktigaste vi hittat
        </h2>
        <ul className="flex flex-col gap-3">
          {HIGHLIGHTS.map((h) => (
            <li key={h} className="flex gap-2 text-sm text-ink-light dark:text-ink-dark">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-muted-light dark:text-muted-dark" />
              {h}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {topics.map((topic) => (
          <Link
            key={topic.topicSlug}
            href={`/valkompass-2022/${topic.topicSlug}`}
            className="card card-hover flex items-center justify-between gap-3 p-5"
          >
            <span className="font-medium">{topic.topic}</span>
            <div className="flex shrink-0 items-center gap-2">
              {topic.hasOutcome && (
                <span className="pill bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  Uppföljt
                </span>
              )}
              <ArrowRight size={16} className="text-muted-light dark:text-muted-dark" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
