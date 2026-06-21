const STYLES = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  confirmed: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  cancelled: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  unpaid: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  refunded: "bg-ink-100 text-ink-600 dark:bg-ink-700 dark:text-ink-200",
  not_started: "bg-ink-100 text-ink-600 dark:bg-ink-700 dark:text-ink-200",
  in_progress: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
};

const DOT = {
  pending: "bg-amber-500",
  confirmed: "bg-teal-500",
  completed: "bg-emerald-500",
  cancelled: "bg-rose-500",
  unpaid: "bg-rose-500",
  paid: "bg-emerald-500",
  refunded: "bg-ink-400",
  not_started: "bg-ink-400",
  in_progress: "bg-amber-500",
};

/**
 * status: any of the appointment/payment/consultation status strings
 */
export default function StatusBadge({ status }) {
  const normalized = (status || "pending").toLowerCase();
  const style = STYLES[normalized] || STYLES.pending;
  const dot = DOT[normalized] || DOT.pending;
  const label = normalized.replace(/_/g, " ");

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${style}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
