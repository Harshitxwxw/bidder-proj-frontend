import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Users,
  Tag,
  ChevronRight,
} from "lucide-react";

const TenderCard = ({ tender }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("/officer/tender-bidder", {
      state: { selectedTenderId: tender.id },
    });
  };

  return (
    <div
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      title="Click to view bidders for this tender"
      className="group/card cursor-pointer rounded-xl border border-slate-200/70 bg-white/80 p-2.5 sm:px-3.5 sm:py-2.5 shadow-xs backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md active:translate-y-0"
    >
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        {/* Tender Icon */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50/90 text-blue-600 transition-colors group-hover/card:bg-blue-100/90">
          <Tag size={16} />
        </div>

        {/* Main Information */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-sm font-semibold text-slate-900 transition-colors group-hover/card:text-blue-600">
              {tender.name}
            </h2>
          </div>

          <div className="mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            {/* Location */}
            <div className="flex items-center gap-1">
              <MapPin size={13} className="text-slate-400" />
              <span>{tender.location}</span>
            </div>

            {/* Sector */}
            <div className="flex items-center gap-1">
              <Tag size={13} className="text-slate-400" />
              <span>{tender.sector}</span>
            </div>
          </div>
        </div>

        {/* Bidders */}
        <div className="flex items-center gap-2.5 border-t border-slate-100 pt-2 sm:border-l sm:border-t-0 sm:pl-3.5 sm:pt-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <Users size={14} />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-800 leading-tight">
              {tender.bidders}
            </p>
            <p className="text-[10px] uppercase text-slate-400">
              Bidders
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition-all duration-200 group-hover/card:bg-blue-600 group-hover/card:text-white group-hover/card:shadow-xs"
        >
          <ChevronRight size={15} />
        </div>
      </div>
    </div>
  );
};

export { TenderCard };