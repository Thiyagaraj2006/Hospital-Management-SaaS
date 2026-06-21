export default function DashboardCard({ label, value, icon: Icon, accent = "teal" }) {
  const accents = {
    teal: "bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300",
  };

  return (
    <div className="card flex items-center justify-between hover:shadow-card-hover">
      <div>
        <p className="text-sm font-medium text-ink-400">{label}</p>
        <p className="mt-1 font-display text-3xl font-bold text-ink-800 dark:text-ink-50">{value}</p>
      </div>
      {Icon && (
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${accents[accent]}`}>
          <Icon size={22} />
        </div>
      )}
    </div>
  );
}
