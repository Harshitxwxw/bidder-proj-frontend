import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Plus,
  FileText,
} from "lucide-react";

import {TenderCard} from "./Tendercard";

const tenders = [
  {
    id: 1,
    name: "Enterprise Cloud Infrastructure Modernization",
    location: "London, UK",
    bidders: 8,
    sector: "IT & Telecom",
  },
  {
    id: 2,
    name: "Metro Rail Signalling & Telecommunication Systems",
    location: "Frankfurt, Germany",
    bidders: 12,
    sector: "Infrastructure",
  },
  {
    id: 3,
    name: "Smart Grid Renewable Energy Storage Phase II",
    location: "Austin, Texas",
    bidders: 6,
    sector: "Energy & Utilities",
  },
  {
    id: 4,
    name: "State Healthcare Digital Health Record Integration",
    location: "Toronto, Canada",
    bidders: 15,
    sector: "Healthcare",
  },
  {
    id: 5,
    name: "National Airport Terminal Logistics Automation",
    location: "Singapore",
    bidders: 9,
    sector: "Logistics & Defense",
  },
  {
    id: 6,
    name: "Public Transport Fleet Management Platform",
    location: "Berlin, Germany",
    bidders: 7,
    sector: "Transportation",
  },
];

const Tender_Page = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
            <span>Procurement Workbench</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-slate-400">Central Registry</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Tenders Overview
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Browse and monitor active procurement opportunities across
            registered sectors.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={17} />
          Create Tender
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Total Tenders
            </span>

            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <FileText size={18} />
            </div>
          </div>

          <p className="text-2xl font-bold text-slate-900">142</p>
          <p className="mt-1 text-xs text-emerald-600">
            +8% from last month
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Active Bidding
            </span>

            <div className="rounded-lg bg-indigo-50 px-2.5 py-2 text-indigo-600">
              ●
            </div>
          </div>

          <p className="text-2xl font-bold text-slate-900">38</p>
          <p className="mt-1 text-xs text-slate-500">
            Across multiple regions
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Closing Soon
            </span>

            <div className="rounded-lg bg-amber-50 px-2.5 py-2 text-amber-600">
              !
            </div>
          </div>

          <p className="text-2xl font-bold text-slate-900">07</p>
          <p className="mt-1 text-xs text-slate-500">
            Within the next 7 days
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <button className="flex items-center justify-between gap-5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700">
            <span>All Sectors</span>
            <ChevronDown size={15} />
          </button>

          <button className="flex items-center justify-between gap-5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700">
            <span>All Locations</span>
            <ChevronDown size={15} />
          </button>

          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700">
            <SlidersHorizontal size={15} />
            Filters
          </button>

          <div className="relative ml-auto w-full lg:w-72">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search tenders..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      {/* Tender List */}
      <div className="space-y-2">
        {tenders.map((tender) => (
          <TenderCard
            key={tender.id}
            tender={tender}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            1–6
          </span>{" "}
          of 142 tenders
        </p>

        <div className="flex items-center gap-1">
          <button className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-400">
            ‹
          </button>

          <button className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white">
            1
          </button>

          <button className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
            2
          </button>

          <button className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
            3
          </button>

          <button className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600">
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export {Tender_Page};
