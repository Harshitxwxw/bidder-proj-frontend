import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, ArrowDownAZ, ArrowUpAZ, CalendarDays, MapPin, Building2, IndianRupee, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BidderTopbar from "../components/BidderTopbar";
import TenderCard from "../components/TenderCard";
import EmptyState from "../components/EmptyState";
import { bidderService } from "../services/bidderService";
import { getWishlist } from "../services/bidderStorage"; // Keeping wishlist local for now as it wasn't requested

const initialFilters = { turnover: "all", location: "all", department: "all", fromDate: "", toDate: "", turnoverSort: "desc" };

export default function BidderDashboard() {
  const navigate = useNavigate();
  const [tenders, setTenders] = useState([]);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    bidderService.getTenders().then(setTenders).catch(console.error);
    bidderService.getApplications().then(setApplications).catch(console.error);
  }, []);

  const appliedTenderIds = new Set(applications.map((item) => item.tender?.tender_id || item.tender_id));
  const allottedIds = new Set(applications.filter(a => a.status === "APPROVED").map((item) => item.tender?.tender_id || item.tender_id));

  const visibleTenders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tenders
      .filter((tender) => !appliedTenderIds.has(tender.tender_id || tender.tenderId) && !allottedIds.has(tender.tender_id || tender.tenderId))
      .filter((tender) => !q || (tender.tender_id || tender.tenderId || "").toLowerCase().includes(q) || (tender.title || "").toLowerCase().includes(q))
      .filter((tender) => appliedFilters.turnover === "all" || (appliedFilters.turnover === "under-25" ? tender.estimated_value < 2500000 : appliedFilters.turnover === "25-50" ? tender.estimated_value >= 2500000 && tender.estimated_value <= 5000000 : appliedFilters.turnover === "50-100" ? tender.estimated_value > 5000000 && tender.estimated_value <= 10000000 : tender.estimated_value > 10000000))
      .filter((tender) => appliedFilters.location === "all" || tender.location === appliedFilters.location)
      .filter((tender) => appliedFilters.department === "all" || tender.category === appliedFilters.department)
      .filter((tender) => !appliedFilters.fromDate || new Date(tender.publish_date || tender.publishDate) >= new Date(appliedFilters.fromDate))
      .filter((tender) => !appliedFilters.toDate || new Date(tender.publish_date || tender.publishDate) <= new Date(appliedFilters.toDate))
      .sort((a, b) => appliedFilters.turnover !== "all" ? (appliedFilters.turnoverSort === "asc" ? a.estimated_value - b.estimated_value : b.estimated_value - a.estimated_value) : new Date(b.publish_date || b.publishDate) - new Date(a.publish_date || a.publishDate));
  }, [tenders, search, appliedFilters, refresh, appliedTenderIds, allottedIds]);

  const locations = [...new Set(tenders.map((item) => item.location).filter(Boolean))];
  const departments = [...new Set(tenders.map((item) => item.category || item.department).filter(Boolean))];

  const clearFilters = () => { setFilters(initialFilters); setAppliedFilters(initialFilters); };

  return (
    <div className="min-h-screen">
      <BidderTopbar title="All Tenders" subtitle="Discover and apply to procurement opportunities available to your organization." />
      <div className="mx-auto max-w-[1500px] p-6 lg:p-7">
        <div className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Tender Repository</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">Available Opportunities</h2>
            <p className="mt-1 text-xs text-slate-500">Only tenders you have not applied for are shown here.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-500"><span className="font-bold text-slate-800">{visibleTenders.length}</span> visible tenders</div>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-500"><span className="font-bold text-slate-800">{getWishlist().length}</span> wishlisted</div>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-500"><span className="font-bold text-slate-800">{applications.length}</span> applications</div>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by Tender ID or Tender Name" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-xs outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50" />
              {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"><X size={15} /></button>}
            </div>
            <button onClick={() => setFilterOpen((value) => !value)} className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-xs font-bold transition ${filterOpen ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}><SlidersHorizontal size={16} /> Filters</button>
          </div>

          {filterOpen && (
            <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 md:grid-cols-2 xl:grid-cols-5">
              <FilterSelect label="Estimated Value" icon={IndianRupee} value={filters.turnover} onChange={(value) => setFilters({ ...filters, turnover: value })} options={[["all", "Any value"], ["under-25", "Below ₹25L"], ["25-50", "₹25L – ₹50L"], ["50-100", "₹50L – ₹1Cr"], ["above-100", "Above ₹1Cr"]]} />
              <FilterSelect label="Location" icon={MapPin} value={filters.location} onChange={(value) => setFilters({ ...filters, location: value })} options={[["all", "All locations"], ...locations.map((value) => [value, value])]} />
              <FilterSelect label="Department" icon={Building2} value={filters.department} onChange={(value) => setFilters({ ...filters, department: value })} options={[["all", "All departments"], ...departments.map((value) => [value, value])]} />
              <DateField label="Published from" value={filters.fromDate} onChange={(value) => setFilters({ ...filters, fromDate: value })} />
              <DateField label="Published to" value={filters.toDate} onChange={(value) => setFilters({ ...filters, toDate: value })} />
              {filters.turnover !== "all" && (
                <div className="md:col-span-2 xl:col-span-5">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Value sorting</p>
                  <div className="flex gap-2">
                    <button onClick={() => setFilters({ ...filters, turnoverSort: "asc" })} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold ${filters.turnoverSort === "asc" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}><ArrowUpAZ size={14} /> Ascending</button>
                    <button onClick={() => setFilters({ ...filters, turnoverSort: "desc" })} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold ${filters.turnoverSort === "desc" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}><ArrowDownAZ size={14} /> Descending</button>
                  </div>
                </div>
              )}
              <div className="flex items-end gap-2 md:col-span-2 xl:col-span-5">
                <button onClick={() => { setAppliedFilters(filters); setFilterOpen(false); }} className="rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700">Apply Filter</button>
                <button onClick={clearFilters} className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50">Clear All</button>
              </div>
            </div>
          )}
        </section>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-xs text-slate-500">Showing <span className="font-bold text-slate-800">{visibleTenders.length}</span> opportunities</p>
          <button onClick={() => navigate("/bidder/wishlist")} className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"><Heart size={14} /> View wishlist</button>
        </div>

        {visibleTenders.length ? (
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            {visibleTenders.map((tender) => <TenderCard key={tender.tender_id || tender.tenderId} tender={tender} onWishlistChange={() => setRefresh((v) => v + 1)} />)}
          </div>
        ) : (
          <div className="mt-4"><EmptyState title="No tenders found" description="Try clearing the filters or search with a different Tender ID or name." /></div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({ label, icon: Icon, value, onChange, options }) {
  return <label className="block"><span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400"><Icon size={12} /> {label}</span><select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50">{options.map(([key, text]) => <option key={key} value={key}>{text}</option>)}</select></label>;
}

function DateField({ label, value, onChange }) {
  return <label className="block"><span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400"><CalendarDays size={12} /> {label}</span><input type="date" value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50" /></label>;
}
