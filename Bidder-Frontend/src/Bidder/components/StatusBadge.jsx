const styles = {
  "Bidding Open": "bg-emerald-50 text-emerald-700 ring-emerald-200",
  SUBMITTED: "bg-blue-50 text-blue-700 ring-blue-200",
  PROCESSING: "bg-amber-50 text-amber-700 ring-amber-200",
  VERIFIED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  UNDER_REVIEW: "bg-violet-50 text-violet-700 ring-violet-200",
  Allotted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "No allotment done": "bg-slate-100 text-slate-600 ring-slate-200",
  Pending: "bg-slate-100 text-slate-600 ring-slate-200",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${styles[status] || styles.Pending}`}>
      {status?.replaceAll("_", " ")}
    </span>
  );
}
