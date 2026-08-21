import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPledgesByTopic } from "@/lib/queries/pledges";
import { PledgeCard } from "@/components/PledgeCard";

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
          <ArrowLeft size={14} /> Alla vallöften
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{pledges[0].topic}</h1>
        <p className="mt-1 text-xs text-muted-light dark:text-muted-dark">
          Vallöften 2022 &mdash; Vad hände? Partiernas svar i SVT:s lokala Valkompass, jämfört med vad som
          faktiskt beslutades i kommunfullmäktige sedan dess.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {pledges.map((pledge) => (
          <PledgeCard
            key={pledge.id}
            topic={pledge.topic}
            position={pledge.position}
            motivation={pledge.motivation}
            outcomeStatus={pledge.outcomeStatus}
            outcomeDescription={pledge.outcomeDescription}
            party={pledge.party}
          />
        ))}
      </div>
    </div>
  );
}
