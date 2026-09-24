import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, CheckCircle2, FileText, MapPin, Building2, IndianRupee, Users, ArrowRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import BidderTopbar from "../components/BidderTopbar";
import StatusBadge from "../components/StatusBadge";
import { bidderService } from "../services/bidderService";

const date = (v) => new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(v));
const money = (v) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

export default function TenderDetails() {
  const { tenderId } = useParams();
  const navigate = useNavigate();
  const [tender, setTender] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const t = await bidderService.getTenderById(tenderId);
        setTender(t);
        const apps = await bidderService.getApplications();
        setApplications(apps);
      } catch (err) {
        console.error("Error loading tender details", err);
      }
    };
    load();
  }, [tenderId]);

  const existingApplication = applications.find((app) => app.tender_id === tender?.tender_id || app.tender?.tender_id === tender?.tender_id || app.tender_id === tenderId || app.tender?.tender_id === tenderId);

  if (!tender) return <div className="p-10 text-sm text-slate-500">Loading tender…</div>;

  return <div><BidderTopbar title="Tender Details" subtitle="Review the complete tender before starting your application." /><div className="mx-auto max-w-[1250px] p-6 lg:p-8">
    <button onClick={() => navigate("/bidder/tenders")} className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600"><ArrowLeft size={15} /> Back to All Tenders</button>
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start"><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600">{tender.tender_id || tender.tenderId}</p><h2 className="mt-1 max-w-3xl text-2xl font-extrabold tracking-tight text-slate-900">{tender.title}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{tender.description}</p></div><StatusBadge status={tender.status} /></div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Info icon={CalendarDays} label="Bid deadline" value={date(tender.bid_deadline || tender.bidDeadline)} /><Info icon={MapPin} label="Location" value={tender.location} /><Info icon={Building2} label="Department" value={tender.category || tender.department} /><Info icon={IndianRupee} label="Estimated value" value={money(tender.estimated_value || tender.estimatedValue || 0)} /></div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2"><Info icon={Users} label="Application capacity" value={`${tender.application_capacity || tender.applicationCapacity} applications`} /><Info icon={CalendarDays} label="Published" value={date(tender.publish_date || tender.publishDate)} /></div>
    </section>

    <section className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-6 py-5"><div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Dynamic requirements</p><h3 className="mt-1 text-lg font-extrabold text-slate-900">Tender Requirements</h3></div><span className="rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-blue-700">{tender.requirements?.length || 0} requirements</span></div></div>
      <div className="divide-y divide-slate-100">{(tender.requirements || []).map((requirement, index) => <div key={requirement.requirement_id || requirement.requirementId || index} className="flex gap-4 px-6 py-5"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">{index + 1}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h4 className="text-sm font-bold text-slate-800">{requirement.requirement_name || requirement.name}</h4>{requirement.mandatory ? <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600">Mandatory</span> : <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">Optional</span>}</div><p className="mt-1 text-xs leading-5 text-slate-500">{requirement.description}</p><p className="mt-2 text-[10px] font-semibold text-slate-400">Accepted: {requirement.acceptedFormats?.join(", ") || requirement.accepted_formats || "Document"}</p></div></div>)}</div>
      <div className="flex justify-end border-t border-slate-100 px-6 py-5">
        {existingApplication ? (
          <button onClick={() => navigate(`/bidder/applications/${existingApplication.application_id}`)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white">View Application <ArrowRight size={15} /></button>
        ) : (
          <button onClick={() => navigate(`/bidder/tenders/${tender.tender_id || tender.tenderId}/upload`)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700">
            Apply to this Tender <ArrowRight size={15} />
          </button>
        )}
      </div>
    </section>
  </div></div>;
}

function Info({ icon: Icon, label, value }) { return <div className="rounded-xl bg-slate-50 p-3"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400"><Icon size={13} /> {label}</div><p className="mt-1 text-xs font-bold text-slate-800">{value}</p></div>; }
