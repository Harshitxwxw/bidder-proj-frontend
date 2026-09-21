import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Users,
  ShieldCheck,
  Clock3,
} from "lucide-react";

import {BidderCard} from "../Bidder_Page/BidderCard";

const initialBidders = [
  {
    id: 1,
    name: "Apex Cloud Solutions Ltd",
    complianceScore: 92,
    submittedDate: "Sep 12, 2026",
    documents: [
      {
        id: 101,
        name: "Statutory Business License & Tax Clearance Certificate",
        uploadDate: "Sep 12, 2026",
        verified: false,
      },
      {
        id: 102,
        name: "ISO 27001 / SOC 2 Information Security Compliance Audit",
        uploadDate: "Sep 14, 2026",
        verified: false,
      },
      {
        id: 103,
        name: "Audited Financial Statements FY24 & Bank Solvency Letter",
        uploadDate: "Sep 08, 2026",
        verified: true,
      },
    ],
  },

  {
    id: 2,
    name: "NovaTech Global Systems Inc.",
    complianceScore: 96,
    submittedDate: "Sep 14, 2026",
    documents: [
      {
        id: 201,
        name: "National Commercial Registry Extract & Articles of Incorporation",
        uploadDate: "Sep 16, 2026",
        verified: false,
      },
      {
        id: 202,
        name: "Quality Management Certification ISO 9001:2015",
        uploadDate: "Sep 10, 2026",
        verified: true,
      },
      {
        id: 203,
        name: "Bank Guarantee & Bid Bond Declaration",
        uploadDate: "Sep 11, 2026",
        verified: true,
      },
    ],
  },

  {
    id: 3,
    name: "Vertex Infrastructure Group",
    complianceScore: 88,
    submittedDate: "Sep 15, 2026",
    documents: [
      {
        id: 301,
        name: "Corporate Registration Certificate",
        uploadDate: "Sep 15, 2026",
        verified: true,
      },
      {
        id: 302,
        name: "Tax Compliance Certificate",
        uploadDate: "Sep 15, 2026",
        verified: false,
      },
    ],
  },

  {
    id: 4,
    name: "Global Meridian Technologies",
    complianceScore: 94,
    submittedDate: "Sep 16, 2026",
    documents: [
      {
        id: 401,
        name: "Business Operating License",
        uploadDate: "Sep 16, 2026",
        verified: true,
      },
      {
        id: 402,
        name: "Information Security Certification",
        uploadDate: "Sep 16, 2026",
        verified: true,
      },
    ],
  },
];

const Bidder_page = () => {
  const [bidders, setBidders] = useState(initialBidders);

  const handleDocumentStatusChange = (bidderId, documentId) => {
    setBidders((currentBidders) =>
      currentBidders.map((bidder) => {
        if (bidder.id !== bidderId) {
          return bidder;
        }

        return {
          ...bidder,
          documents: bidder.documents.map((document) =>
            document.id === documentId
              ? {
                  ...document,
                  verified: true,
                }
              : document
          ),
        };
      })
    );
  };


  return (
    <div className="min-h-screen bg-transparent p-6 lg:p-8">
      {/* Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
            <span>Bidder Registry</span>

            <span className="h-1 w-1 rounded-full bg-slate-300" />

            <span className="text-slate-400">
              Compliance Center
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Bidders & Verification
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Review bidder submissions and verify their compliance
            documentation.
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="group rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 group-hover:text-blue-500 transition-colors">
              Registered Bidders
            </p>

            <div className="rounded-xl bg-blue-50 p-2 text-blue-600 transition-transform duration-300 group-hover:scale-110">
              <Users size={18} />
            </div>
          </div>

          <p className="text-3xl font-bold tracking-tight text-slate-900">
            142
          </p>

          <p className="mt-1 text-xs font-medium text-emerald-600">
            +12 this week
          </p>
        </div>

        <div className="group rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 group-hover:text-emerald-500 transition-colors">
              Verified Files
            </p>

            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 transition-transform duration-300 group-hover:scale-110">
              <ShieldCheck size={18} />
            </div>
          </div>

          <p className="text-3xl font-bold tracking-tight text-slate-900">
            894
          </p>

          <p className="mt-1 text-xs font-medium text-slate-500">
            87.2% clearance rate
          </p>
        </div>

        <div className="group rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-100 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 group-hover:text-amber-500 transition-colors">
              Pending Review
            </p>

            <div className="rounded-xl bg-amber-50 p-2 text-amber-600 transition-transform duration-300 group-hover:scale-110">
              <Clock3 size={18} />
            </div>
          </div>

          <p className="text-3xl font-bold tracking-tight text-slate-900">
            38
          </p>

          <p className="mt-1 text-xs font-medium text-amber-600">
            Requires verification
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row">
          <button className="flex items-center justify-between gap-8 rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900">
            All Domains
            <ChevronDown size={15} className="text-slate-400" />
          </button>

          <button className="flex items-center justify-between gap-8 rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900">
            All Locations
            <ChevronDown size={15} className="text-slate-400" />
          </button>

          <button className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900">
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
              placeholder="Search bidder..."
              className="peer w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100/50"
            />
          </div>
        </div>
      </div>

      {/* Bidders */}
      <div className="space-y-2.5">
        {bidders.map((bidder) => (
          <BidderCard
            key={bidder.id}
            bidder={bidder}
            onDocumentStatusChange={handleDocumentStatusChange}
          />
        ))}
      </div>
    </div>
  );
};

export  {Bidder_page};