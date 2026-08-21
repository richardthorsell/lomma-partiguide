type IssuePositionBlockProps = {
  issueAreaName: string;
  summary: string;
  details?: string | null;
  sourceUrl?: string | null;
};

export function IssuePositionBlock({ issueAreaName, summary, details, sourceUrl }: IssuePositionBlockProps) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <h4 className="mb-1 text-sm font-semibold text-stone-500">{issueAreaName}</h4>
      <p className="text-sm text-stone-800">{summary}</p>
      {details && <p className="mt-1 text-sm text-stone-500">{details}</p>}
      {sourceUrl && (
        <a href={sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-stone-400 hover:underline">
          Källa
        </a>
      )}
    </div>
  );
}
