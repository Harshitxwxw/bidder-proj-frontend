import { useState } from "react";
import { CheckCircle2, ShieldCheck, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { acknowledgeTender } from "../services/bidderStorage";
import { bidderService } from "../services/bidderService";
import { useEffect } from "react";

export default function TenderAcknowledgement() {
  const { tenderId } = useParams();
  const navigate = useNavigate();
  const [tender, setTender] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => { bidderService.getTenderById(tenderId).then(setTender); }, [tenderId]);

  if (!tender) return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading tenderΓÇª</div>;

  return (
    <div className="relative min-h-screen bg-slate-100">
      <div className="pointer-events-none min-h-screen opacity-40 blur-[1px]">
        <div className="h-20 border-b bg-white" /><div className="mx-auto max-w-6xl p-10"><div className="h-8 w-64 rounded bg-slate-200" /><div className="mt-6 grid grid-cols-2 gap-4"><div className="h-48 rounded-2xl bg-white" /><div className="h-48 rounded-2xl bg-white" /></div></div>
      </div>
      <div className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]" />
      <div className="fixed inset-0 z-40 flex items-center justify-center p-5">
        <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-7 shadow-2xl shadow-slate-900/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><ShieldCheck size={22} /></div><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-600">Tender acknowledgement</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">Verify before continuing</h2></div></div>
            <button onClick={() => navigate("/bidder/tenders")} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={18} /></button>
          </div>
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Selected tender</p><p className="mt-1 text-xs font-bold text-blue-600">{tender.tenderId}</p><p className="mt-1 text-sm font-bold text-slate-900">{tender.title}</p></div>
          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 hover:border-blue-200 hover:bg-blue-50/30">
            <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="mt-0.5 h-4 w-4 accent-blue-600" />
            <span className="text-xs leading-5 text-slate-600">I have read and understood the tender credentials, requirements, submission conditions and instructions. I acknowledge that I am visiting this tender to review and, if eligible, submit an application.</span>
          </label>
          <div className="mt-6 flex justify-end gap-2"><button onClick={() => navigate("/bidder/tenders")} className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50">Cancel</button><button disabled={!checked} onClick={() => { acknowledgeTender(tender.tenderId); navigate(`/bidder/tenders/${tender.tenderId}/details`); }} className="rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">Continue to Tender</button></div>
        </section>
      </div>
    </div>
  );
}
