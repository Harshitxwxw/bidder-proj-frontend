import { useState } from "react";
import {
  FileText,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

const BidderDocument = ({
  document,
  onVerify,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white/70 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-slate-300 hover:shadow-md">
      {/* Document Row */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="group/btn flex w-full items-center gap-3 p-4 text-left transition-colors duration-300 hover:bg-slate-50/80"
      >
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            document.verified
              ? "bg-emerald-50 text-emerald-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          <FileText size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-800">
            {document.name}
          </p>

          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <CalendarDays size={13} />
            Uploaded {document.uploadDate}
          </div>
        </div>

        <div className="hidden sm:block">
          {document.verified ? (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 size={14} />
              Verified
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
              <AlertCircle size={14} />
              Not Verified
            </span>
          )}
        </div>

        <ExternalLink
          size={16}
          className="shrink-0 text-slate-400 transition-colors group-hover/btn:text-blue-500"
        />
      </button>

      {/* Open Document Details */}
      {open && (
        <div className="border-t border-slate-200/60 bg-slate-50/50 px-4 py-3">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Document status
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {document.verified
                  ? "This document has been verified."
                  : "This document requires verification."}
              </p>
            </div>

            {!document.verified && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onVerify();
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow"
              >
                Mark as Verified
              </button>
            )}

            {document.verified && (
              <span className="rounded-lg bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-700">
                Verification Complete
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export  {BidderDocument};