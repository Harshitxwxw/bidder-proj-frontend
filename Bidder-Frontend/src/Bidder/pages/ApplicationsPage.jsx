import { useState } from "react";
import { ArrowRight, CalendarDays, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BidderTopbar from "../components/BidderTopbar";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import { getApplications } from "../services/bidderStorage";
import { MOCK_TENDERS } from "../data/mockData";

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const [applications] = useState(getApplications());
  return <div><BidderTopbar title="My Applications" subtitle="Track tenders you have submitted applications for." /><div className="mx-auto max-w-[1200px] p-6 lg:p-8"><div className="mb-5"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Application Repository</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">Submitted Applications</h2></div>{applications.length ? <div className="space-y-3">{applications.map((application) => { const tender = MOCK_TENDERS.find((item) => item.tenderId === application.tenderId); return <button key={application.applicationId} onClick={() => navigate(`/bidder/applications/${application.applicationId}`)} className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md sm:flex-row sm:items-center"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><FileText size={20} /></div><div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">{application.applicationId} · {application.tenderId}</p><h3 className="mt-1 truncate text-sm font-bold text-slate-900">{tender?.title || application.tenderTitle}</h3><div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-slate-400"><span className="flex items-center gap-1"><CalendarDays size={12} /> Submitted {new Date(application.submittedAt).toLocaleDateString("en-IN")}</span><span>{application.documentCount || Object.keys(application.documentIds || {}).length || "Documents"}</span></div></div><div className="flex items-center gap-3"><StatusBadge status="No allotment done" /><ArrowRight size={16} className="text-slate-400" /></div></button>; })}</div> : <EmptyState title="No applications yet" description="Once you complete and submit a tender application, it will appear here." />}</div></div>;
}
