import { useNavigate, useLocation } from "react-router-dom";
import { Building2, LayoutDashboard, Heart, FileText, Trophy, RotateCcw, ChevronRight } from "lucide-react";
import { clearBidderDemoData } from "../services/bidderStorage";

export default function BidderSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { label: "All Tenders", icon: LayoutDashboard, path: "/bidder/tenders" },
    { label: "Wishlist", icon: Heart, path: "/bidder/wishlist" },
    { label: "My Applications", icon: FileText, path: "/bidder/applications" },
    { label: "Allotted", icon: Trophy, path: "/bidder/allotted" },
  ];

  const isActive = (path) => location.pathname === path || (path === "/bidder/tenders" && location.pathname.startsWith("/bidder/tenders/"));

  const resetDemo = () => {
    clearBidderDemoData();
    window.location.reload();
  };

  return (
    <aside className="flex h-screen w-[238px] shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-[72px] shrink-0 items-center gap-3 border-b border-slate-100 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm"><Building2 size={18} /></div>
        <div className="leading-tight">
          <div className="text-[15px] font-extrabold tracking-tight text-slate-800">ProcureX</div>
          <div className="text-[10px] font-medium text-slate-400">Enterprise Portal</div>
        </div>
      </div>

      <div className="px-4 pt-5">
        <p className="px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Bidder Workspace</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <div className="space-y-1">
          {items.map(({ label, icon: Icon, path }) => (
            <button key={path} type="button" onClick={() => navigate(path)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-semibold transition ${isActive(path) ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`}>
              <Icon size={17} />
              <span className="flex-1">{label}</span>
              {isActive(path) && <ChevronRight size={15} />}
            </button>
          ))}
        </div>
      </nav>

      <div className="border-t border-slate-100 p-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Demo mode</p>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-500">Frontend uses mock data until FastAPI integration.</p>
          <button onClick={resetDemo} className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-blue-600"><RotateCcw size={12} /> Reset demo data</button>
        </div>
      </div>
    </aside>
  );
}
