import { useState } from "react";
import {
  Building2,
  CalendarDays,
  ShieldCheck,
  ChevronDown,
  FileText,
} from "lucide-react";

import {BidderDocument} from "./BidderDocument";

const BidderCard = ({
  bidder,
  onDocumentStatusChange,
}) => {
  const [open, setOpen] = useState(false);

  const verifiedDocuments = bidder.documents.filter(
    (document) => document.verified
  ).length;

  const isFullyVerified =
    verifiedDocuments === bidder.documents.length;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Bidder Header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full flex-col gap-4 p-5 text-left transition hover:bg-slate-50 lg:flex-row lg:items-center"
      >
        {/* Icon */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Building2 size={20} />
        </div>

        {/* Name */}
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-bold text-slate-900">
            {bidder.name}
          </h2>

          <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} />
              Submitted {bidder.submittedDate}
            </span>

            <span className="flex items-center gap-1.5">
              <FileText size={14} />
              {bidder.documents.length} Documents
            </span>
          </div>
        </div>

        {/* Compliance */}
        <div className="flex items-center gap-3 lg:min-w-[180px]">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 lg:w-24 lg:flex-none">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{
                width: `${bidder.complianceScore}%`,
              }}
            />
          </div>

          <div className="text-right">
            <p className="text-lg font-bold text-slate-800">
              {bidder.complianceScore}%
            </p>

            <p className="text-[10px] text-slate-400">
              Compliance
            </p>
          </div>
        </div>

        {/* Verification */}
        <div
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
            isFullyVerified
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {verifiedDocuments}/{bidder.documents.length} Verified
        </div>

        {/* Expand */}
        <div
          className={`rounded-lg bg-slate-100 p-2 text-slate-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <ChevronDown size={17} />
        </div>
      </button>

      {/* Documents */}
      {open && (
        <div className="border-t border-slate-100 bg-slate-50/70 p-4">
          <div className="mb-3 flex items-center justify-between px-1">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Submitted Documents
              </h3>

              <p className="mt-0.5 text-xs text-slate-400">
                Click a document to open its details.
              </p>
            </div>

            <span className="text-xs font-medium text-slate-400">
              {bidder.documents.length} files
            </span>
          </div>

          <div className="space-y-2">
            {bidder.documents.map((document) => (
              <BidderDocument
                key={document.id}
                document={document}
                onVerify={() =>
                  onDocumentStatusChange(
                    bidder.id,
                    document.id
                  )
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export  {BidderCard};