import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPledgeTopics } from "@/lib/queries/pledges";

export default async function Valkompass2022Page() {
  const topics = await getPledgeTopics();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Valkompass 2022</h1>
        <p className="mt-1 text-muted-light dark:text-muted-dark">
          Vad partierna svarade i SVT:s lokala valkompass inför valet 2022 &mdash; 15 konkreta frågor om Lomma
          kommun. Välj en fråga för att se alla partiers svar bredvid varandra. Vänsterpartiet deltog inte i
          den lokala valkompassen och saknas därför här.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {topics.map((topic) => (
          <Link
            key={topic.topicSlug}
            href={`/valkompass-2022/${topic.topicSlug}`}
            className="card card-hover flex items-center justify-between gap-3 p-5"
          >
            <span className="font-medium">{topic.topic}</span>
            <ArrowRight size={16} className="shrink-0 text-muted-light dark:text-muted-dark" />
          </Link>
        ))}
      </div>
    </div>
  );
}
