import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock3, FileCheck2, ShieldAlert, Phone } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BidderTopbar from "../components/BidderTopbar";
import StatusBadge from "../components/StatusBadge";
import { bidderService } from "../services/bidderService";

export default function ApplicationStatus() {
  const { tenderId, applicationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [application, setApplication] = useState(null);
  const [tender, setTender] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        let app = null;
        let t = null;

        if (applicationId) {
          app = await bidderService.getApplication(applicationId);
        } else {
          // If we only have tenderId, we need to find the latest application for this tender
          const apps = await bidderService.getApplications();
          app = apps.find(a => a.tender_id === tenderId || a.tender?.tender_id === tenderId);
          if (app) {
            app = await bidderService.getApplication(app.application_id);
          }
        }

        if (app) {
          setApplication(app);
          if (app.tender) {
            t = app.tender;
          } else if (app.tender_id) {
            t = await bidderService.getTenderById(app.tender_id);
          }
        } else if (tenderId) {
          t = await bidderService.getTenderById(tenderId);
        }

        if (t) {
          setTender(t);
        }
      } catch (err) {
        console.error("Failed to load application status", err);
      }
    };
    load();
  }, [tenderId, applicationId, location.search]);

  if (!application || !tender) return <div className="p-10 text-sm text-slate-500">Loading application status…</div>;
  
  const documentsCount = application.documents?.length || 0;
  const reqsCount = tender.requirements?.length || 0;
  const allotted = application.status === "APPROVED"; // Or whatever logic defines allotted

  return <div><BidderTopbar title="Application Status" subtitle={`Track your submission for ${tender.tender_id || tender.tenderId}`} /><div className="mx-auto max-w-[1100px] p-6 lg:p-8">
    <button onClick={() => navigate("/bidder/applications")} className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600"><ArrowLeft size={15} /> My Applications</button>
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-600">{application.application_id}</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">{tender.title}</h2><p className="mt-1 text-xs text-slate-500">Tender ID: {tender.tender_id || tender.tenderId}</p></div><StatusBadge status={allotted ? "Allotted" : "No allotment done"} /></div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3"><Metric icon={FileCheck2} label="Documents submitted" value={`${documentsCount}/${reqsCount}`} /><Metric icon={Clock3} label="Application status" value={application.status.replaceAll("_", " ")} /><Metric icon={ShieldAlert} label="AI verification" value={application.status === "DRAFT" ? "Not started" : "Processing"} /></div>
    </section>

    <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Submission timeline</p><div className="mt-5 space-y-5"><Timeline done={application.status !== "DRAFT"} label="Application submitted" description={application.status !== "DRAFT" ? `Application ${application.application_id} was received successfully.` : "Draft saved, pending submission."} /><Timeline done={application.status === "VERIFIED" || application.status === "APPROVED"} label="AI verification" description="Documents are being processed and checked against tender requirements." /><Timeline done={application.status === "APPROVED" || application.status === "REJECTED"} label="Officer review" description="Procurement Officer review." /><Timeline done={allotted} label="Allotment decision" description="Final outcome will be reflected here when the procurement process is completed." /></div></section>

    <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold text-slate-800">Current outcome</p><p className="mt-1 text-xs text-slate-500">{allotted ? "Congratulations! The tender has been allotted to your application." : "No allotment has been recorded for this application yet."}</p></div>{allotted ? <button onClick={() => navigate(`/bidder/allotted/${tender.tender_id || tender.tenderId}`)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white">Contact details <Phone size={14} /></button> : <span className="rounded-full bg-white px-3 py-2 text-[11px] font-bold text-slate-600 ring-1 ring-blue-100">No allotment done</span>}</div>
  </div></div>;
}

function Metric({ icon: Icon, label, value }) { return <div className="rounded-xl bg-slate-50 p-4"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400"><Icon size={13} /> {label}</div><p className="mt-1.5 text-sm font-extrabold text-slate-800">{value}</p></div>; }
function Timeline({ done, label, description }) { return <div className="flex gap-3"><div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${done ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>{done ? <CheckCircle2 size={16} /> : <Clock3 size={15} />}</div><div><p className="text-xs font-bold text-slate-800">{label}</p><p className="mt-0.5 text-[11px] leading-5 text-slate-500">{description}</p></div></div>; }
