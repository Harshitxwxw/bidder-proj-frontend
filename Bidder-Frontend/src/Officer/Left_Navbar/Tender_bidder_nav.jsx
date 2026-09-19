import { FileCheck2, ChevronRight } from "lucide-react";

const TenderBidderNavbar = () => {
  return (
    <div className="flex h-full w-full items-center gap-3 px-3">
      <FileCheck2 size={18} className="shrink-0" />

      <span className="flex-1 text-sm font-medium">
        Tender Bidder
      </span>

      <ChevronRight size={16} className="shrink-0" />
    </div>
  );
};

export { TenderBidderNavbar };