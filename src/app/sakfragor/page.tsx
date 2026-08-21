import Link from "next/link";
import { getAllIssueAreas } from "@/lib/queries/issueAreas";

export default async function SakfragorPage() {
  const issueAreas = await getAllIssueAreas();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Sakfrågor</h1>
        <p className="text-stone-600">Välj en fråga för att se alla partiers ståndpunkt bredvid varandra.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {issueAreas.map((area) => (
          <Link
            key={area.slug}
            href={`/sakfragor/${area.slug}`}
            className="rounded-lg border border-stone-200 bg-white p-4 hover:border-stone-400"
          >
            <div className="font-medium">{area.name}</div>
            {area.description && <p className="text-sm text-stone-600">{area.description}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
