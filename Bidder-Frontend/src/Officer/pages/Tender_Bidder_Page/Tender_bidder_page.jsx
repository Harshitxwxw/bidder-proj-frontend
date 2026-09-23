import { useMemo, useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  Search,
  ChevronDown,
  Users,
  FileCheck,
  Loader2,
  Building,
  MapPin,
  RotateCcw,
  X,
  SlidersHorizontal,
} from "lucide-react";

import { TenderBiddersCard } from "./TenderBiddersCard";
import { officerService } from "../../services/officerService";
import { FilterDropdown } from "../../components/FilterDropdown";

const Tender_bidder_page = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzingTenders, setAnalyzingTenders] = useState({});
  const [openTenderId, setOpenTenderId] = useState(
    () => location.state?.selectedTenderId ?? null
  );

  // Initialize filters from URL parameters so navigating back preserves filter state!
  const [search, setSearch] = useState(() => searchParams.get("q") || "");
  const [selectedSector, setSelectedSector] = useState(
    () => searchParams.get("sector") || "ALL"
  );
  const [selectedLocation, setSelectedLocation] = useState(
    () => searchParams.get("location") || "ALL"
  );

  // Sync state to URL search parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (selectedSector !== "ALL") params.set("sector", selectedSector);
    if (selectedLocation !== "ALL") params.set("location", selectedLocation);

    setSearchParams(params, { replace: true });
  }, [search, selectedSector, selectedLocation, setSearchParams]);

  useEffect(() => {
    let isMounted = true;

    const loadTenderBidders = async () => {
      try {
        setLoading(true);
        const data = await officerService.fetchTendersWithBidders();
        if (isMounted) {
          setTenders(data || []);
        }
      } catch (err) {
        console.error("Failed to load tender bidders via axios:", err);
        if (isMounted) {
          setTenders([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTenderBidders();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (location.state?.selectedTenderId) {
      setOpenTenderId(location.state.selectedTenderId);
      setTimeout(() => {
        const el = document.getElementById(
          `tender-${location.state.selectedTenderId}`
        );
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 150);
    }
  }, [location.state]);

  const handleAnalyze = async (tenderId) => {
    try {
      setAnalyzingTenders((prev) => ({ ...prev, [tenderId]: true }));
      setOpenTenderId(tenderId);

      const targetTender = tenders.find((t) => t.id === tenderId);
      const currentBidders = targetTender ? targetTender.bidders : [];

      const result = await officerService.analyzeTenderBidders(
        tenderId,
        currentBidders
      );

      if (result && Array.isArray(result.bidders)) {
        setTenders((prevTenders) =>
          prevTenders.map((tender) => {
            if (tender.id !== tenderId) return tender;

            const updatedBidders = (tender.bidders || []).map((bidder, index) => {
              const match =
                result.bidders.find(
                  (b) =>
                    (b.id && b.id === bidder.id) ||
                    (b.application_id && b.application_id === bidder.application_id) ||
                    (b.name && b.name.toLowerCase() === bidder.name.toLowerCase())
                ) || result.bidders[index];

              if (match && typeof match.complianceScore === "number") {
                return { ...bidder, complianceScore: match.complianceScore };
              }
              return bidder;
            });

            return {
              ...tender,
              bidders: updatedBidders,
            };
          })
        );
      }
    } catch (err) {
      console.error(`Failed to analyze tender ${tenderId}:`, err);
    } finally {
      setAnalyzingTenders((prev) => ({ ...prev, [tenderId]: false }));
    }
  };

  // Dynamic filter lists with counts from database tenders
  const sectorOptions = useMemo(() => {
    const counts = {};
    tenders.forEach((t) => {
      if (t.sector) {
        counts[t.sector] = (counts[t.sector] || 0) + 1;
      }
    });
    const list = Object.keys(counts)
      .sort()
      .map((sec) => ({
        value: sec,
        label: sec,
        count: counts[sec],
      }));
    return [
      { value: "ALL", label: `All Sectors (${tenders.length})` },
      ...list,
    ];
  }, [tenders]);

  const locationOptions = useMemo(() => {
    const counts = {};
    tenders.forEach((t) => {
      if (t.location) {
        counts[t.location] = (counts[t.location] || 0) + 1;
      }
    });
    const list = Object.keys(counts)
      .sort()
      .map((loc) => ({
        value: loc,
        label: loc,
        count: counts[loc],
      }));
    return [{ value: "ALL", label: "All Locations" }, ...list];
  }, [tenders]);

  const filteredTenders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tenders.filter((tender) => {
      const matchesSearch =
        !query ||
        tender.name?.toLowerCase().includes(query) ||
        tender.location?.toLowerCase().includes(query) ||
        tender.sector?.toLowerCase().includes(query) ||
        tender.tender_id?.toLowerCase().includes(query) ||
        (tender.bidders &&
          tender.bidders.some(
            (b) =>
              b.name?.toLowerCase().includes(query) ||
              b.application_id?.toLowerCase().includes(query)
          ));

      const matchesSector =
        selectedSector === "ALL" || tender.sector === selectedSector;

      const matchesLocation =
        selectedLocation === "ALL" || tender.location === selectedLocation;

      return matchesSearch && matchesSector && matchesLocation;
    });
  }, [tenders, search, selectedSector, selectedLocation]);

  const handleTenderToggle = (tenderId) => {
    setOpenTenderId((currentId) =>
      currentId === tenderId ? null : tenderId
    );
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedSector !== "ALL" ||
    selectedLocation !== "ALL";

  const handleResetFilters = () => {
    setSearch("");
    setSelectedSector("ALL");
    setSelectedLocation("ALL");
  };

  const totalBiddersCount = useMemo(() => {
    return tenders.reduce(
      (total, tender) => total + (tender.bidders ? tender.bidders.length : 0),
      0
    );
  }, [tenders]);

  return (
    <div className="min-h-screen bg-transparent p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
            <span>Evaluation Engine</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-slate-400">Tender Bidders</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Tenders & Bidders
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Open a tender to review its submitted bidders and compliance scores.
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="group rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 group-hover:text-blue-500 transition-colors">
              Total Tenders
            </p>

            <div className="rounded-xl bg-blue-50 p-2 text-blue-600 transition-transform duration-300 group-hover:scale-110">
              <FileCheck size={18} />
            </div>
          </div>

          <p className="text-3xl font-bold tracking-tight text-slate-900">
            {loading ? "..." : tenders.length}
          </p>

          <p className="mt-1 text-xs font-medium text-slate-500">
            Available for evaluation
          </p>
        </div>

        <div className="group rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 group-hover:text-indigo-500 transition-colors">
              Total Bidders
            </p>

            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 transition-transform duration-300 group-hover:scale-110">
              <Users size={18} />
            </div>
          </div>

          <p className="text-3xl font-bold tracking-tight text-slate-900">
            {loading ? "..." : totalBiddersCount}
          </p>

          <p className="mt-1 text-xs font-medium text-slate-500">
            Across all tenders in database
          </p>
        </div>

        <div className="group rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 group-hover:text-emerald-500 transition-colors">
              Open Tender
            </p>

            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 transition-transform duration-300 group-hover:scale-110">
              <ChevronDown size={18} />
            </div>
          </div>

          <p className="text-3xl font-bold tracking-tight text-slate-900">
            {openTenderId ? "1" : "0"}
          </p>

          <p className="mt-1 text-xs font-medium text-slate-500">
            Currently expanded
          </p>
        </div>
      </div>

      {/* Interactive Filters Bar */}
      <div className="relative z-30 mb-8 rounded-2xl border border-slate-200/80 bg-white/85 p-4 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Sector Filter */}
          <FilterDropdown
            label="Sector"
            value={selectedSector}
            onChange={(val) => setSelectedSector(val)}
            options={sectorOptions}
            icon={Building}
            allValue="ALL"
            allLabel={`All Sectors (${tenders.length})`}
            placeholder="All Sectors"
          />

          {/* Location Filter */}
          <FilterDropdown
            label="Location"
            value={selectedLocation}
            onChange={(val) => setSelectedLocation(val)}
            options={locationOptions}
            icon={MapPin}
            allValue="ALL"
            allLabel="All Locations"
            placeholder="All Locations"
          />

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-red-200/80 bg-red-50/80 px-3.5 text-xs font-semibold text-red-600 transition-all hover:bg-red-100 hover:text-red-700 cursor-pointer shadow-2xs"
              title="Clear all filters"
            >
              <RotateCcw size={13} />
              Reset Filters
            </button>
          )}

          {/* Search Input */}
          <div className="relative w-full lg:ml-auto lg:w-96">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors peer-focus:text-blue-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tender, bidder name, location..."
              className="peer h-10 w-full rounded-xl border border-slate-200/80 bg-white/90 py-2 pl-9.5 pr-9 text-xs font-medium outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100/50 shadow-2xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Pills */}
        {hasActiveFilters && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-xs">
            <span className="font-semibold text-slate-400">Active Filters:</span>

            {selectedSector !== "ALL" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 font-medium text-blue-700">
                Sector: {selectedSector}
                <button
                  type="button"
                  onClick={() => setSelectedSector("ALL")}
                  className="hover:text-blue-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedLocation !== "ALL" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 font-medium text-indigo-700">
                Location: {selectedLocation}
                <button
                  type="button"
                  onClick={() => setSelectedLocation("ALL")}
                  className="hover:text-indigo-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {search && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2.5 py-1 font-medium text-slate-700">
                &ldquo;{search}&rdquo;
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="hover:text-slate-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Cards List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Loader2 size={36} className="animate-spin text-blue-600 mb-3" />
          <p className="text-sm font-semibold text-slate-700">
            Loading tenders and submitted bidders from database...
          </p>
          <p className="mt-1 text-xs text-slate-400">Fetching proposals and evaluation records</p>
        </div>
      ) : filteredTenders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300/80 bg-white/70 p-12 text-center backdrop-blur-xl">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Search size={22} />
          </div>
          <p className="text-base font-bold text-slate-800">
            {tenders.length === 0
              ? "No tenders or bidders found from database."
              : "No tenders or bidders matched your search."}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {tenders.length === 0
              ? "Ensure the backend server is running on port 8000 and the database has records."
              : "Try adjusting your sector, location, or search keyword."}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <RotateCcw size={13} />
              Reset All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTenders.map((tender) => (
            <TenderBiddersCard
              key={tender.id}
              tender={tender}
              isOpen={openTenderId === tender.id}
              onToggle={() => handleTenderToggle(tender.id)}
              onAnalyze={() => handleAnalyze(tender.id)}
              isAnalyzing={Boolean(analyzingTenders[tender.id])}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export { Tender_bidder_page };