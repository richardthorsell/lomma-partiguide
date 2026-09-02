export type Stance = -1 | 0 | 1;

export type QuizQuestion = {
  id: string;
  category: string;
  statement: string;
  /** Bakgrund/källa till hur partiets hållning kodats. */
  basis: string;
  /** Party slug -> stance (-1 = håller inte med, 0 = neutral/blandat, 1 = håller med) */
  stances: Record<string, Stance>;
};

// Partiernas hållning här är kodad utifrån läget 2026: dels dokumenterade voteringar i
// kommunfullmäktige/kommunstyrelsen 2024–2026 (se /nyheter och /valkompass-2022 för källor), dels
// senast kända ståndpunkter från 2022 där ingen omsvängning har kunnat beläggas.
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "skolatertstart",
    category: "Skola",
    statement: "Strandskolan och Löddesnässkolan bör öppnas igen som skolor.",
    basis:
      "M, C och KD har röstat för stängning och mot återöppning i flera voteringar 2025–2026 (KS 2025-06-18, KF 2025-10-16, KS 2026-04-22, KF 2026-05-07). S, L, MP, SD och Fokus Bjärred har konsekvent röstat eller reserverat sig för att skolorna ska vara kvar eller öppnas igen.",
    stances: { m: -1, s: 1, c: -1, l: 1, kd: -1, mp: 1, sd: 1, "fokus-bjarred": 1 },
  },
  {
    id: "hyresratter",
    category: "Bostäder",
    statement: "Kravet på hyresrätter i nyproduktion bör höjas till minst 20 % (dubbelt dagens minimum).",
    basis:
      "Kommunens riktlinje ligger på ett minimikrav om 10 %. Baserat på partiernas 2022-positioner och att ingen omsvängning hittats.",
    stances: { m: -1, s: 1, c: -1, l: 1, kd: -1, mp: 1, sd: -1, "fokus-bjarred": 1 },
  },
  {
    id: "laddstolpar",
    category: "Miljö & klimat",
    statement: "Kommunen bör själv satsa mer på laddinfrastruktur, istället för att förlita sig på marknaden.",
    basis:
      "M Sveriges jämförelse (mars 2026) visar att Lommas laddinfrastruktur inte hållit jämna steg med antalet elbilar. Baserat på partiernas 2022-positioner om marknad vs. kommunalt ansvar.",
    stances: { m: -1, s: 0, c: -1, l: 0, kd: 1, mp: 1, sd: -1, "fokus-bjarred": -1 },
  },
  {
    id: "kommunalskatt",
    category: "Ekonomi",
    statement: "Kommunalskatten (19,54 kr sedan 2026) bör sänkas ytterligare.",
    basis:
      "Budgetomröstningen 2025-11-13 (23–21) fastställde en sänkning med bara 10 öre. M, KD och Fokus ville sänka mer; S och MP röstade för att behålla den högre nivån.",
    stances: { m: 1, s: -1, c: 0, l: 0, kd: 1, mp: -1, sd: 0, "fokus-bjarred": 1 },
  },
  {
    id: "privat-aldreomsorg",
    category: "Äldreomsorg",
    statement: "Äldreomsorgen bör kunna drivas av privata utförare, trots 2024 års revisionsanmärkning om kvalitetsbrister.",
    basis: "Baserat på partiernas 2022-positioner; ingen omsvängning har hittats efter revisionsanmärkningen.",
    stances: { m: -1, s: -1, c: -1, l: 1, kd: 0, mp: -1, sd: 0, "fokus-bjarred": -1 },
  },
  {
    id: "folkomrostningar",
    category: "Demokrati",
    statement: "Fler frågor bör avgöras genom folkomröstning, som de två 2024 som M/C/KD försökte blockera men som ändå genomfördes.",
    basis:
      "KF 2024-03-14: M, C och KD (och till en början L) röstade för att blockera folkinitiativens omröstningar, men saknade den kvalificerade majoritet som krävs. Sandra Pilemalm (då L) bröt sig loss och röstade för att tillåta den andra omröstningen.",
    stances: { m: -1, s: 0, c: -1, l: 1, kd: -1, mp: 0, sd: 0, "fokus-bjarred": 0 },
  },
  {
    id: "cykel-kollektivtrafik",
    category: "Trafik",
    statement: "Cykel och kollektivtrafik ska fortsatt prioriteras, i linje med den nyinvigda supercykelvägen Lomma–Lund.",
    basis: "Supercykelvägen (C21) invigdes 2025-09-13. Baserat på partiernas 2022-positioner om cykel/kollektivtrafik.",
    stances: { m: 0, s: 1, c: 0, l: 1, kd: 1, mp: 1, sd: -1, "fokus-bjarred": 0 },
  },
  {
    id: "sex-timmar",
    category: "Äldreomsorg",
    statement: "Sex timmars arbetsdag bör prövas i den kommunala äldreomsorgen.",
    basis: "Baserat på partiernas 2022-positioner; inget försök har hittats i Lomma 2023–2026.",
    stances: { m: -1, s: 0, c: 0, l: -1, kd: -1, mp: 0, sd: 0, "fokus-bjarred": -1 },
  },
];

export function computeMatches(
  answers: Record<string, Stance | undefined>,
  partySlugs: string[]
): { slug: string; pct: number; answered: number }[] {
  return partySlugs
    .map((slug) => {
      let scoreSum = 0;
      let answered = 0;
      for (const q of QUIZ_QUESTIONS) {
        const userStance = answers[q.id];
        if (userStance === undefined) continue;
        const partyStance = q.stances[slug];
        if (partyStance === undefined) continue;
        answered += 1;
        // 2 = exakt match, 1 = ett steg ifrån, 0 = rakt motsatt
        scoreSum += 2 - Math.abs(userStance - partyStance);
      }
      const pct = answered > 0 ? Math.round((scoreSum / (answered * 2)) * 100) : 0;
      return { slug, pct, answered };
    })
    .sort((a, b) => b.pct - a.pct);
}
