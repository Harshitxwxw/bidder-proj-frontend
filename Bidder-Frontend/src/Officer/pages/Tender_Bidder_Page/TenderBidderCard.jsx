import { CalendarDays, Users } from "lucide-react";

const TenderBidderCard = ({ bidder }) => {
  const formattedDate = new Date(
    bidder.submittedDate
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-4 py-4">
      {/* Bidder Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
        <Users size={18} />
      </div>

      {/* Name + Submitted Date */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">
          {bidder.name}
        </p>

        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
          <CalendarDays size={13} />

          <span>
            Submitted {formattedDate}
          </span>
        </div>
      </div>

      {/* Compliance Score */}
      <div className="shrink-0 text-right">
        <p className="text-xl font-bold text-slate-900">
          {bidder.complianceScore}%
        </p>

        <p className="text-[10px] uppercase tracking-wide text-slate-400">
          Compliance
        </p>
      </div>
    </div>
  );
};

export  {TenderBidderCard};