import { BadgeCheck, ChevronRight } from "lucide-react";

const BidderInfoNavbar = () => {
  return (
    <div className="flex h-full w-full items-center gap-3 px-3">
      <BadgeCheck size={18} className="shrink-0" />

      <span className="flex-1 truncate text-sm font-medium">
        Bidder Info
      </span>

      <ChevronRight size={16} className="shrink-0" />
    </div>
  );
};

export { BidderInfoNavbar };