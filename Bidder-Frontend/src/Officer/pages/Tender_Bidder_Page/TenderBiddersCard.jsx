import {
  MapPin,
  Tag,
  Users,
  ChevronDown,
  BarChart3,
  Sparkles,
  Loader2,
} from "lucide-react";

import { TenderBidderCard } from "./TenderBidderCard";

const TenderBiddersCard = ({
  tender,
  isOpen,
  onToggle,
  onAnalyze,
  isAnalyzing = false,
}) => {
  const biddersList = tender.bidders || [];

  return (
    <div
      id={`tender-${tender.id}`}
      className="group/card overflow-hidden rounded-xl border border-slate-200/70 bg-white/80 shadow-xs backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      {/* Tender Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left transition-colors duration-200 hover:bg-slate-50/50"
      >
        <div className="flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center">
          {/* Tender Icon */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-transform duration-200 group-hover/card:scale-105">
            <BarChart3 size={18} />
          </div>

          {/* Tender Information */}
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm sm:text-base font-bold text-slate-900">
              {tender.name}
            </h2>

            <div className="mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-slate-400" />
                {tender.location}
              </span>

              <span className="flex items-center gap-1">
                <Tag size={13} className="text-slate-400" />
                {tender.sector}
              </span>

              <span className="flex items-center gap-1">
                <Users size={13} className="text-slate-400" />
                {biddersList.length} Bidders
              </span>
            </div>
          </div>

          {/* Large Analyze Button & Expand */}
          <div className="flex items-center gap-3 self-end sm:self-center">
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={(event) => {
                event.stopPropagation();
                onAnalyze?.();
              }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-base font-bold text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={17} className="animate-spin shrink-0" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze
                </>
              )}
            </button>

            <div
              className={`rounded-lg bg-slate-50 p-2 text-slate-400 transition-all duration-200 group-hover/card:bg-slate-100 group-hover/card:text-slate-600 ${isOpen ? "rotate-180 bg-blue-50 text-blue-600 group-hover/card:bg-blue-100 group-hover/card:text-blue-700" : ""
                }`}
            >
              <ChevronDown size={17} />
            </div>
          </div>
        </div>
      </button>

      {/* Bidders Accordion Content */}
      {isOpen && (
        <div className="border-t border-slate-100 bg-slate-50/60 p-3.5">
          <div className="mb-2.5 flex items-center justify-between px-1">
            <div>
              <h3 className="text-xs font-semibold text-slate-800">
                Submitted Bidders
              </h3>
              <p className="text-[11px] text-slate-400">
                Sorted by compliance score.
              </p>
            </div>

            <span className="text-xs font-medium text-slate-400">
              {biddersList.length} bidders
            </span>
          </div>

          {biddersList.length === 0 ? (
            <p className="py-4 text-center text-xs text-slate-400">
              No bidders submitted for this tender yet.
            </p>
          ) : (
            <div className="space-y-1.5">
              {[...biddersList]
                .sort((a, b) => {
                  if (b.complianceScore !== a.complianceScore) {
                    return (b.complianceScore || 0) - (a.complianceScore || 0);
                  }
                  return new Date(a.submittedDate) - new Date(b.submittedDate);
                })
                .map((bidder) => (
                  <TenderBidderCard
                    key={bidder.id}
                    bidder={bidder}
                  />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { TenderBiddersCard };