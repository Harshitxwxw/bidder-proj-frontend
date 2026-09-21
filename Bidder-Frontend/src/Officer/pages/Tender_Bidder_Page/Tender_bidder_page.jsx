import { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Users,
  FileCheck,
} from "lucide-react";

import {TenderBiddersCard} from "../Tender_Bidder_Page/TenderBiddersCard";

const initialTenders = [
  {
    id: 1,
    name: "Enterprise Cloud Infrastructure Modernization",
    location: "London, UK",
    sector: "IT & Telecom",
    bidders: [
      {
        id: 101,
        name: "Apex Cloud Solutions Ltd",
        complianceScore: 94,
        submittedDate: "2026-09-12",
      },
      {
        id: 102,
        name: "NovaTech Global Systems Inc.",
        complianceScore: 88,
        submittedDate: "2026-09-14",
      },
      {
        id: 103,
        name: "Vanguard Cybernetics",
        complianceScore: 76,
        submittedDate: "2026-09-13",
      },
      {
        id: 104,
        name: "CloudSphere Technologies",
        complianceScore: 88,
        submittedDate: "2026-09-10",
      },
    ],
  },

  {
    id: 2,
    name: "Metro Rail Signalling & Telecommunication Systems",
    location: "Frankfurt, Germany",
    sector: "Infrastructure",
    bidders: [
      {
        id: 201,
        name: "Siemens Mobility Co.",
        complianceScore: 98,
        submittedDate: "2026-09-08",
      },
      {
        id: 202,
        name: "Alstom Transport Solutions",
        complianceScore: 91,
        submittedDate: "2026-09-10",
      },
      {
        id: 203,
        name: "Hitachi Rail Dynamics",
        complianceScore: 82,
        submittedDate: "2026-09-12",
      },
      {
        id: 204,
        name: "RailTech Systems",
        complianceScore: 91,
        submittedDate: "2026-09-07",
      },
    ],
  },

  {
    id: 3,
    name: "Smart Grid Renewable Energy Storage Phase II",
    location: "Austin, Texas",
    sector: "Energy & Utilities",
    bidders: [
      {
        id: 301,
        name: "GreenGrid Energy",
        complianceScore: 96,
        submittedDate: "2026-09-09",
      },
      {
        id: 302,
        name: "PowerCore Industries",
        complianceScore: 89,
        submittedDate: "2026-09-11",
      },
      {
        id: 303,
        name: "RenewTech Solutions",
        complianceScore: 89,
        submittedDate: "2026-09-08",
      },
    ],
  },

  {
    id: 4,
    name: "State Healthcare Digital Health Record Integration",
    location: "Toronto, Canada",
    sector: "Healthcare",
    bidders: [
      {
        id: 401,
        name: "MedCore Technologies",
        complianceScore: 95,
        submittedDate: "2026-09-06",
      },
      {
        id: 402,
        name: "HealthData Systems",
        complianceScore: 87,
        submittedDate: "2026-09-10",
      },
      {
        id: 403,
        name: "DigitalCare Solutions",
        complianceScore: 87,
        submittedDate: "2026-09-08",
      },
    ],
  },
];

const Tender_bidder_page = () => {
  const location = useLocation();
  const [tenders] = useState(initialTenders);
  const [openTenderId, setOpenTenderId] = useState(
    () => location.state?.selectedTenderId ?? null
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (location.state?.selectedTenderId) {
      setOpenTenderId(location.state.selectedTenderId);
      setTimeout(() => {
        const el = document.getElementById(
          `tender-${location.state.selectedTenderId}`
        );
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 150);
    }
  }, [location.state]);

  const filteredTenders = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return tenders;
    }

    return tenders.filter(
      (tender) =>
        tender.name.toLowerCase().includes(value) ||
        tender.location.toLowerCase().includes(value) ||
        tender.sector.toLowerCase().includes(value)
    );
  }, [tenders, search]);

  const handleTenderToggle = (tenderId) => {
    setOpenTenderId((currentId) =>
      currentId === tenderId ? null : tenderId
    );
  };

  return (
    <div className="min-h-screen bg-transparent p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
            <span>Evaluation Engine</span>

            <span className="h-1 w-1 rounded-full bg-slate-300" />

            <span className="text-slate-400">
              Tender Bidders
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Tenders & Bidders
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Open a tender to review its submitted bidders and
            compliance scores.
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="group rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 group-hover:text-blue-500 transition-colors">
              Total Tenders
            </p>

            <div className="rounded-xl bg-blue-50 p-2 text-blue-600 transition-transform duration-300 group-hover:scale-110">
              <FileCheck size={18} />
            </div>
          </div>

          <p className="text-3xl font-bold tracking-tight text-slate-900">
            {tenders.length}
          </p>

          <p className="mt-1 text-xs font-medium text-slate-500">
            Available for evaluation
          </p>
        </div>

        <div className="group rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 group-hover:text-indigo-500 transition-colors">
              Total Bidders
            </p>

            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 transition-transform duration-300 group-hover:scale-110">
              <Users size={18} />
            </div>
          </div>

          <p className="text-3xl font-bold tracking-tight text-slate-900">
            {tenders.reduce(
              (total, tender) => total + tender.bidders.length,
              0
            )}
          </p>

          <p className="mt-1 text-xs font-medium text-slate-500">
            Across all tenders
          </p>
        </div>

        <div className="group rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 group-hover:text-emerald-500 transition-colors">
              Open Tender
            </p>

            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 transition-transform duration-300 group-hover:scale-110">
              <ChevronDown size={18} />
            </div>
          </div>

          <p className="text-3xl font-bold tracking-tight text-slate-900">
            {openTenderId ? "1" : "0"}
          </p>

          <p className="mt-1 text-xs font-medium text-slate-500">
            Currently expanded
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <button
            type="button"
            className="flex items-center justify-between gap-8 rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <span>All Domains</span>
            <ChevronDown size={15} className="text-slate-400" />
          </button>

          <button
            type="button"
            className="flex items-center justify-between gap-8 rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <span>All Locations</span>
            <ChevronDown size={15} className="text-slate-400" />
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <SlidersHorizontal size={15} className="text-slate-400" />
            Filters
          </button>

          <div className="relative ml-auto w-full lg:w-96">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors peer-focus:text-blue-500"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search tender..."
              className="peer w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100/50"
            />
          </div>
        </div>
      </div>

      {/* Tender Cards */}
      <div className="space-y-2.5">
        {filteredTenders.map((tender) => (
          <TenderBiddersCard
            key={tender.id}
            tender={tender}
            isOpen={openTenderId === tender.id}
            onToggle={() => handleTenderToggle(tender.id)}
          />
        ))}
      </div>

      {filteredTenders.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300/80 bg-white/60 p-12 text-center backdrop-blur-xl">
          <p className="text-sm font-semibold text-slate-700">
            No tenders found.
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Try another search term.
          </p>
        </div>
      )}
    </div>
  );
};

export  {Tender_bidder_page};