/**
 * Fetches raw source material for manual review — does NOT write to the database
 * or the seed JSON directly. Run this, read the output in data/sources/, and
 * hand-curate anything useful into data/seed/**.json (same as the initial research).
 *
 * Only fetches public, unauthenticated pages that were already referenced as
 * `websiteUrl` in the party seed files, plus Lomma kommun's public news archive.
 * Facebook (or any source requiring login) is intentionally never touched here —
 * see README.md "Kända begränsningar" for why.
 */
import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import * as cheerio from "cheerio";

const SEED_DIR = join(__dirname, "..", "data", "seed");
const OUT_DIR = join(__dirname, "..", "data", "sources");
const USER_AGENT = "LommaPartiguideResearchBot/0.1 (+https://github.com/richardthorsell/lomma-partiguide; personligt researchprojekt, ej kommersiellt)";
const REQUEST_DELAY_MS = 800;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function isAllowedByRobots(url: string): Promise<boolean> {
  try {
    const { origin, pathname } = new URL(url);
    const res = await fetch(`${origin}/robots.txt`, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) return true; // no robots.txt -> assume allowed
    const text = await res.text();
    const lines = text.split("\n").map((l) => l.trim());
    let applies = false;
    for (const line of lines) {
      if (/^user-agent:\s*\*/i.test(line)) applies = true;
      else if (/^user-agent:/i.test(line)) applies = false;
      else if (applies && /^disallow:/i.test(line)) {
        const disallowedPath = line.split(":")[1]?.trim();
        if (disallowedPath && disallowedPath !== "" && pathname.startsWith(disallowedPath)) {
          return false;
        }
      }
    }
    return true;
  } catch {
    return true;
  }
}

async function fetchAsText(url: string): Promise<string | null> {
  const allowed = await isAllowedByRobots(url);
  if (!allowed) {
    console.warn(`  Överhoppad (robots.txt förbjuder): ${url}`);
    return null;
  }
  try {
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) {
      console.warn(`  HTTP ${res.status} för ${url}`);
      return null;
    }
    const html = await res.text();
    const $ = cheerio.load(html);
    $("script, style, noscript, svg, nav, footer").remove();
    const text = $("body").text().replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
    return text;
  } catch (err) {
    console.warn(`  Fel vid hämtning av ${url}: ${(err as Error).message}`);
    return null;
  }
}

async function fetchPartyWebsites() {
  console.log("Hämtar partiernas webbplatser...");
  if (!existsSync(join(OUT_DIR, "parties"))) mkdirSync(join(OUT_DIR, "parties"), { recursive: true });

  const partyFiles = readdirSync(join(SEED_DIR, "parties")).filter((f) => f.endsWith(".json"));
  for (const file of partyFiles) {
    const party = JSON.parse(readFileSync(join(SEED_DIR, "parties", file), "utf-8"));
    if (!party.websiteUrl) continue;

    console.log(`- ${party.name} (${party.websiteUrl})`);
    const text = await fetchAsText(party.websiteUrl);
    if (text) {
      writeFileSync(join(OUT_DIR, "parties", `${party.slug}.txt`), `Källa: ${party.websiteUrl}\nHämtad: ${new Date().toISOString()}\n\n${text}`);
    }
    await sleep(REQUEST_DELAY_MS);
  }
}

async function fetchNewsArchive() {
  console.log("Hämtar Lomma kommuns nyhetsarkiv...");
  const url = "https://lomma.se/nyhetsarkiv/nyhetsarkiv.2219.html";
  const allowed = await isAllowedByRobots(url);
  if (!allowed) {
    console.warn(`  Överhoppad (robots.txt förbjuder): ${url}`);
    return;
  }

  try {
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) {
      console.warn(`  HTTP ${res.status} för ${url}`);
      return;
    }
    const html = await res.text();
    const $ = cheerio.load(html);
    const items: { title: string; url: string }[] = [];
    $("a").each((_, el) => {
      const href = $(el).attr("href");
      const title = $(el).text().trim();
      if (href && title && /nyheter|nyhetsarkiv/i.test(href) && title.length > 8) {
        const absoluteUrl = href.startsWith("http") ? href : new URL(href, url).toString();
        items.push({ title, url: absoluteUrl });
      }
    });
    const unique = Array.from(new Map(items.map((i) => [i.url, i])).values());
    writeFileSync(join(OUT_DIR, "news-archive.json"), JSON.stringify(unique, null, 2));
    console.log(`  Hittade ${unique.length} artikellänkar.`);
  } catch (err) {
    console.warn(`  Fel vid hämtning av nyhetsarkivet: ${(err as Error).message}`);
  }
}

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  await fetchPartyWebsites();
  await sleep(REQUEST_DELAY_MS);
  await fetchNewsArchive();
  console.log("\nKlart. Läs igenom data/sources/ manuellt och för in det som är relevant i data/seed/**.json.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
