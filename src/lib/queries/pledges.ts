import { db } from "@/lib/db";

export async function getPledgesForParty(partySlug: string, year = 2022) {
  return db.electionPledge.findMany({
    where: { party: { slug: partySlug }, electionPeriod: { year } },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getPledgeTopics(year = 2022) {
  const pledges = await db.electionPledge.findMany({
    where: { electionPeriod: { year } },
    orderBy: { sortOrder: "asc" },
    select: { topicSlug: true, topic: true, sortOrder: true, outcomeStatus: true },
  });
  const byTopic = new Map<string, { topicSlug: string; topic: string; sortOrder: number; hasOutcome: boolean }>();
  for (const p of pledges) {
    const existing = byTopic.get(p.topicSlug);
    const hasOutcome = p.outcomeStatus !== "NOT_VERIFIED";
    if (!existing) {
      byTopic.set(p.topicSlug, { topicSlug: p.topicSlug, topic: p.topic, sortOrder: p.sortOrder, hasOutcome });
    } else if (hasOutcome) {
      existing.hasOutcome = true;
    }
  }
  return Array.from(byTopic.values()).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getPledgesByTopic(topicSlug: string, year = 2022) {
  return db.electionPledge.findMany({
    where: { topicSlug, electionPeriod: { year } },
    include: { party: true },
    orderBy: { party: { sortOrder: "asc" } },
  });
}
