import { db } from "@/lib/db";

export async function getAllNews(partySlug?: string) {
  return db.newsItem.findMany({
    where: partySlug ? { parties: { some: { party: { slug: partySlug } } } } : undefined,
    include: { parties: { include: { party: true } } },
    orderBy: { publishedAt: "desc" },
  });
}
