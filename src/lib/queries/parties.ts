import { db } from "@/lib/db";

export async function getLatestElectionPeriod() {
  return db.electionPeriod.findFirst({ orderBy: { year: "desc" } });
}

export async function getAllParties() {
  const latestPeriod = await getLatestElectionPeriod();
  return db.party.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      mandates: latestPeriod ? { where: { electionPeriodId: latestPeriod.id } } : true,
    },
  });
}

export async function getPartyFacts(slug: string) {
  const party = await db.party.findUnique({
    where: { slug },
    include: {
      mandates: { include: { electionPeriod: true }, orderBy: { electionPeriod: { year: "desc" } } },
      people: { orderBy: { isNotable: "desc" } },
      policyPositions: { include: { issueArea: true }, orderBy: { issueArea: { sortOrder: "asc" } } },
      newsItems: { include: { newsItem: true }, orderBy: { newsItem: { publishedAt: "desc" } }, take: 5 },
      socialPosts: { orderBy: { publishedAt: "desc" }, take: 5 },
    },
  });
  return party;
}

export async function getPartiesBySlug(slugs: string[]) {
  const latestPeriod = await getLatestElectionPeriod();
  return db.party.findMany({
    where: { slug: { in: slugs } },
    include: {
      mandates: latestPeriod ? { where: { electionPeriodId: latestPeriod.id } } : true,
      policyPositions: { include: { issueArea: true }, orderBy: { issueArea: { sortOrder: "asc" } } },
    },
  });
}
