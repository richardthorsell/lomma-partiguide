type IssuePositionBlockProps = {
  issueAreaName: string;
  summary: string;
  details?: string | null;
  sourceUrl?: string | null;
};

export function IssuePositionBlock({ issueAreaName, summary, details, sourceUrl }: IssuePositionBlockProps) {
  return (
    <div className="card p-5">
      <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-light dark:text-muted-dark">
        {issueAreaName}
      </h4>
      <p className="text-sm leading-relaxed text-ink-light dark:text-ink-dark">{summary}</p>
      {details && <p className="mt-2 text-sm text-muted-light dark:text-muted-dark">{details}</p>}
      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-xs text-muted-light underline decoration-dotted underline-offset-2 hover:text-ink-light dark:text-muted-dark dark:hover:text-ink-dark"
        >
          Källa
        </a>
      )}
    </div>
  );
}
