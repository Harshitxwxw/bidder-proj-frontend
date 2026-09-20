import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowLeft, Check, CheckCircle2, File, FileText, LockKeyhole, UploadCloud, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import BidderTopbar from "../components/BidderTopbar";
import { bidderService } from "../services/bidderService";
import { getUploadedDocuments, saveUploadedDocuments } from "../services/bidderStorage";

export default function DocumentUpload() {
  const { tenderId } = useParams();
  const navigate = useNavigate();
  const [tender, setTender] = useState(null);
  const [documents, setDocuments] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { bidderService.getTenderById(tenderId).then(setTender); setDocuments(getUploadedDocuments(tenderId)); }, [tenderId]);

  const mandatory = useMemo(() => tender?.requirements.filter((item) => item.mandatory) || [], [tender]);
  const missing = mandatory.filter((item) => !documents[item.requirementId]);
  const completed = tender?.requirements.filter((item) => documents[item.requirementId]).length || 0;

  if (!tender) return <div className="p-10 text-sm text-slate-500">Loading application…</div>;

  const chooseFile = (requirement, file) => {
    setError("");
    if (!file) return;
    const allowed = requirement.acceptedFormats?.map((x) => x.toLowerCase()) || [];
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (allowed.length && !allowed.includes(ext)) {
      setError(`${requirement.name}: ${file.name} is not an accepted format. Accepted formats: ${requirement.acceptedFormats.join(", ")}.`);
      return;
    }
    const next = { ...documents, [requirement.requirementId]: { fileName: file.name, size: file.size, type: file.type, uploadedAt: new Date().toISOString() } };
    setDocuments(next);
    saveUploadedDocuments(tenderId, next);
  };

  const submit = () => {
    if (missing.length) {
      setError(`Please upload all mandatory documents before submission. Remaining: ${missing.map((item) => item.name).join(", ")}.`);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSubmitting(true);
    setTimeout(() => navigate(`/bidder/tenders/${tenderId}/status?submitted=true`), 650);
  };

  return <div><BidderTopbar title="Document Upload" subtitle={`Application evidence for ${tender.tenderId}`} /><div className="mx-auto max-w-[1100px] p-6 lg:p-8">
    <button onClick={() => navigate(`/bidder/tenders/${tenderId}/details`)} className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600"><ArrowLeft size={15} /> Back to Tender Details</button>
    <div className="mb-5 flex flex-col justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 sm:flex-row sm:items-center"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-600">Submission checklist</p><h2 className="mt-1 text-lg font-extrabold text-slate-900">Upload required evidence</h2><p className="mt-1 text-xs text-slate-500">All mandatory requirements must have evidence before you can submit.</p></div><div className="min-w-[150px] text-right"><p className="text-2xl font-extrabold text-blue-700">{completed}/{tender.requirements.length}</p><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">requirements covered</p></div></div>
    {error && <div className="mb-5 flex gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700"><AlertCircle size={17} className="shrink-0" /><div><p className="font-bold">Submission cannot continue</p><p className="mt-1 leading-5">{error}</p></div><button className="ml-auto shrink-0" onClick={() => setError("")}><X size={15} /></button></div>}
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-6 py-5"><h3 className="text-base font-extrabold text-slate-900">Required documents</h3><p className="mt-1 text-xs text-slate-500">Each requirement below maps to one evidence slot. Documents cannot be changed after final submission.</p></div><div className="divide-y divide-slate-100">{tender.requirements.map((requirement, index) => <RequirementUpload key={requirement.requirementId} requirement={requirement} index={index} document={documents[requirement.requirementId]} onFile={(file) => chooseFile(requirement, file)} />)}</div><div className="flex flex-col justify-between gap-4 border-t border-slate-100 bg-slate-50/70 px-6 py-5 sm:flex-row sm:items-center"><div className="flex items-center gap-2 text-[11px] text-slate-500"><LockKeyhole size={14} /> Final submission locks your uploaded evidence.</div><button disabled={submitting} onClick={submit} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:bg-slate-300">{submitting ? "Submitting…" : "Submit Application"} <Check size={15} /></button></div></section>
  </div></div>;
}

function RequirementUpload({ requirement, index, document, onFile }) {
  return <div className="px-6 py-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-center"><div className="flex min-w-0 flex-1 gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">{index + 1}</div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h4 className="text-sm font-bold text-slate-800">{requirement.name}</h4>{requirement.mandatory ? <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600">Mandatory</span> : <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">Optional</span>}</div><p className="mt-1 text-xs leading-5 text-slate-500">{requirement.description}</p><p className="mt-1 text-[10px] font-semibold text-slate-400">Accepted: {requirement.acceptedFormats?.join(", ") || "Document"}</p></div></div><div className="lg:w-[360px]">{document ? <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3"><FileText size={19} className="shrink-0 text-emerald-600" /><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-slate-800">{document.fileName}</p><p className="text-[10px] text-emerald-700">Uploaded and ready for submission</p></div><CheckCircle2 size={18} className="shrink-0 text-emerald-600" /></div> : <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-xs font-bold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"><UploadCloud size={18} /><span>Choose document</span><input type="file" accept={requirement.acceptedFormats?.map((x) => `.${x.toLowerCase()}`).join(",") || ".pdf,.jpg,.jpeg,.png"} className="hidden" onChange={(e) => onFile(e.target.files?.[0])} /></label>}</div></div></div>;
}
