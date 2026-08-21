import { getAllNews } from "@/lib/queries/news";
import { getAllParties } from "@/lib/queries/parties";
import { NewsCard } from "@/components/NewsCard";
import Link from "next/link";

export default async function NyheterPage({ searchParams }: { searchParams: { parti?: string } }) {
  const [news, parties] = await Promise.all([getAllNews(searchParams.parti), getAllParties()]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Nyheter</h1>
        <p className="text-stone-600">Lokalpolitiska nyheter kopplade till partierna i Lomma.</p>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <Link
          href="/nyheter"
          className={`rounded-full px-3 py-1 ${!searchParams.parti ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600"}`}
        >
          Alla
        </Link>
        {parties.map((party) => (
          <Link
            key={party.slug}
            href={`/nyheter?parti=${party.slug}`}
            className={`rounded-full px-3 py-1 ${searchParams.parti === party.slug ? "text-white" : "bg-stone-100 text-stone-600"}`}
            style={searchParams.parti === party.slug ? { backgroundColor: party.colorHex } : undefined}
          >
            {party.shortName}
          </Link>
        ))}
      </div>

      {news.length === 0 ? (
        <p className="text-stone-500">Inga nyheter hittades.</p>
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
