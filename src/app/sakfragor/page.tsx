import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllIssueAreas } from "@/lib/queries/issueAreas";

export default async function SakfragorPage() {
  const issueAreas = await getAllIssueAreas();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sakfrågor</h1>
        <p className="mt-1 text-muted-light dark:text-muted-dark">
          Välj en fråga för att se alla partiers ståndpunkt bredvid varandra.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {issueAreas.map((area) => (
          <Link key={area.slug} href={`/sakfragor/${area.slug}`} className="card card-hover group flex items-center justify-between gap-3 p-5">
            <div>
              <div className="font-medium">{area.name}</div>
              {area.description && (
                <p className="text-sm text-muted-light dark:text-muted-dark">{area.description}</p>
              )}
            </div>
            <ArrowRight
              size={16}
              className="shrink-0 text-muted-light opacity-0 transition-opacity group-hover:opacity-100 dark:text-muted-dark"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
