import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Building,
  Users,
  IndianRupee,
  FileText,
  Heart,
  ArrowRight
} from "lucide-react";

const TenderCard = ({ tender }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("/officer/tender-bidder", {
      state: { selectedTenderId: tender.id },
    });
  };

  const formatCurrency = (value) => {
    if (!value) return "N/A";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatTurnover = (value) => {
    if (!value) return "N/A";
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr turnover`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(0)}L turnover`;
    }
    return `₹${value} turnover`;
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
      className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md cursor-pointer"
    >
      {/* Top Header Section */}
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50/80 text-blue-600 border border-blue-100">
            <FileText size={22} />
          </div>
          <div>
            <p className="text-sm font-bold tracking-wide text-blue-600">
              {tender.tender_id}
            </p>
            <h2 className="mt-1 text-lg font-bold leading-tight text-slate-900 group-hover:text-blue-700 transition-colors">
              {tender.name || tender.title}
            </h2>
          </div>
        </div>
      </div>

      {/* Description */}
      {tender.description && (
        <p className="text-sm text-slate-500 line-clamp-2 mt-1">
          {tender.description}
        </p>
      )}

      {/* Badges Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mt-2">
        <div className="flex items-center gap-2 rounded-lg bg-slate-50/80 px-3 py-2 text-sm text-slate-600">
          <MapPin size={16} className="text-slate-400" />
          <span className="truncate">{tender.location}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-slate-50/80 px-3 py-2 text-sm text-slate-600">
          <Building size={16} className="text-slate-400" />
          <span className="truncate">{tender.sector || tender.category}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-slate-50/80 px-3 py-2 text-sm text-slate-600">
          <IndianRupee size={16} className="text-slate-400" />
          <span className="truncate">{formatTurnover(tender.estimated_value)}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-slate-50/80 px-3 py-2 text-sm text-slate-600">
          <Users size={16} className="text-slate-400" />
          <span className="truncate">{tender.bidders || 0} Bidders</span>
        </div>
      </div>

      <div className="my-1 h-px w-full bg-slate-100" />

      {/* Footer Section */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Estimated Value
          </p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {formatCurrency(tender.estimated_value)}
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
          Check Bidders
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export { TenderCard };