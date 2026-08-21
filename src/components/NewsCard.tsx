type NewsCardProps = {
  title: string;
  url: string;
  sourceName: string;
  publishedAt: Date;
  summary: string;
  sentiment?: "POSITIVE" | "NEUTRAL" | "NEGATIVE" | null;
  parties: { slug: string; shortName: string; colorHex: string }[];
};

const SENTIMENT_DOT: Record<string, string> = {
  POSITIVE: "bg-emerald-500",
  NEUTRAL: "bg-stone-400",
  NEGATIVE: "bg-rose-500",
};

const SENTIMENT_LABEL: Record<string, string> = {
  POSITIVE: "Positiv ton",
  NEUTRAL: "Neutral ton",
  NEGATIVE: "Kritisk ton",
};

export function NewsCard({ title, url, sourceName, publishedAt, summary, sentiment, parties }: NewsCardProps) {
  return (
    <article className="card p-5">
      <div className="mb-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-light dark:text-muted-dark">
        <span>{sourceName}</span>
        <span>&middot;</span>
        <time dateTime={publishedAt.toISOString()}>{publishedAt.toLocaleDateString("sv-SE")}</time>
        {sentiment && (
          <>
            <span>&middot;</span>
            <span className="flex items-center gap-1">
              <span className={`h-1.5 w-1.5 rounded-full ${SENTIMENT_DOT[sentiment]}`} />
              {SENTIMENT_LABEL[sentiment]}
            </span>
          </>
        )}
      </div>
      <h3 className="mb-1.5 font-medium leading-snug">
        <a href={url} target="_blank" rel="noreferrer" className="hover:underline">
          {title}
        </a>
      </h3>
      <p className="mb-3 text-sm text-muted-light dark:text-muted-dark">{summary}</p>
      {parties.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {parties.map((party) => (
            <span
              key={party.slug}
              className="pill text-white"
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
