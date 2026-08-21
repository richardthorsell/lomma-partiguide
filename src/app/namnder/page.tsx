import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { getAllCommittees } from "@/lib/queries/committees";

export default async function NamnderPage() {
  const committees = await getAllCommittees();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Nämnder</h1>
        <p className="mt-1 text-muted-light dark:text-muted-dark">
          Kommunfullmäktige, kommunstyrelsen och kommunens sex nämnder, med fullständig sammansättning per
          parti hämtad från kommunens officiella förtroendemannaregister.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {committees.map((committee) => (
          <Link
            key={committee.slug}
            href={`/namnder/${committee.slug}`}
            className="card card-hover group flex items-center justify-between gap-3 p-5"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
                <Users size={16} />
              </span>
              <div>
                <div className="font-medium">{committee.name}</div>
                <div className="text-sm text-muted-light dark:text-muted-dark">
                  {committee._count.memberships} uppdrag
                </div>
              </div>
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
