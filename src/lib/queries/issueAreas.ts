import { db } from "@/lib/db";

export async function getAllIssueAreas() {
  return db.issueArea.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getIssueAreaWithPositions(slug: string) {
  return db.issueArea.findUnique({
    where: { slug },
    include: {
      policyPositions: {
        include: { party: true },
        orderBy: { party: { sortOrder: "asc" } },
      },
    },
  });
}
