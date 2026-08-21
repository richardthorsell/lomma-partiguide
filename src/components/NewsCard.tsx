type NewsCardProps = {
  title: string;
  url: string;
  sourceName: string;
  publishedAt: Date;
  summary: string;
  sentiment?: "POSITIVE" | "NEUTRAL" | "NEGATIVE" | null;
  parties: { slug: string; shortName: string; colorHex: string }[];
};

const SENTIMENT_LABEL: Record<string, string> = {
  POSITIVE: "Positiv ton",
  NEUTRAL: "Neutral ton",
  NEGATIVE: "Kritisk ton",
};

export function NewsCard({ title, url, sourceName, publishedAt, summary, sentiment, parties }: NewsCardProps) {
  return (
    <article className="rounded-lg border border-stone-200 bg-white p-4">
      <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-stone-500">
        <span>{sourceName}</span>
        <span>&middot;</span>
        <time dateTime={publishedAt.toISOString()}>
          {publishedAt.toLocaleDateString("sv-SE")}
        </time>
        {sentiment && (
          <>
            <span>&middot;</span>
            <span>{SENTIMENT_LABEL[sentiment]}</span>
          </>
        )}
      </div>
      <h3 className="mb-1 font-medium">
        <a href={url} target="_blank" rel="noreferrer" className="hover:underline">
          {title}
        </a>
      </h3>
      <p className="mb-2 text-sm text-stone-600">{summary}</p>
      {parties.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {parties.map((party) => (
            <span
              key={party.slug}
              className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
              style={{ backgroundColor: party.colorHex }}
            >
              {party.shortName}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
