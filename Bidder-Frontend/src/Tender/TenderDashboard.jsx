import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  Loader2,
  Building,
  MapPin,
  Users,
  IndianRupee,
  ArrowRight,
  Plus
} from "lucide-react";
import { tenderService } from "./services/tenderService";
import { CustomDropdown } from "../components/CustomDropdown";

// Creator-specific TenderCard
const CreatorTenderCard = ({ tender }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigate to manage bids for this tender (you can implement this route later)
    // navigate(`/tender/manage-bids`, { state: { selectedTenderId: tender.id } });
  };

  const formatCurrency = (value) => {
    if (!value) return "N/A";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatTurnover = (value) => {
    if (!value) return "N/A";
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr value`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(0)}L value`;
    }
    return `₹${value} value`;
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50/80 text-blue-600 border border-blue-100">
            <FileText size={22} />
          </div>
          <div>
            <p className="text-sm font-bold tracking-wide text-blue-600">
              {tender.tender_id || "TND-ID-N/A"}
            </p>
            <h2 className="mt-1 text-lg font-bold leading-tight text-slate-900 group-hover:text-blue-700 transition-colors">
              {tender.name || tender.title}
            </h2>
          </div>
        </div>
      </div>

      {tender.description && (
        <p className="text-sm text-slate-500 line-clamp-2 mt-1">
          {tender.description}
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mt-2">
        <div className="flex items-center gap-2 rounded-lg bg-slate-50/80 px-3 py-2 text-sm text-slate-600">
          <MapPin size={16} className="text-slate-400" />
          <span className="truncate">{tender.location || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-slate-50/80 px-3 py-2 text-sm text-slate-600">
          <Building size={16} className="text-slate-400" />
          <span className="truncate">{tender.sector || tender.category || "General"}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-slate-50/80 px-3 py-2 text-sm text-slate-600">
          <IndianRupee size={16} className="text-slate-400" />
          <span className="truncate">{formatTurnover(tender.estimated_value)}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-slate-50/80 px-3 py-2 text-sm text-slate-600">
          <Users size={16} className="text-slate-400" />
          <span className="truncate">{tender.bidders || 0} Bidders</span>
        </div>
      </div>

      <div className="my-1 h-px w-full bg-slate-100" />

      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Estimated Value
          </p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {formatCurrency(tender.estimated_value)}
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
          Manage Bids
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};


const TenderDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(() => searchParams.get("q") || "");
  const [selectedSector, setSelectedSector] = useState(() => searchParams.get("sector") || "ALL");
  const [selectedLocation, setSelectedLocation] = useState(() => searchParams.get("location") || "ALL");
  const [sortBy, setSortBy] = useState(() => searchParams.get("sort") || "DEFAULT");

  const [currentPage, setCurrentPage] = useState(() => {
    const p = parseInt(searchParams.get("page") || "1", 10);
    return isNaN(p) || p < 1 ? 1 : p;
  });
  const [pageSize, setPageSize] = useState(() => {
    const s = parseInt(searchParams.get("size") || "4", 10);
    return isNaN(s) || s < 1 ? 4 : s;
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (selectedSector !== "ALL") params.set("sector", selectedSector);
    if (selectedLocation !== "ALL") params.set("location", selectedLocation);
    if (sortBy !== "DEFAULT") params.set("sort", sortBy);
    if (currentPage > 1) params.set("page", String(currentPage));
    if (pageSize !== 4) params.set("size", String(pageSize));
    setSearchParams(params, { replace: true });
  }, [search, selectedSector, selectedLocation, sortBy, currentPage, pageSize, setSearchParams]);

  useEffect(() => {
    let isMounted = true;
    const loadTenders = async () => {
      try {
        setLoading(true);
        const data = await tenderService.getMyTenders();
        if (isMounted) setTenders(data || []);
      } catch (err) {
        console.error("Failed to load my tenders:", err);
        if (isMounted) setTenders([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadTenders();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedSector, selectedLocation, sortBy, pageSize]);

  const sectorOptions = useMemo(() => {
    const counts = {};
    tenders.forEach((t) => {
      const s = t.sector || t.category || "General";
      counts[s] = (counts[s] || 0) + 1;
    });
    const list = Object.keys(counts).sort().map((sec) => ({ value: sec, label: sec, count: counts[sec] }));
    return [{ value: "ALL", label: `All Sectors (${tenders.length})` }, ...list];
  }, [tenders]);

  const locationOptions = useMemo(() => {
    const counts = {};
    tenders.forEach((t) => {
      const l = t.location || "N/A";
      counts[l] = (counts[l] || 0) + 1;
    });
    const list = Object.keys(counts).sort().map((loc) => ({ value: loc, label: loc, count: counts[loc] }));
    return [{ value: "ALL", label: "All Locations" }, ...list];
  }, [tenders]);

  const sortOptions = [
    { value: "DEFAULT", label: "Default Order" },
    { value: "BIDDERS_DESC", label: "Most Bidders First" },
    { value: "VALUE_DESC", label: "Highest Value First" },
    { value: "NAME_ASC", label: "Title (A to Z)" },
  ];

  const filteredTenders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tenders.filter((tender) => {
      const name = tender.name || tender.title || "";
      const loc = tender.location || "N/A";
      const sec = tender.sector || tender.category || "General";

      const matchesSearch = !query || name.toLowerCase().includes(query) || loc.toLowerCase().includes(query) || sec.toLowerCase().includes(query) || (tender.tender_id || "").toLowerCase().includes(query);
      const matchesSector = selectedSector === "ALL" || sec === selectedSector;
      const matchesLocation = selectedLocation === "ALL" || loc === selectedLocation;

      return matchesSearch && matchesSector && matchesLocation;
    }).sort((a, b) => {
      if (sortBy === "BIDDERS_DESC") return (b.bidders || 0) - (a.bidders || 0);
      if (sortBy === "VALUE_DESC") return (b.estimated_value || 0) - (a.estimated_value || 0);
      if (sortBy === "NAME_ASC") return (a.name || a.title || "").localeCompare(b.name || b.title || "");
      return 0;
    });
  }, [tenders, search, selectedSector, selectedLocation, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredTenders.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredTenders.length);
  const paginatedTenders = useMemo(() => filteredTenders.slice(startIndex, endIndex), [filteredTenders, startIndex, endIndex]);

  return (
    <div className="min-h-screen bg-transparent p-6 lg:p-8">
      {/* Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
            <span>ProcureX System</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-slate-400">My Tenders</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Tenders Overview
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Browse and monitor your active procurement opportunities across registered sectors.
          </p>
        </div>
        <button
          onClick={() => navigate("/tender/create")}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          <Plus size={18} />
          Create Tender
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="group rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 group-hover:text-blue-500 transition-colors">
              Total Tenders
            </span>
            <div className="rounded-xl bg-blue-50 p-2 text-blue-600 transition-transform duration-300 group-hover:scale-110">
              <FileText size={18} />
            </div>
          </div>
          <p className="text-3xl font-bold tracking-tight text-slate-900">
            {loading ? "..." : tenders.length}
          </p>
          <p className="mt-1 text-xs font-medium text-emerald-600">
            Active in database
          </p>
        </div>

        <div className="group rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 group-hover:text-indigo-500 transition-colors">
              Active Bidding
            </span>
            <div className="rounded-xl bg-indigo-50 px-2.5 py-2 text-indigo-600 transition-transform duration-300 group-hover:scale-110">
              ●
            </div>
          </div>
          <p className="text-3xl font-bold tracking-tight text-slate-900">
            {loading ? "..." : tenders.filter((t) => (t.bidders || 0) > 0).length}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            With submitted bids
          </p>
        </div>

        <div className="group rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-100 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 group-hover:text-amber-500 transition-colors">
              Total Submissions
            </span>
            <div className="rounded-xl bg-amber-50 px-2.5 py-2 text-amber-600 transition-transform duration-300 group-hover:scale-110">
              !
            </div>
          </div>
          <p className="text-3xl font-bold tracking-tight text-slate-900">
            {loading ? "..." : tenders.reduce((acc, t) => acc + (t.bidders || 0), 0)}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Submitted bidder proposals
          </p>
        </div>
      </div>

      {/* Interactive Filters Bar */}
      <div className="relative z-30 mb-8 rounded-2xl border border-slate-200/80 bg-white/85 p-4 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <CustomDropdown 
            value={selectedSector} 
            onChange={setSelectedSector} 
            options={sectorOptions} 
            icon={Building} 
          />
          <CustomDropdown 
            value={selectedLocation} 
            onChange={setSelectedLocation} 
            options={locationOptions} 
            icon={MapPin} 
          />

          <div className="h-px bg-slate-200 lg:h-8 lg:w-px" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase text-slate-400">Sort</span>
            <div className="w-48">
              <CustomDropdown
                value={sortBy}
                onChange={setSortBy}
                options={sortOptions}
              />
            </div>
          </div>

          <div className="mt-2 flex-1 lg:ml-auto lg:mt-0">
            <div className="relative max-w-md lg:ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search tender, location, sector..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200/80 bg-white/50 py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tender Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : paginatedTenders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/50 p-12 text-center backdrop-blur-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-500">
            <Search size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No tenders found</h3>
          <p className="mt-2 text-sm text-slate-500">Try adjusting your filters or create a new tender.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {paginatedTenders.map((tender) => (
            <CreatorTenderCard key={tender.tender_id || tender.id} tender={tender} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/85 p-4 shadow-sm backdrop-blur-xl sm:flex-row">
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span className="font-medium">
              Showing {startIndex + 1}-{endIndex} of {filteredTenders.length}
            </span>
            <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
              <span>Show</span>
              <div className="w-24">
                <CustomDropdown
                  value={pageSize}
                  onChange={(val) => {
                    setPageSize(Number(val));
                    setCurrentPage(1);
                  }}
                  options={[
                    { value: 4, label: "4" },
                    { value: 8, label: "8" },
                    { value: 12, label: "12" },
                    { value: 24, label: "24" },
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
            >
              <ChevronsLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="px-2 text-sm font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
            >
              <ChevronsRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenderDashboard;
