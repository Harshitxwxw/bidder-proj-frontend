import { ArrowRight, Mail, MapPin, Phone, Trophy, CalendarDays, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import BidderTopbar from "../components/BidderTopbar";
import { bidderService } from "../services/bidderService";

export default function AllottedPage({ hideTopbar }) {
  const navigate = useNavigate();
  const [allotted, setAllotted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllotted = async () => {
      try {
        const apps = await bidderService.getApplications();
        const wonTenders = apps.filter(app => 
          app.status === "DECIDED" && app.officer_decision?.decision === "QUALIFIED"
        );
        setAllotted(wonTenders);
      } catch(err) {
        console.error("Failed to fetch allotted tenders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllotted();
  }, []);

  if (loading) return <div className="p-10 text-sm text-slate-500">Loading allotments...</div>;

  return <div>{!hideTopbar && <BidderTopbar title="Allotted" subtitle="Tenders that have been allotted to your organization." />}<div className={`mx-auto max-w-[1200px] ${hideTopbar ? "p-0 pt-4" : "p-6 lg:p-8"}`}><div className="mb-5"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Awarded Tenders</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">Allotted Tenders</h2></div>{allotted.length ? <div className="space-y-4">{allotted.map((item) => { const tender = item.tender || {}; const tenderId = tender.tender_id || "Unknown"; return <article key={item.application_id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start"><div className="flex gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><Trophy size={20} /></div><div><p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">{tenderId}</p><h3 className="mt-1 text-base font-extrabold text-slate-900">{tender.title || "Tender Title"}</h3><p className="mt-1 text-xs text-slate-500">{tender.category || "General"} · {tender.location || "National"}</p></div></div><StatusBadge status="Allotted" /></div><div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-3"><div><p className="text-[10px] uppercase tracking-wider text-slate-400">Contact person</p><p className="mt-1 text-xs font-bold text-slate-800">Procurement Officer</p></div><div><p className="text-[10px] uppercase tracking-wider text-slate-400">Decision Date</p><p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-800"><CalendarDays size={13} /> {item.officer_decision?.decided_at ? new Date(item.officer_decision.decided_at).toLocaleDateString("en-IN") : "N/A"}</p></div><div><p className="text-[10px] uppercase tracking-wider text-slate-400">Email</p><p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-800"><Mail size={13} /> contact@procurement.gov.in</p></div></div><div className="mt-5 flex justify-end"><button onClick={() => navigate(`/bidder/allotted/${tenderId}`)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700">View Allotment & Contact <ArrowRight size={15} /></button></div></article>; })}</div> : <EmptyState title="No allotted tenders" description="Tenders allotted to your organization will appear here." />}</div></div>;
}
