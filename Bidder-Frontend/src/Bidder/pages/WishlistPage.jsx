import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import TenderCard from "../components/TenderCard";
import EmptyState from "../components/EmptyState";
import { bidderService } from "../services/bidderService";
import { getWishlist } from "../services/bidderStorage";
import BidderTopbar from "../components/BidderTopbar";

export default function WishlistPage({ hideTopbar }) {
  const [tenders, setTenders] = useState([]);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => { bidderService.getTenders().then((items) => setTenders(items.filter((item) => getWishlist().includes(item.tender_id || item.tenderId)))); }, [refresh]);
  return <div>{!hideTopbar && <BidderTopbar title="Wishlist" subtitle="Tenders you saved for later review." />}<div className={`mx-auto max-w-[1250px] ${hideTopbar ? "p-0 pt-4" : "p-6 lg:p-8"}`}><div className="mb-5 flex items-end justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Saved Tenders</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">Your Wishlist</h2></div><div className="flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600"><Heart size={14} fill="currentColor" /> {tenders.length}</div></div>{tenders.length ? <div className="grid gap-4 xl:grid-cols-2">{tenders.map((tender) => <TenderCard key={tender.tender_id || tender.tenderId} tender={tender} onWishlistChange={() => setRefresh((v) => v + 1)} />)}</div> : <EmptyState title="Your wishlist is empty" description="Save tenders from All Tenders and they will appear here." />}</div></div>;
}
