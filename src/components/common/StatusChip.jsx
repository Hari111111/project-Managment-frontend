const variants = {
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  "In-Progress": "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
  Completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
};

function StatusChip({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${variants[status] || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}
    >
      {status}
    </span>
  );
}

export default StatusChip;
