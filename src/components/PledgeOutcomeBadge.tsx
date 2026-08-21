import { CheckCircle2, CircleDashed, HelpCircle, XCircle } from "lucide-react";

type Outcome = "FULFILLED" | "PARTIALLY_FULFILLED" | "NOT_FULFILLED" | "UNCLEAR" | "NOT_VERIFIED";

const CONFIG: Record<Outcome, { label: string; className: string; icon: typeof CheckCircle2 | null }> = {
  FULFILLED: {
    label: "Uppfyllt",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    icon: CheckCircle2,
  },
  PARTIALLY_FULFILLED: {
    label: "Delvis uppfyllt",
    className: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    icon: CircleDashed,
  },
  NOT_FULFILLED: {
    label: "Ej uppfyllt",
    className: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
    icon: XCircle,
  },
  UNCLEAR: {
    label: "Oklart",
    className: "bg-surface-light text-muted-light dark:bg-surface-dark dark:text-muted-dark",
    icon: HelpCircle,
  },
  NOT_VERIFIED: {
    label: "Ej verifierat",
    className: "bg-surface-light text-muted-light dark:bg-surface-dark dark:text-muted-dark",
    icon: null,
  },
};

export function PledgeOutcomeBadge({ status }: { status: Outcome }) {
  const { label, className, icon: Icon } = CONFIG[status];
  return (
    <span className={`pill ${className}`}>
      {Icon && <Icon size={12} />}
      {label}
    </span>
  );
}
