import {
  MapPin,
  Tag,
  Users,
  ChevronDown,
  BarChart3,
} from "lucide-react";

import {TenderBidderCard} from "./TenderBidderCard";

const TenderBiddersCard = ({
  tender,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200">
      {/* Tender Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left"
      >
        <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center">
          {/* Tender Icon */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <BarChart3 size={20} />
          </div>

          {/* Tender Information */}
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-slate-900">
              {tender.name}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                {tender.location}
              </span>

              <span className="flex items-center gap-1.5">
                <Tag size={14} />
                {tender.sector}
              </span>

              <span className="flex items-center gap-1.5">
                <Users size={14} />
                {tender.bidders.length} Bidders
              </span>
            </div>
          </div>

          {/* Analyze */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();

                // Add your analyze API/navigation here
                console.log(
                  "Analyze tender:",
                  tender.id
                );
              }}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Analyze
            </button>

            <div
              className={`rounded-lg bg-slate-100 p-2 text-slate-500 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            >
              <ChevronDown size={18} />
            </div>
          </div>
        </div>
      </button>

      {/* Bidders */}
      {isOpen && (
        <div className="border-t border-slate-100 bg-slate-50/60 p-4">
          <div className="mb-3 flex items-center justify-between px-1">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Submitted Bidders
              </h3>

              <p className="mt-0.5 text-xs text-slate-400">
                Sorted by compliance score.
              </p>
            </div>

            <span className="text-xs font-medium text-slate-400">
              {tender.bidders.length} bidders
            </span>
          </div>

          <div className="space-y-2">
            {/*
              Highest compliance first.
              If compliance is equal,
              earliest submission date comes first.
            */}
            {[...tender.bidders]
              .sort((a, b) => {
                if (
                  b.complianceScore !==
                  a.complianceScore
                ) {
                  return (
                    b.complianceScore -
                    a.complianceScore
                  );
                }

                return (
                  new Date(a.submittedDate) -
                  new Date(b.submittedDate)
                );
              })
              .map((bidder) => (
                <TenderBidderCard
                  key={bidder.id}
                  bidder={bidder}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export  {TenderBiddersCard};