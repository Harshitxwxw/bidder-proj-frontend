import { Building2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import { TendersNavbar } from "./Tender_nav";
import { TenderBidderNavbar } from "./Tender_bidder_nav";
import { BidderInfoNavbar } from "./Bidder_nav";

const LeftNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      name: "Tenders",
      path: "/tenders",
      component: <TendersNavbar />,
    },
    {
      name: "Tender Bidder",
      path: "/tender-bidder",
      component: <TenderBidderNavbar />,
    },
    {
      name: "Bidder Info",
      path: "/bidder-info",
      component: <BidderInfoNavbar />,
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside className="flex h-screen w-[220px] flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Building2 size={17} />
        </div>

        <div className="leading-tight">
          <div className="text-sm font-bold text-slate-800">
            ProcureX
          </div>

          <div className="text-[10px] text-slate-400">
            Enterprise Portal
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-2 py-5">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => handleNavigation(item.path)}
              className={`w-full rounded-lg text-left transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              {item.component}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-100 p-3">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-[11px] font-medium text-slate-500">
            Active RFPs
          </p>

          <p className="mt-1 text-xl font-bold text-slate-800">
            28
          </p>

          <p className="text-[10px] text-slate-400">
            Currently open
          </p>
        </div>
      </div>
    </aside>
  );
};

export { LeftNavbar };