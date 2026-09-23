import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  Loader2,
  RotateCcw,
  Building,
  MapPin,
  ArrowUpDown,
  X,
  SlidersHorizontal,
} from "lucide-react";

import { TenderCard } from "./Tendercard";
import { officerService } from "../../services/officerService";
import { FilterDropdown } from "../../components/FilterDropdown";

const Tender_Page = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize filters from URL query parameters so navigating back preserves filter state!
  const [search, setSearch] = useState(() => searchParams.get("q") || "");
  const [selectedSector, setSelectedSector] = useState(
    () => searchParams.get("sector") || "ALL"
  );
  const [selectedLocation, setSelectedLocation] = useState(
    () => searchParams.get("location") || "ALL"
  );
  const [sortBy, setSortBy] = useState(
    () => searchParams.get("sort") || "DEFAULT"
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(() => {
    const p = parseInt(searchParams.get("page") || "1", 10);
    return isNaN(p) || p < 1 ? 1 : p;
  });
  const [pageSize, setPageSize] = useState(() => {
    const s = parseInt(searchParams.get("size") || "4", 10);
    return isNaN(s) || s < 1 ? 4 : s;
  });

  // Sync state to URL search parameters whenever filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (selectedSector !== "ALL") params.set("sector", selectedSector);
    if (selectedLocation !== "ALL") params.set("location", selectedLocation);
    if (sortBy !== "DEFAULT") params.set("sort", sortBy);
    if (currentPage > 1) params.set("page", String(currentPage));
    if (pageSize !== 4) params.set("size", String(pageSize));

    setSearchParams(params, { replace: true });
  }, [
    search,
    selectedSector,
    selectedLocation,
    sortBy,
    currentPage,
    pageSize,
    setSearchParams,
  ]);

  useEffect(() => {
    let isMounted = true;

    const loadTenders = async () => {
      try {
        setLoading(true);
        const data = await officerService.fetchTenders();
        if (isMounted) {
          setTenders(data || []);
        }
      } catch (err) {
        console.error("Failed to load tenders via axios:", err);
        if (isMounted) {
          setTenders([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTenders();

    return () => {
      isMounted = false;
    };
  }, []);

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedSector, selectedLocation, sortBy, pageSize]);

  // Unique options with counts derived dynamically from database data
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

  const sortOptions = [
    { value: "DEFAULT", label: "Default Order" },
    { value: "BIDDERS_DESC", label: "Most Bidders First" },
    { value: "VALUE_DESC", label: "Highest Value First" },
    { value: "NAME_ASC", label: "Title (A to Z)" },
  ];

  // Filter and sort tenders
  const filteredTenders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tenders
      .filter((tender) => {
        const matchesSearch =
          !query ||
          tender.name?.toLowerCase().includes(query) ||
          tender.location?.toLowerCase().includes(query) ||
          tender.sector?.toLowerCase().includes(query) ||
          tender.tender_id?.toLowerCase().includes(query);

        const matchesSector =
          selectedSector === "ALL" || tender.sector === selectedSector;

        const matchesLocation =
          selectedLocation === "ALL" || tender.location === selectedLocation;

        return matchesSearch && matchesSector && matchesLocation;
      })
      .sort((a, b) => {
        if (sortBy === "BIDDERS_DESC") {
          return (b.bidders || 0) - (a.bidders || 0);
        }
        if (sortBy === "VALUE_DESC") {
          return (b.estimated_value || 0) - (a.estimated_value || 0);
        }
        if (sortBy === "NAME_ASC") {
          return (a.name || "").localeCompare(b.name || "");
        }
        return 0; // default order from database
      });
  }, [tenders, search, selectedSector, selectedLocation, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredTenders.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredTenders.length);
  const paginatedTenders = useMemo(() => {
    return filteredTenders.slice(startIndex, endIndex);
  }, [filteredTenders, startIndex, endIndex]);

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedSector !== "ALL" ||
    selectedLocation !== "ALL" ||
    sortBy !== "DEFAULT";

  const handleResetFilters = () => {
    setSearch("");
    setSelectedSector("ALL");
    setSelectedLocation("ALL");
    setSortBy("DEFAULT");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-transparent p-6 lg:p-8">
      {/* Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
            <span>Procurement Workbench</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-slate-400">Central Registry</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Tenders Overview
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Browse and monitor active procurement opportunities across registered sectors.
          </p>
        </div>
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

          {/* Sort By Filter */}
          <FilterDropdown
            label="Sort"
            value={sortBy}
            onChange={(val) => setSortBy(val)}
            options={sortOptions}
            icon={ArrowUpDown}
            allValue="DEFAULT"
            allLabel="Default Order"
            placeholder="Sort Order"
          />

          {/* Reset Filters Button */}
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

          {/* Search Box */}
          <div className="relative w-full lg:ml-auto lg:w-80">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors peer-focus:text-blue-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tender, location, sector..."
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

        {/* Active Filters Tag Pills */}
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

            {sortBy !== "DEFAULT" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 font-medium text-amber-700">
                Sorted
                <button
                  type="button"
                  onClick={() => setSortBy("DEFAULT")}
                  className="hover:text-amber-900"
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

      {/* Tender List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Loader2 size={36} className="animate-spin text-blue-600 mb-3" />
          <p className="text-sm font-semibold text-slate-700">
            Fetching active tenders from database...
          </p>
          <p className="mt-1 text-xs text-slate-400">Loading tenders and verified statistics</p>
        </div>
      ) : filteredTenders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300/80 bg-white/70 p-12 text-center backdrop-blur-xl">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Search size={22} />
          </div>
          <p className="text-base font-bold text-slate-800">
            {tenders.length === 0
              ? "No tenders found from database."
              : "No tenders match your filter criteria."}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {tenders.length === 0
              ? "Ensure the backend server is running on port 8000 and the database has tenders."
              : "Try resetting your sector, location, or search keyword."}
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
        <div className="space-y-2.5">
          {paginatedTenders.map((tender) => (
            <TenderCard key={tender.id} tender={tender} />
          ))}
        </div>
      )}

      {/* Modern Redesigned Pagination */}
      {!loading && filteredTenders.length > 0 && (
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/70 bg-white/85 px-6 py-4 shadow-sm backdrop-blur-xl transition-all">
          {/* Summary / Range Info */}
          <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500">
            <span>
              Showing{" "}
              <span className="font-bold text-slate-800">
                {startIndex + 1}–{endIndex}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-800">
                {filteredTenders.length}
              </span>{" "}
              tenders
            </span>

            {/* Rows Per Page Selector */}
            <div className="hidden sm:flex items-center gap-1.5 border-l border-slate-200 pl-3">
              <span className="text-xs text-slate-400">Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="rounded-lg border border-slate-200/80 bg-slate-50/70 px-2 py-1 text-xs font-semibold text-slate-700 outline-none focus:border-blue-400 cursor-pointer"
              >
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
              </select>
            </div>
          </div>

          {/* Page Controls */}
          <div className="flex items-center justify-center gap-1.5 select-none">
            {/* First Page */}
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              title="First Page"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:text-blue-600 disabled:opacity-30 disabled:pointer-events-none shadow-2xs"
            >
              <ChevronsLeft size={16} />
            </button>

            {/* Previous Page */}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              title="Previous Page"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:text-blue-600 disabled:opacity-30 disabled:pointer-events-none shadow-2xs"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Numeric Page Buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-2.5 text-xs font-bold transition-all shadow-2xs ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 scale-105"
                      : "border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next Page */}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              title="Next Page"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:text-blue-600 disabled:opacity-30 disabled:pointer-events-none shadow-2xs"
            >
              <ChevronRight size={16} />
            </button>

            {/* Last Page */}
            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              title="Last Page"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:text-blue-600 disabled:opacity-30 disabled:pointer-events-none shadow-2xs"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { Tender_Page };
