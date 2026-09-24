import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowLeft, Check, CheckCircle2, FileText, LockKeyhole, UploadCloud, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import BidderTopbar from "../components/BidderTopbar";
import { bidderService } from "../services/bidderService";

export default function DocumentUpload() {
  const { tenderId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [tender, setTender] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // First get the tender to show UI quickly
        const t = await bidderService.getTenderById(tenderId);
        setTender(t);

        // Fetch user applications
        const apps = await bidderService.getApplications();
        let app = apps.find(a => (a.tender_id === tenderId || a.tender?.tender_id === tenderId) && a.status === "DRAFT");
        
        if (!app) {
          // If no draft exists, initiate one behind the scenes
          app = await bidderService.initiateApplication(tenderId);
        }
        
        // Fetch full application to get documents
        const fullApp = await bidderService.getApplication(app.application_id);
        setApplication(fullApp);

      } catch (err) {
        console.error(err);
        setError("Failed to load application details: " + (err.response?.data?.detail || err.message));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tenderId]);

  const mandatory = useMemo(() => tender?.requirements?.filter((item) => item.mandatory) || [], [tender]);
  
  // Documents map requirement_id to uploaded document
  const docsMap = useMemo(() => {
    const map = {};
    if (application?.documents) {
      application.documents.forEach(d => {
        map[d.req_string_id || d.requirement_id] = d;
      });
    }
    return map;
  }, [application]);

  const missing = mandatory.filter((item) => !docsMap[item.requirement_id || item.requirementId]);
  const completed = tender?.requirements?.filter((item) => docsMap[item.requirement_id || item.requirementId])?.length || 0;

  if (loading || !tender) return <div className="p-10 text-sm text-slate-500">Loading application…</div>;

  const chooseFile = async (requirement, file) => {
    setError("");
    if (!file) return;
    const allowed = (requirement.acceptedFormats || requirement.accepted_formats)?.split(",") || [];
    const ext = file.name.split(".").pop()?.toLowerCase();
    
    let parsedAllowed = [];
    if (Array.isArray(allowed)) {
      parsedAllowed = allowed.map(x => x.trim().toLowerCase());
    } else if (typeof allowed === 'string') {
      parsedAllowed = allowed.split(",").map(x => x.trim().toLowerCase());
    }

    if (parsedAllowed.length && !parsedAllowed.includes(ext) && parsedAllowed[0] !== "") {
      setError(`${requirement.name || requirement.requirement_name}: ${file.name} is not an accepted format. Accepted formats: ${parsedAllowed.join(", ")}.`);
      return;
    }
    
    if (!application) {
      setError("Application not ready yet.");
      return;
    }

    try {
      setUploading(true);
      const reqId = requirement.requirement_id || requirement.requirementId;
      await bidderService.uploadDocument(application.application_id, reqId, file);
      // Reload application to get updated documents list
      const app = await bidderService.getApplication(application.application_id);
      setApplication(app);
    } catch (err) {
      setError("Failed to upload document: " + (err.response?.data?.detail || err.message));
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    if (missing.length) {
      setError(`Please upload all mandatory documents before submission. Remaining: ${missing.map((item) => item.name || item.requirement_name).join(", ")}.`);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!application) return;

    try {
      setSubmitting(true);
      await bidderService.submitApplication(application.application_id);
      navigate(`/bidder/tenders/${tenderId}/status?submitted=true`);
    } catch (err) {
      setError("Failed to submit application: " + (err.response?.data?.detail || err.message));
      setSubmitting(false);
    }
  };

  return <div><BidderTopbar title="Document Upload" subtitle={`Application evidence for ${tender.tender_id || tender.tenderId}`} /><div className="mx-auto max-w-[1100px] p-6 lg:p-8">
    <button onClick={() => navigate(`/bidder/tenders/${tenderId}/details`)} className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600"><ArrowLeft size={15} /> Back to Tender Details</button>
    <div className="mb-5 flex flex-col justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 sm:flex-row sm:items-center"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-600">Submission checklist</p><h2 className="mt-1 text-lg font-extrabold text-slate-900">Upload required evidence</h2><p className="mt-1 text-xs text-slate-500">All mandatory requirements must have evidence before you can submit.</p></div><div className="min-w-[150px] text-right"><p className="text-2xl font-extrabold text-blue-700">{completed}/{tender.requirements?.length}</p><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">requirements covered</p></div></div>
    {error && <div className="mb-5 flex gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700"><AlertCircle size={17} className="shrink-0" /><div><p className="font-bold">Submission cannot continue</p><p className="mt-1 leading-5">{error}</p></div><button className="ml-auto shrink-0" onClick={() => setError("")}><X size={15} /></button></div>}
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-6 py-5"><h3 className="text-base font-extrabold text-slate-900">Required documents</h3><p className="mt-1 text-xs text-slate-500">Each requirement below maps to one evidence slot. Documents cannot be changed after final submission.</p></div><div className="divide-y divide-slate-100">{(tender.requirements || []).map((requirement, index) => <RequirementUpload key={requirement.requirement_id || requirement.requirementId} requirement={requirement} index={index} document={docsMap[requirement.requirement_id || requirement.requirementId]} onFile={(file) => chooseFile(requirement, file)} uploading={uploading} />)}</div><div className="flex flex-col justify-between gap-4 border-t border-slate-100 bg-slate-50/70 px-6 py-5 sm:flex-row sm:items-center"><div className="flex items-center gap-2 text-[11px] text-slate-500"><LockKeyhole size={14} /> Final submission locks your uploaded evidence.</div><button disabled={submitting || uploading || !application} onClick={submit} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:bg-slate-300">{submitting ? "Submitting…" : "Submit Application"} <Check size={15} /></button></div></section>
  </div></div>;
}

function RequirementUpload({ requirement, index, document, onFile, uploading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const allowed = requirement.acceptedFormats?.join(",") || requirement.accepted_formats || "pdf,jpg,png";

  const handleUpload = () => {
    if (selectedFile) {
      onFile(selectedFile);
      setSelectedFile(null);
    }
  };

  return (
    <div className="px-6 py-6 transition-colors hover:bg-slate-50/50">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-extrabold text-slate-500 shadow-sm border border-slate-200/60">
            {index + 1}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-bold text-slate-900">{requirement.name || requirement.requirement_name}</h4>
              {requirement.mandatory ? (
                <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-rose-600 border border-rose-100">Mandatory</span>
              ) : (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-slate-600 border border-slate-200">Optional</span>
              )}
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{requirement.description}</p>
            <p className="mt-2 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">Accepted: {allowed}</p>
          </div>
        </div>
        
        <div className="lg:w-[400px]">
          {document ? (
            <div className="group flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm transition hover:bg-emerald-50">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <FileText size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900">{document.original_file_name || document.fileName}</p>
                <p className="mt-0.5 text-[11px] font-semibold text-emerald-700">Uploaded & Ready</p>
              </div>
              <CheckCircle2 size={24} className="shrink-0 text-emerald-500" />
            </div>
          ) : selectedFile ? (
            <div className="flex flex-col gap-3 rounded-2xl border border-blue-200 bg-blue-50/50 p-4 shadow-sm transition-all">
              <div className="flex items-center gap-4">
                 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <FileText size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900">{selectedFile.name}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button 
                  onClick={() => setSelectedFile(null)} 
                  disabled={uploading}
                  className="flex-1 rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm border border-slate-200 transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpload} 
                  disabled={uploading}
                  className="flex-1 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:bg-slate-400 flex items-center justify-center gap-2"
                >
                  {uploading ? "Uploading..." : "Upload File"}
                </button>
              </div>
            </div>
          ) : (
            <label className={`group flex cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 px-4 py-8 transition hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-sm ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}>
              <div className="rounded-full bg-white p-2.5 text-slate-400 shadow-sm transition group-hover:text-blue-500 group-hover:scale-110">
                 <UploadCloud size={22} />
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold text-slate-600 group-hover:text-blue-700">Click to choose a file</span>
                <span className="mt-1 block text-xs font-medium text-slate-400">or drag and drop here</span>
              </div>
              <input type="file" accept={allowed.split(",").map((x) => `.${x.trim().toLowerCase()}`).join(",")} className="hidden" disabled={uploading} onChange={(e) => setSelectedFile(e.target.files?.[0])} />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
