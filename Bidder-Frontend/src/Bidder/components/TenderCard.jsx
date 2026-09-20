import { CalendarDays, Heart, MapPin, Building2, FileCheck2, ArrowRight, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isWishlisted, toggleWishlist } from "../services/bidderStorage";
import { useState } from "react";

const formatDate = (value) => new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
const formatMoney = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

export default function TenderCard({ tender, onWishlistChange }) {
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(isWishlisted(tender.tenderId));

  const handleWishlist = (event) => {
    event.stopPropagation();
    const next = toggleWishlist(tender.tenderId);
    const active = next.includes(tender.tenderId);
    setWishlisted(active);
    onWishlistChange?.();
  };

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/50">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileCheck2 size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-600">{tender.tenderId}</p>
            <h3 className="mt-1 line-clamp-2 text-base font-bold leading-6 text-slate-900">{tender.title}</h3>
          </div>
        </div>
        <button onClick={handleWishlist} className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition ${wishlisted ? "border-rose-200 bg-rose-50 text-rose-500" : "border-slate-200 bg-white text-slate-400 hover:border-rose-200 hover:text-rose-500"}`} title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}>
          <Heart size={17} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      <p className="mt-4 line-clamp-2 text-xs leading-5 text-slate-500">{tender.description}</p>

      <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2"><MapPin size={14} className="text-slate-400" />{tender.location}</div>
        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2"><Building2 size={14} className="text-slate-400" />{tender.department}</div>
        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2"><IndianRupee size={14} className="text-slate-400" />₹{(tender.turnover / 100000).toFixed(0)}L turnover</div>
        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2"><CalendarDays size={14} className="text-slate-400" />Due {formatDate(tender.bidDeadline)}</div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-400">Estimated value</p>
          <p className="mt-0.5 text-sm font-bold text-slate-800">{formatMoney(tender.estimatedValue)}</p>
        </div>
        <button onClick={() => navigate(`/bidder/tenders/${tender.tenderId}/acknowledge`)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700">
          View Tender <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );
}
