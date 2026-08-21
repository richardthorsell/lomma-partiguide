import { db } from "@/lib/db";

export async function getAllCommittees() {
  return db.committee.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { memberships: true } } },
  });
}

export async function getCommitteeWithMembers(slug: string) {
  return db.committee.findUnique({
    where: { slug },
    include: {
      memberships: {
        include: { person: { include: { party: true } } },
        orderBy: { orderIndex: "asc" },
      },
    },
  });
}

export async function getCommitteeMembershipsForParty(partySlug: string) {
  return db.committeeMembership.findMany({
    where: { person: { party: { slug: partySlug } } },
    include: { committee: true, person: true },
    orderBy: [{ committee: { sortOrder: "asc" } }, { orderIndex: "asc" }],
  });
}
