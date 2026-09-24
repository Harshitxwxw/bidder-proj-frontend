import { Bell, HelpCircle, Search, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BidderTopbar({ title, subtitle }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white/95 px-7 backdrop-blur">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600">Bidder Portal</p>
        <h1 className="mt-0.5 text-lg font-extrabold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <button className="hidden h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs text-slate-500 sm:flex"><Search size={15} /> Quick search</button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"><HelpCircle size={17} /></button>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"><Bell size={17} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-blue-600" /></button>
        <button onClick={() => navigate('/bidder/profile')} className="ml-1 flex items-center gap-2 border-l border-slate-200 pl-3 hover:opacity-80 transition-opacity text-left">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white"><UserRound size={16} /></div>
          <div className="hidden leading-tight md:block"><p className="text-xs font-bold text-slate-800">Bidder Account</p><p className="text-[10px] text-slate-400">BID-2026-1048</p></div>
        </button>
      </div>
    </header>
  );
}
