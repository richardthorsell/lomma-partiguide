import { PrismaClient } from "@prisma/client";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { z } from "zod";

const prisma = new PrismaClient();

const SEED_DIR = join(__dirname, "..", "data", "seed");

function readJson<T>(relativePath: string): T {
  const raw = readFileSync(join(SEED_DIR, relativePath), "utf-8");
  return JSON.parse(raw) as T;
}

const electionPeriodSchema = z.object({
  year: z.number().int(),
  termStart: z.string(),
  termEnd: z.string(),
  totalSeats: z.number().int(),
});

const issueAreaSchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  sortOrder: z.number().int(),
});

const personSchema = z.object({
  name: z.string(),
  role: z.enum(["ORDFORANDE", "KOMMUNALRAD", "GRUPPLEDARE", "LEDAMOT", "ERSATTARE"]),
  photoUrl: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  contactEmail: z.string().nullable().optional(),
  contactPhone: z.string().nullable().optional(),
  isNotable: z.boolean().optional(),
});

const policyPositionSchema = z.object({
  issueAreaSlug: z.string(),
  summary: z.string(),
  details: z.string().nullable().optional(),
  sourceUrl: z.string().nullable().optional(),
  lastUpdated: z.string(),
});

const partySchema = z.object({
  slug: z.string(),
  name: z.string(),
  shortName: z.string(),
  colorHex: z.string(),
  logoUrl: z.string().nullable().optional(),
  description: z.string(),
  ideologyTags: z.array(z.string()),
  websiteUrl: z.string().nullable().optional(),
  facebookUrl: z.string().nullable().optional(),
  instagramUrl: z.string().nullable().optional(),
  isLocalParty: z.boolean(),
  isCoalitionMember: z.boolean(),
  contactEmail: z.string().nullable().optional(),
  contactPhone: z.string().nullable().optional(),
  sortOrder: z.number().int(),
  mandate2022: z.object({
    seats: z.number().int(),
    voteCount: z.number().int().nullable().optional(),
    voteSharePct: z.number().nullable().optional(),
    sourceName: z.string(),
    sourceUrl: z.string(),
  }),
  people: z.array(personSchema),
  policyPositions: z.array(policyPositionSchema),
});

const newsItemSchema = z.object({
  title: z.string(),
  url: z.string(),
  sourceName: z.string(),
  publishedAt: z.string(),
  summary: z.string(),
  sentiment: z.enum(["POSITIVE", "NEUTRAL", "NEGATIVE"]).nullable().optional(),
  partySlugs: z.array(z.string()),
});

const socialPostSchema = z.object({
  partySlug: z.string(),
  platform: z.enum(["FACEBOOK", "INSTAGRAM", "X"]),
  postUrl: z.string(),
  publishedAt: z.string(),
  contentExcerpt: z.string(),
  likeCount: z.number().int().nullable().optional(),
  commentCount: z.number().int().nullable().optional(),
  shareCount: z.number().int().nullable().optional(),
});

async function main() {
  console.log("Seeding election periods...");
  const electionPeriods = readJson<unknown[]>("election-periods.json").map((p) =>
    electionPeriodSchema.parse(p)
  );
  const electionPeriodIdByYear = new Map<number, string>();
  for (const period of electionPeriods) {
    const row = await prisma.electionPeriod.upsert({
      where: { year: period.year },
      update: {
        termStart: new Date(period.termStart),
        termEnd: new Date(period.termEnd),
        totalSeats: period.totalSeats,
      },
      create: {
        year: period.year,
        termStart: new Date(period.termStart),
        termEnd: new Date(period.termEnd),
        totalSeats: period.totalSeats,
      },
    });
    electionPeriodIdByYear.set(period.year, row.id);
  }

  console.log("Seeding issue areas...");
  const issueAreas = readJson<unknown[]>("issue-areas.json").map((a) => issueAreaSchema.parse(a));
  const issueAreaIdBySlug = new Map<string, string>();
  for (const area of issueAreas) {
    const row = await prisma.issueArea.upsert({
      where: { slug: area.slug },
      update: { name: area.name, description: area.description ?? null, sortOrder: area.sortOrder },
      create: {
        slug: area.slug,
        name: area.name,
        description: area.description ?? null,
        sortOrder: area.sortOrder,
      },
    });
    issueAreaIdBySlug.set(area.slug, row.id);
  }

  console.log("Seeding parties...");
  const partyFiles = readdirSync(join(SEED_DIR, "parties")).filter((f) => f.endsWith(".json"));
  const partyIdBySlug = new Map<string, string>();

  for (const file of partyFiles) {
    const party = partySchema.parse(readJson<unknown>(join("parties", file)));

    const partyRow = await prisma.party.upsert({
      where: { slug: party.slug },
      update: {
        name: party.name,
        shortName: party.shortName,
        colorHex: party.colorHex,
        logoUrl: party.logoUrl ?? null,
        description: party.description,
        ideologyTags: party.ideologyTags,
        websiteUrl: party.websiteUrl ?? null,
        facebookUrl: party.facebookUrl ?? null,
        instagramUrl: party.instagramUrl ?? null,
        isLocalParty: party.isLocalParty,
        isCoalitionMember: party.isCoalitionMember,
        contactEmail: party.contactEmail ?? null,
        contactPhone: party.contactPhone ?? null,
        sortOrder: party.sortOrder,
      },
      create: {
        slug: party.slug,
        name: party.name,
        shortName: party.shortName,
        colorHex: party.colorHex,
        logoUrl: party.logoUrl ?? null,
        description: party.description,
        ideologyTags: party.ideologyTags,
        websiteUrl: party.websiteUrl ?? null,
        facebookUrl: party.facebookUrl ?? null,
        instagramUrl: party.instagramUrl ?? null,
        isLocalParty: party.isLocalParty,
        isCoalitionMember: party.isCoalitionMember,
        contactEmail: party.contactEmail ?? null,
        contactPhone: party.contactPhone ?? null,
        sortOrder: party.sortOrder,
      },
    });
    partyIdBySlug.set(party.slug, partyRow.id);

    const electionPeriodId = electionPeriodIdByYear.get(2022);
    if (!electionPeriodId) throw new Error("Missing 2022 election period");

    await prisma.mandate.upsert({
      where: {
        partyId_electionPeriodId: { partyId: partyRow.id, electionPeriodId },
      },
      update: {
        seats: party.mandate2022.seats,
        voteCount: party.mandate2022.voteCount ?? null,
        voteSharePct: party.mandate2022.voteSharePct ?? null,
        sourceName: party.mandate2022.sourceName,
        sourceUrl: party.mandate2022.sourceUrl,
      },
      create: {
        partyId: partyRow.id,
        electionPeriodId,
        seats: party.mandate2022.seats,
        voteCount: party.mandate2022.voteCount ?? null,
        voteSharePct: party.mandate2022.voteSharePct ?? null,
        sourceName: party.mandate2022.sourceName,
        sourceUrl: party.mandate2022.sourceUrl,
      },
    });

    // Replace people wholesale for this party (simplest idempotent approach for v1)
    await prisma.person.deleteMany({ where: { partyId: partyRow.id } });
    if (party.people.length > 0) {
      await prisma.person.createMany({
        data: party.people.map((p) => ({
          partyId: partyRow.id,
          name: p.name,
          role: p.role,
          photoUrl: p.photoUrl ?? null,
          bio: p.bio ?? null,
          contactEmail: p.contactEmail ?? null,
          contactPhone: p.contactPhone ?? null,
          isNotable: p.isNotable ?? false,
        })),
      });
    }

    for (const position of party.policyPositions) {
      const issueAreaId = issueAreaIdBySlug.get(position.issueAreaSlug);
      if (!issueAreaId) {
        throw new Error(
          `Unknown issueAreaSlug "${position.issueAreaSlug}" referenced by party "${party.slug}"`
        );
      }
      await prisma.policyPosition.upsert({
        where: {
          partyId_issueAreaId: { partyId: partyRow.id, issueAreaId },
        },
        update: {
          summary: position.summary,
          details: position.details ?? null,
          sourceUrl: position.sourceUrl ?? null,
          lastUpdated: new Date(position.lastUpdated),
        },
        create: {
          partyId: partyRow.id,
          issueAreaId,
          summary: position.summary,
          details: position.details ?? null,
          sourceUrl: position.sourceUrl ?? null,
          lastUpdated: new Date(position.lastUpdated),
        },
      });
    }
  }

  console.log("Seeding news items...");
  const newsItems = readJson<unknown[]>("news.json").map((n) => newsItemSchema.parse(n));
  for (const item of newsItems) {
    const newsRow = await prisma.newsItem.upsert({
      where: { url: item.url },
      update: {
        title: item.title,
        sourceName: item.sourceName,
        publishedAt: new Date(item.publishedAt),
        summary: item.summary,
        sentiment: item.sentiment ?? null,
      },
      create: {
        title: item.title,
        url: item.url,
        sourceName: item.sourceName,
        publishedAt: new Date(item.publishedAt),
        summary: item.summary,
        sentiment: item.sentiment ?? null,
      },
    });

    await prisma.newsItemParty.deleteMany({ where: { newsItemId: newsRow.id } });
    for (const slug of item.partySlugs) {
      const partyId = partyIdBySlug.get(slug);
      if (!partyId) throw new Error(`Unknown party slug "${slug}" referenced by news item "${item.title}"`);
      await prisma.newsItemParty.create({ data: { newsItemId: newsRow.id, partyId } });
    }
  }

  console.log("Seeding social posts...");
  const socialPosts = readJson<unknown[]>("social.json").map((s) => socialPostSchema.parse(s));
  for (const post of socialPosts) {
    const partyId = partyIdBySlug.get(post.partySlug);
    if (!partyId) throw new Error(`Unknown party slug "${post.partySlug}" referenced by social post`);
    await prisma.socialPost.upsert({
      where: { postUrl: post.postUrl },
      update: {
        partyId,
        platform: post.platform,
        publishedAt: new Date(post.publishedAt),
        contentExcerpt: post.contentExcerpt,
        likeCount: post.likeCount ?? null,
        commentCount: post.commentCount ?? null,
        shareCount: post.shareCount ?? null,
      },
      create: {
        partyId,
        platform: post.platform,
        postUrl: post.postUrl,
        publishedAt: new Date(post.publishedAt),
        contentExcerpt: post.contentExcerpt,
        likeCount: post.likeCount ?? null,
        commentCount: post.commentCount ?? null,
        shareCount: post.shareCount ?? null,
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
