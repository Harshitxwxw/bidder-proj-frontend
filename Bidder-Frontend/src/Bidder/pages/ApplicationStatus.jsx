import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock3, FileCheck2, ShieldAlert, ArrowRight, Phone } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BidderTopbar from "../components/BidderTopbar";
import StatusBadge from "../components/StatusBadge";
import { bidderService } from "../services/bidderService";
import { createApplication, getApplication, getUploadedDocuments, markApplicationProcessing } from "../services/bidderStorage";

export default function ApplicationStatus() {
  const { tenderId, applicationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [application, setApplication] = useState(null);
  const [tender, setTender] = useState(null);

  useEffect(() => {
    const load = async () => {
      const resolvedTenderId = tenderId || getApplication(applicationId)?.tenderId;
      const foundTender = await bidderService.getTenderById(resolvedTenderId);
      setTender(foundTender);
      let app = applicationId ? getApplication(applicationId) : null;
      if (!app && location.search.includes("submitted=true") && foundTender) app = createApplication(foundTender);
      if (app && app.status === "SUBMITTED" && location.search.includes("submitted=true")) { markApplicationProcessing(app.applicationId); app = getApplication(app.applicationId); }
      setApplication(app);
    };
    load();
  }, [tenderId, applicationId, location.search]);

  if (!application || !tender) return <div className="p-10 text-sm text-slate-500">Loading application status…</div>;
  const documents = getUploadedDocuments(tender.tenderId);
  const allotted = false;

  return <div><BidderTopbar title="Application Status" subtitle={`Track your submission for ${tender.tenderId}`} /><div className="mx-auto max-w-[1100px] p-6 lg:p-8">
    <button onClick={() => navigate("/bidder/applications")} className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600"><ArrowLeft size={15} /> My Applications</button>
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-600">{application.applicationId}</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">{tender.title}</h2><p className="mt-1 text-xs text-slate-500">Tender ID: {tender.tenderId}</p></div><StatusBadge status={allotted ? "Allotted" : "No allotment done"} /></div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3"><Metric icon={FileCheck2} label="Documents submitted" value={`${Object.keys(documents).length}/${tender.requirements.length}`} /><Metric icon={Clock3} label="Application status" value={application.status.replaceAll("_", " ")} /><Metric icon={ShieldAlert} label="AI verification" value="Processing" /></div>
    </section>

    <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Submission timeline</p><div className="mt-5 space-y-5"><Timeline done label="Application submitted" description={`Application ${application.applicationId} was received successfully.`} /><Timeline done={application.status === "PROCESSING" || application.status === "VERIFIED"} label="AI verification" description="Documents are being processed and checked against tender requirements." /><Timeline done={application.status === "VERIFIED"} label="Officer review" description="Procurement Officer review will follow AI verification." /><Timeline done={false} label="Allotment decision" description="Final outcome will be reflected here when the procurement process is completed." /></div></section>

    <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold text-slate-800">Current outcome</p><p className="mt-1 text-xs text-slate-500">No allotment has been recorded for this application yet.</p></div>{allotted ? <button onClick={() => navigate(`/bidder/allotted/${tender.tenderId}`)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white">Contact details <Phone size={14} /></button> : <span className="rounded-full bg-white px-3 py-2 text-[11px] font-bold text-slate-600 ring-1 ring-blue-100">No allotment done</span>}</div>
  </div></div>;
}

function Metric({ icon: Icon, label, value }) { return <div className="rounded-xl bg-slate-50 p-4"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400"><Icon size={13} /> {label}</div><p className="mt-1.5 text-sm font-extrabold text-slate-800">{value}</p></div>; }
function Timeline({ done, label, description }) { return <div className="flex gap-3"><div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${done ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>{done ? <CheckCircle2 size={16} /> : <Clock3 size={15} />}</div><div><p className="text-xs font-bold text-slate-800">{label}</p><p className="mt-0.5 text-[11px] leading-5 text-slate-500">{description}</p></div></div>; }
