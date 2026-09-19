import {
  MapPin,
  Users,
  Tag,
  ChevronRight,
} from "lucide-react";

const TenderCard = ({ tender }) => {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-2 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Tender Icon */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Tag size={19} />
        </div>

        {/* Main Information */}
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-bold text-slate-900">
            {tender.name}
          </h2>

          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
            {/* Location */}
            <div className="flex items-center gap-1.5">
              <MapPin size={15} className="text-slate-400" />
              <span>{tender.location}</span>
            </div>

            {/* Sector */}
            <div className="flex items-center gap-1.5">
              <Tag size={15} className="text-slate-400" />
              <span>{tender.sector}</span>
            </div>
          </div>
        </div>

        {/* Bidders */}
        <div className="flex items-center gap-3 border-t border-slate-100 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <Users size={17} />
          </div>

          <div>
            <p className="text-base font-bold text-slate-800">
              {tender.bidders}
            </p>

            <p className="text-xs text-slate-400">
              Bidders
            </p>
          </div>
        </div>

        {/* Action */}
        <button
          type="button"
          className="flex items-center justify-center rounded-lg bg-slate-100 p-2.5 text-slate-500 transition group-hover:bg-blue-600 group-hover:text-white"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export {TenderCard}