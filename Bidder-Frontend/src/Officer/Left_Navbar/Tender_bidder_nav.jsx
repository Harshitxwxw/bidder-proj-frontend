import { useEffect, useState } from "react";
import { FileCheck2, ChevronRight } from "lucide-react";

const TENDER_BIDDER_API = "/api/tender-bidder/navigation";

const TenderBidderNavbar = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadBidderTenderNav = async () => {
      try {
        const response = await fetch(TENDER_BIDDER_API);
        const data = await response.json();
        setItems(data?.items || []);
      } catch (error) {
        console.error(
          "Failed to load Bidder-Tender navigation:",
          error
        );
      }
    };

    loadBidderTenderNav();
  }, []);

  return (
    <div className="space-y-1">
      <button className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700">
        <FileCheck2
          size={18}
          className="text-slate-500 group-hover:text-blue-600"
        />

        <span className="flex-1 text-left">Bidder-Tender</span>

        <ChevronRight
          size={15}
          className="text-slate-400 transition group-hover:translate-x-0.5"
        />
      </button>

      {items.length > 0 && (
        <div className="ml-9 space-y-1">
          {items.map((item) => (
            <button
              key={item.id}
              className="block w-full rounded-md px-2 py-1.5 text-left text-xs text-slate-500 hover:bg-slate-50 hover:text-blue-600"
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export { TenderBidderNavbar };