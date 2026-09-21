import { CalendarDays, Users } from "lucide-react";

const TenderBidderCard = ({ bidder }) => {
  const formattedDate = new Date(bidder.submittedDate).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-slate-200/70 bg-white/75 px-3 py-2 shadow-xs backdrop-blur-md transition-all duration-200 hover:bg-white hover:shadow-xs">
      {/* Bidder Icon */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
        <Users size={14} />
      </div>

      {/* Name + Submitted Date */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs sm:text-sm font-semibold text-slate-800">
          {bidder.name}
        </p>

        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
          <CalendarDays size={12} />
          <span>Submitted {formattedDate}</span>
        </div>
      </div>

      {/* Compliance Score (No green line) */}
      <div className="flex shrink-0 items-center text-right">
        <div>
          <p className="text-sm sm:text-base font-bold tracking-tight text-slate-900 leading-tight">
            {bidder.complianceScore}%
          </p>
          <p className="text-[9px] uppercase tracking-wide text-slate-400">
            Compliance
          </p>
        </div>
      </div>
    </div>
  );
};

export { TenderBidderCard };