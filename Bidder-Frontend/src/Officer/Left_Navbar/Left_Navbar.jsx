import { useState, useEffect } from "react";
import {
  Building2,
  PanelLeftClose,
  PanelLeftOpen,
  Briefcase,
  UsersRound,
  BadgeCheck,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import { TendersNavbar } from "./Tender_nav";
import { TenderBidderNavbar } from "./Tender_bidder_nav";
import { BidderInfoNavbar } from "./Bidder_nav";

const LeftNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("procurex_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("procurex_sidebar_collapsed", collapsed.toString());
    } catch {
      // ignore
    }
  }, [collapsed]);

  const navItems = [
    {
      name: "Tenders",
      path: "/officer/tenders",
      icon: Briefcase,
      component: <TendersNavbar />,
    },
    {
      name: "Tender Bidder",
      path: "/officer/tender-bidder",
      icon: UsersRound,
      component: <TenderBidderNavbar />,
    },
    {
      name: "Bidder Info",
      path: "/officer/bidder-info",
      icon: BadgeCheck,
      component: <BidderInfoNavbar />,
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col border-r border-blue-800/60 bg-[#1e40af] text-blue-100 transition-[width] duration-300 ease-in-out select-none shadow-lg ${
        collapsed ? "w-[68px]" : "w-[240px]"
      }`}
    >
      {/* Header: Logo & Collapse/Expand Toggle */}
      <div
        className={`flex h-16 shrink-0 items-center border-b border-blue-700/60 ${
          collapsed
            ? "justify-center px-2"
            : "justify-between px-4"
        }`}
      >
        {collapsed ? (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-800/80 text-white hover:bg-white hover:text-blue-700 transition-all shadow-xs border border-blue-600/60"
            title="Expand sidebar"
          >
            <PanelLeftOpen size={18} />
          </button>
        ) : (
          <>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700 shadow-sm">
                <Building2 size={17} />
              </div>

              <div className="min-w-0 leading-tight">
                <div className="truncate text-sm font-bold text-white">
                  ProcureX
                </div>
                <div className="truncate text-[10px] font-medium text-blue-200">
                  Enterprise Portal
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-blue-200 hover:bg-blue-700/80 hover:text-white transition-colors"
              title="Collapse sidebar"
            >
              <PanelLeftClose size={17} />
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto py-4 ${collapsed ? "px-2" : "px-2.5"}`}>
        <div className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`);

            const Icon = item.icon;

            if (collapsed) {
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleNavigation(item.path)}
                  title={item.name}
                  className={`flex h-10 w-10 mx-auto items-center justify-center rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-white text-blue-800 shadow-md font-bold"
                      : "text-blue-100 hover:bg-blue-700/80 hover:text-white"
                  }`}
                >
                  <Icon size={19} />
                </button>
              );
            }

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNavigation(item.path)}
                className={`flex h-10 w-full items-center overflow-hidden rounded-lg p-0 text-left transition-all duration-200 ${
                  isActive
                    ? "bg-white text-blue-800 shadow-md font-semibold"
                    : "text-blue-100 hover:bg-blue-700/80 hover:text-white"
                }`}
              >
                <div className="flex h-full w-full items-center min-w-0">
                  {item.component}
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom Area */}
      <div className={`shrink-0 border-t border-blue-700/60 overflow-hidden ${collapsed ? "p-2.5" : "p-3"}`}>
        {collapsed ? (
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-900/60 text-xs font-bold text-white mx-auto border border-blue-600/60"
            title="28 Active RFPs currently open"
          >
            28
          </div>
        ) : (
          <div className="rounded-xl bg-blue-900/40 border border-blue-600/50 p-3 min-w-0">
            <p className="truncate text-[11px] font-semibold text-blue-200 uppercase tracking-wide">
              Active RFPs
            </p>

            <p className="mt-0.5 text-lg font-bold text-white">
              28
            </p>

            <p className="truncate text-[10px] text-blue-200/80">
              Currently open
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export { LeftNavbar };