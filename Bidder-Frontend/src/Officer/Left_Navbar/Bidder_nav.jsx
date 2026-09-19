import { useEffect, useState } from "react";
import { ShieldCheck, ChevronRight } from "lucide-react";

const BIDDER_INFO_API = "/api/bidder-info/navigation";

const BidderInfoNavbar = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadBidderInfoNav = async () => {
      try {
        const response = await fetch(BIDDER_INFO_API);
        const data = await response.json();
        setItems(data?.items || []);
      } catch (error) {
        console.error(
          "Failed to load Bidder-Info navigation:",
          error
        );
      }
    };

    loadBidderInfoNav();
  }, []);

  return (
    <div className="space-y-1">
      <button className="group flex w-full items-center gap-3 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm">
        <ShieldCheck size={18} />

        <span className="flex-1 text-left">Bidder-Info</span>

        <ChevronRight size={15} className="text-blue-100" />
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

export { BidderInfoNavbar };