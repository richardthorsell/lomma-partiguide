import { getAllNews } from "@/lib/queries/news";
import { getAllParties } from "@/lib/queries/parties";
import { NewsCard } from "@/components/NewsCard";
import Link from "next/link";

export default async function NyheterPage({ searchParams }: { searchParams: { parti?: string } }) {
  const [news, parties] = await Promise.all([getAllNews(searchParams.parti), getAllParties()]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Nyheter</h1>
        <p className="mt-1 text-muted-light dark:text-muted-dark">
          Lokalpolitiska nyheter kopplade till partierna i Lomma.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 text-sm">
        <Link
          href="/nyheter"
          className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
            !searchParams.parti
              ? "bg-ink-light text-canvas-light dark:bg-ink-dark dark:text-canvas-dark"
              : "border border-border-light text-muted-light hover:text-ink-light dark:border-border-dark dark:text-muted-dark dark:hover:text-ink-dark"
          }`}
        >
          Alla
        </Link>
        {parties.map((party) => {
          const isActive = searchParams.parti === party.slug;
          return (
            <Link
              key={party.slug}
              href={`/nyheter?parti=${party.slug}`}
              className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
                isActive
                  ? "text-white"
                  : "border border-border-light text-muted-light hover:text-ink-light dark:border-border-dark dark:text-muted-dark dark:hover:text-ink-dark"
              }`}
              style={isActive ? { backgroundColor: party.colorHex } : undefined}
            >
              {party.shortName}
            </Link>
          );
        })}
      </div>

      {news.length === 0 ? (
        <p className="text-muted-light dark:text-muted-dark">Inga nyheter hittades.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {news.map((item) => (
            <NewsCard
              key={item.id}
              title={item.title}
              url={item.url}
              sourceName={item.sourceName}
              publishedAt={item.publishedAt}
              summary={item.summary}
              details={item.details}
              sentiment={item.sentiment}
              parties={item.parties.map(({ party }) => ({
                slug: party.slug,
                shortName: party.shortName,
                colorHex: party.colorHex,
              }))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
