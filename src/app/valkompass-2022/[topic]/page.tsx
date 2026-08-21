import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPledgesByTopic } from "@/lib/queries/pledges";

export default async function PledgeTopicPage({ params }: { params: { topic: string } }) {
  const pledges = await getPledgesByTopic(params.topic);
  if (pledges.length === 0) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/valkompass-2022"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-light hover:text-ink-light dark:text-muted-dark dark:hover:text-ink-dark"
        >
          <ArrowLeft size={14} /> Alla frågor
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{pledges[0].topic}</h1>
        <p className="mt-1 text-xs text-muted-light dark:text-muted-dark">
          Ur SVT:s lokala Valkompass inför valet 2022 &mdash; partiernas svar då, inte nödvändigtvis idag.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {pledges.map((pledge) => (
          <div key={pledge.id} className="card p-5">
            <div className="mb-2 flex items-center gap-2">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: pledge.party.colorHex }}
              >
                {pledge.party.shortName}
              </span>
              <Link href={`/partier/${pledge.party.slug}`} className="text-sm font-medium hover:underline">
                {pledge.party.name}
              </Link>
            </div>
            <p className="text-sm font-medium text-ink-light dark:text-ink-dark">{pledge.position}</p>
            {pledge.motivation && (
              <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">{pledge.motivation}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
