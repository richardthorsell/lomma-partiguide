"use client";

import { useState } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { QUIZ_QUESTIONS, computeMatches, type Stance } from "@/lib/quiz";

type PartyOption = { slug: string; shortName: string; name: string; colorHex: string };

const ANSWER_OPTIONS: { label: string; value: Stance }[] = [
  { label: "Håller inte med", value: -1 },
  { label: "Neutral / vet ej", value: 0 },
  { label: "Håller med", value: 1 },
];

export function ValAnalysQuiz({ parties }: { parties: PartyOption[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Stance>>({});
  const [showResults, setShowResults] = useState(false);

  const question = QUIZ_QUESTIONS[step];
  const isLast = step === QUIZ_QUESTIONS.length - 1;

  function answer(value: Stance) {
    const next = { ...answers, [question.id]: value };
    setAnswers(next);
    if (isLast) {
      setShowResults(true);
    } else {
      setStep((s) => s + 1);
    }
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setShowResults(false);
  }

  if (showResults) {
    const results = computeMatches(answers, parties.map((p) => p.slug));
    const partyBySlug = Object.fromEntries(parties.map((p) => [p.slug, p]));
    const top = results[0];

    return (
      <div className="flex flex-col gap-5">
        <div className="card p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-light dark:text-muted-dark">
            Ditt resultat
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            Du matchar mest med{" "}
            <span style={{ color: partyBySlug[top.slug]?.colorHex }}>{partyBySlug[top.slug]?.name}</span>
          </h2>
          <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">
            Baserat på dina {Object.keys(answers).length} svar, jämfört med partiernas svar i SVT:s lokala
            Valkompass 2022.
          </p>
        </div>

        <div className="card flex flex-col divide-y divide-border-light p-2 dark:divide-border-dark">
          {results.map((r) => {
            const party = partyBySlug[r.slug];
            if (!party) return null;
            return (
              <Link
                key={r.slug}
                href={`/partier/${r.slug}`}
                className="flex items-center gap-3 p-3 hover:bg-surface-light dark:hover:bg-surface-dark"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: party.colorHex }}
                >
                  {party.shortName}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 text-sm font-medium">
                    <span>{party.name}</span>
                    <span className="tabular-nums text-muted-light dark:text-muted-dark">{r.pct}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-light dark:bg-canvas-dark">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${r.pct}%`, backgroundColor: party.colorHex }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <p className="text-xs text-muted-light dark:text-muted-dark">
          Matchningen bygger på ett urval av 8 sakfrågor ur SVT:s lokala Valkompass 2022 &mdash; partiernas
          senast kända svar, som kan ha förändrats sedan dess. Läs mer om varje parti under{" "}
          <Link href="/valkompass-2022" className="underline">
            Vallöften 2022 &mdash; Vad hände?
          </Link>{" "}
          för att se om de faktiskt levt upp till sina svar.
        </p>

        <button
          type="button"
          onClick={restart}
          className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border-light px-3.5 py-2 text-sm font-medium hover:bg-surface-light dark:border-border-dark dark:hover:bg-surface-dark"
        >
          <RotateCcw size={14} /> Gör om testet
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="mb-2 flex items-center justify-between text-xs text-muted-light dark:text-muted-dark">
          <span>
            Fråga {step + 1} av {QUIZ_QUESTIONS.length}
          </span>
          <span>{question.category}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-light dark:bg-surface-dark">
          <div
            className="h-full rounded-full bg-brand-500 transition-all"
            style={{ width: `${((step + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="card p-6">
        <p className="text-lg font-medium leading-snug">{question.statement}</p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        {ANSWER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => answer(opt.value)}
            className="flex-1 rounded-xl border border-border-light px-4 py-3 text-sm font-medium transition-colors hover:border-brand-500 hover:bg-brand-50 dark:border-border-dark dark:hover:bg-brand-900/20"
          >
            {opt.label}
          </button>
        ))}
      </div>

      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="w-fit text-xs text-muted-light hover:underline dark:text-muted-dark"
        >
          &larr; Föregående fråga
        </button>
      )}
    </div>
  );
}
