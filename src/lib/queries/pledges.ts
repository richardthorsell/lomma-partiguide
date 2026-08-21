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
    distinct: ["topicSlug"],
    orderBy: { sortOrder: "asc" },
    select: { topicSlug: true, topic: true, sortOrder: true },
  });
  return pledges;
}

export async function getPledgesByTopic(topicSlug: string, year = 2022) {
  return db.electionPledge.findMany({
    where: { topicSlug, electionPeriod: { year } },
    include: { party: true },
    orderBy: { party: { sortOrder: "asc" } },
  });
}
