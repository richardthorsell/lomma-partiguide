export type Stance = -1 | 0 | 1;

export type QuizQuestion = {
  id: string;
  category: string;
  statement: string;
  /** Party slug -> stance (-1 = håller inte med, 0 = neutral/blandat, 1 = håller med) */
  stances: Record<string, Stance>;
};

// Partiernas hållning är kodad utifrån deras svar i SVT:s lokala Valkompass 2022 (senast kända
// positioner). Se /valkompass-2022 för de fullständiga svaren och källor.
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "hyresratter",
    category: "Bostäder",
    statement: "Nyproduktion av bostäder bör ha krav på minst 20 % hyresrätter.",
    stances: { m: -1, s: 1, c: -1, l: 1, kd: -1, mp: 1, sd: -1, "fokus-bjarred": 1 },
  },
  {
    id: "cykel-kollektivtrafik",
    category: "Trafik",
    statement: "Cykel och kollektivtrafik ska vara förstahandsvalet, även om bilismen får stå tillbaka.",
    stances: { m: 0, s: 1, c: 0, l: 1, kd: 1, mp: 1, sd: -1, "fokus-bjarred": 0 },
  },
  {
    id: "folkomrostningar",
    category: "Demokrati",
    statement: "Kommunen bör hålla fler folkomröstningar för att öka medborgarinflytandet.",
    stances: { m: -1, s: 0, c: -1, l: 1, kd: -1, mp: -1, sd: 0, "fokus-bjarred": 0 },
  },
  {
    id: "privat-aldreomsorg",
    category: "Äldreomsorg",
    statement: "Äldreomsorgen bör kunna drivas av privata utförare, inte bara av kommunen.",
    stances: { m: -1, s: -1, c: -1, l: 1, kd: 0, mp: -1, sd: 0, "fokus-bjarred": -1 },
  },
  {
    id: "laddstolpar",
    category: "Miljö & klimat",
    statement: "Kommunen bör själv bygga ut fler publika laddstolpar för elbilar.",
    stances: { m: -1, s: 0, c: -1, l: 0, kd: 1, mp: 1, sd: -1, "fokus-bjarred": -1 },
  },
  {
    id: "flyktingmottagande",
    category: "Integration",
    statement: "Lomma bör ta emot färre nyanlända/flyktingar.",
    stances: { m: 0, s: -1, c: 0, l: -1, kd: 0, mp: -1, sd: 0, "fokus-bjarred": -1 },
  },
  {
    id: "sex-timmar",
    category: "Äldreomsorg",
    statement: "Kommunen bör pröva sex timmars arbetsdag i äldreomsorgen.",
    stances: { m: -1, s: 0, c: 0, l: -1, kd: -1, mp: 0, sd: 0, "fokus-bjarred": -1 },
  },
  {
    id: "kommunalskatt",
    category: "Ekonomi",
    statement: "Kommunalskatten bör sänkas.",
    stances: { m: 1, s: 0, c: 0, l: 0, kd: 1, mp: 0, sd: 0, "fokus-bjarred": 1 },
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
