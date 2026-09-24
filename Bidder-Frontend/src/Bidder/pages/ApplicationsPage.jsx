import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import { bidderService } from "../services/bidderService";
import BidderTopbar from "../components/BidderTopbar";

export default function ApplicationsPage({ hideTopbar }) {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const apps = await bidderService.getApplications();
        setApplications(apps);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-10 text-sm text-slate-500">Loading applications…</div>;

  return <div>{!hideTopbar && <BidderTopbar title="My Applications" subtitle="Track tenders you have submitted applications for." />}<div className={`mx-auto max-w-[1200px] ${hideTopbar ? "p-0 pt-4" : "p-6 lg:p-8"}`}><div className="mb-5"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Application Repository</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">Submitted Applications</h2></div>{applications.length ? <div className="space-y-3">{applications.map((application) => { const tenderTitle = application.tender?.title || "Tender Application"; const tenderId = application.tender?.tender_id || application.tender_id || "Unknown"; return <button key={application.application_id} onClick={() => navigate(`/bidder/applications/${application.application_id}`)} className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md sm:flex-row sm:items-center"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><FileText size={20} /></div><div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">{application.application_id} · {tenderId}</p><h3 className="mt-1 truncate text-sm font-bold text-slate-900">{tenderTitle}</h3><div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-slate-400"><span className="flex items-center gap-1"><CalendarDays size={12} /> {application.status === "DRAFT" ? "Draft saved" : `Submitted ${new Date(application.submitted_at || application.created_at || new Date()).toLocaleDateString("en-IN")}`}</span><span>{application.documents?.length || 0} Documents</span></div></div><div className="flex items-center gap-3"><StatusBadge status={application.status === "DRAFT" ? "Not started" : application.status === "APPROVED" ? "Allotted" : "No allotment done"} /><ArrowRight size={16} className="text-slate-400" /></div></button>; })}</div> : <EmptyState title="No applications yet" description="Once you complete and submit a tender application, it will appear here." />}</div></div>;
}
