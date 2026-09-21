import { useState } from "react";
import {
  Building2,
  CalendarDays,
  ChevronDown,
  FileText,
} from "lucide-react";

import { BidderDocument } from "./BidderDocument";

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
    <div className="group/card overflow-hidden rounded-xl border border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      {/* Bidder Header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full flex-col gap-3 p-3.5 text-left transition-colors duration-200 hover:bg-slate-50/50 sm:flex-row sm:items-center"
      >
        {/* Icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50/90 text-blue-600 shadow-xs transition-transform duration-200 group-hover/card:scale-105 group-hover/card:bg-blue-100/90">
          <Building2 size={18} />
        </div>

        {/* Name */}
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-slate-900">
            {bidder.name}
          </h2>

          <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <CalendarDays size={13} className="text-slate-400" />
              Submitted {bidder.submittedDate}
            </span>

            <span className="flex items-center gap-1">
              <FileText size={13} className="text-slate-400" />
              {bidder.documents.length} Documents
            </span>
          </div>
        </div>

        {/* Compliance Score (No green line) */}
        <div className="flex items-center gap-3 text-right">
          <div>
            <p className="text-base font-bold tracking-tight text-slate-800">
              {bidder.complianceScore}%
            </p>
            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              Compliance
            </p>
          </div>

          {/* Verification Badge */}
          <div
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              isFullyVerified
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                : "bg-amber-50 text-amber-700 border border-amber-200/50"
            }`}
          >
            {verifiedDocuments}/{bidder.documents.length} Verified
          </div>

          {/* Expand Chevron */}
          <div
            className={`rounded-lg bg-slate-50 p-2 text-slate-400 transition-all duration-200 group-hover/card:bg-slate-100 group-hover/card:text-slate-600 ${
              open ? "rotate-180 bg-blue-50 text-blue-600 group-hover/card:bg-blue-100 group-hover/card:text-blue-700" : ""
            }`}
          >
            <ChevronDown size={16} />
          </div>
        </div>
      </button>

      {/* Documents */}
      {open && (
        <div className="border-t border-slate-100 bg-slate-50/60 p-3.5">
          <div className="mb-2.5 flex items-center justify-between px-1">
            <div>
              <h3 className="text-xs font-semibold text-slate-800">
                Submitted Documents
              </h3>
              <p className="text-[11px] text-slate-400">
                Click a document to inspect details.
              </p>
            </div>

            <span className="text-xs font-medium text-slate-400">
              {bidder.documents.length} files
            </span>
          </div>

          <div className="space-y-1.5">
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

export { BidderCard };