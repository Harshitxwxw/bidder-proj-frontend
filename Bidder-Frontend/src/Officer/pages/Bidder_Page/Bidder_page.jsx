import { useState, useEffect, useMemo } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  Search,
  ChevronDown,
  Users,
  ShieldCheck,
  Clock3,
  Loader2,
  CheckCircle2,
  RotateCcw,
  ArrowUpDown,
  X,
  SlidersHorizontal,
} from "lucide-react";

import { BidderCard } from "./BidderCard";
import { officerService } from "../../services/officerService";
import { FilterDropdown } from "../../components/FilterDropdown";

const Bidder_page = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [bidders, setBidders] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedBidderId = location.state?.selectedBidderId;

  useEffect(() => {
    if (selectedBidderId && !loading) {
      setTimeout(() => {
        const el = document.getElementById(`bidder-${selectedBidderId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 150);
    }
  }, [selectedBidderId, loading]);

  // Initialize filters from URL query parameters so navigating back preserves filter state!
  const [search, setSearch] = useState(() => searchParams.get("q") || "");
  const [statusFilter, setStatusFilter] = useState(
    () => searchParams.get("status") || "ALL"
  );
  const [scoreFilter, setScoreFilter] = useState(
    () => searchParams.get("score") || "ALL"
  );
  const [sortBy, setSortBy] = useState(
    () => searchParams.get("sort") || "DEFAULT"
  );

  // Sync state to URL search parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    if (scoreFilter !== "ALL") params.set("score", scoreFilter);
    if (sortBy !== "DEFAULT") params.set("sort", sortBy);

    setSearchParams(params, { replace: true });
  }, [search, statusFilter, scoreFilter, sortBy, setSearchParams]);

  useEffect(() => {
    let isMounted = true;

    const loadBidders = async () => {
      try {
        setLoading(true);
        const data = await officerService.fetchBiddersWithDocuments();
        if (isMounted) {
          setBidders(data || []);
        }
      } catch (err) {
        console.error("Failed to load bidders via axios:", err);
        if (isMounted) {
          setBidders([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBidders();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDocumentStatusChange = async (bidderId, documentId) => {
    // Optimistically update document verification status in state
    setBidders((currentBidders) =>
      currentBidders.map((bidder) => {
        if (bidder.id !== bidderId) {
          return bidder;
        }

        return {
          ...bidder,
          documents: (bidder.documents || []).map((document) =>
            document.id === documentId
              ? {
                  ...document,
                  verified: true,
                }
              : document
          ),
        };
      })
    );

    // Persist verification status in the database via backend
    try {
      await officerService.verifyDocument(documentId);
    } catch (err) {
      console.error(`Error verifying document ${documentId}:`, err);
    }
  };

  const filteredBidders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bidders
      .filter((bidder) => {
        const docs = bidder.documents || [];
        const verifiedCount = docs.filter((d) => d.verified).length;
        const totalDocs = docs.length;
        const isFullyVerified = totalDocs > 0 && verifiedCount === totalDocs;

        // Search text match
        const matchesSearch =
          !query ||
          bidder.name?.toLowerCase().includes(query) ||
          bidder.application_id?.toLowerCase().includes(query) ||
          docs.some((doc) => doc.name?.toLowerCase().includes(query));

        // Status match
        let matchesStatus = true;
        if (statusFilter === "VERIFIED") {
          matchesStatus = isFullyVerified;
        } else if (statusFilter === "PENDING") {
          matchesStatus = !isFullyVerified;
        }

        // Score tier match
        let matchesScore = true;
        const score = bidder.complianceScore || 0;
        if (scoreFilter === "HIGH") {
          matchesScore = score >= 90;
        } else if (scoreFilter === "MEDIUM") {
          matchesScore = score >= 70 && score < 90;
        }

        return matchesSearch && matchesStatus && matchesScore;
      })
      .sort((a, b) => {
        if (sortBy === "SCORE_DESC") {
          return (b.complianceScore || 0) - (a.complianceScore || 0);
        }
        if (sortBy === "NAME_ASC") {
          return (a.name || "").localeCompare(b.name || "");
        }
        if (sortBy === "PENDING_FIRST") {
          const aPending = (a.documents || []).filter((d) => !d.verified).length;
          const bPending = (b.documents || []).filter((d) => !d.verified).length;
          return bPending - aPending;
        }
        return 0;
      });
  }, [bidders, search, statusFilter, scoreFilter, sortBy]);

  const totalFiles = useMemo(() => {
    return bidders.reduce(
      (acc, bidder) => acc + (bidder.documents ? bidder.documents.length : 0),
      0
    );
  }, [bidders]);

  const verifiedFiles = useMemo(() => {
    return bidders.reduce(
      (acc, bidder) =>
        acc + (bidder.documents ? bidder.documents.filter((d) => d.verified).length : 0),
      0
    );
  }, [bidders]);

  const pendingFiles = Math.max(0, totalFiles - verifiedFiles);
  const clearanceRate =
    totalFiles > 0 ? Math.round((verifiedFiles / totalFiles) * 100) : 100;

  // Dynamic filter lists with counts
  const statusOptions = useMemo(() => {
    let verifiedCount = 0;
    let pendingCount = 0;
    bidders.forEach((b) => {
      const docs = b.documents || [];
      const v = docs.filter((d) => d.verified).length;
      if (docs.length > 0 && v === docs.length) {
        verifiedCount++;
      } else {
        pendingCount++;
      }
    });
    return [
      { value: "ALL", label: `All Statuses (${bidders.length})` },
      {
        value: "VERIFIED",
        label: "Fully Verified (3/3)",
        count: verifiedCount,
      },
      {
        value: "PENDING",
        label: "Pending Review (<3/3)",
        count: pendingCount,
      },
    ];
  }, [bidders]);

  const scoreOptions = useMemo(() => {
    let high = 0;
    let med = 0;
    let low = 0;
    bidders.forEach((b) => {
      const score = b.complianceScore || 0;
      if (score >= 90) high++;
      else if (score >= 70) med++;
      else low++;
    });
    return [
      { value: "ALL", label: "All Compliance Scores" },
      { value: "HIGH", label: "High Compliance (≥ 90%)", count: high },
      { value: "MEDIUM", label: "Medium Compliance (70%–89%)", count: med },
      { value: "LOW", label: "Low Compliance (< 70%)", count: low },
    ];
  }, [bidders]);

  const sortOptions = [
    { value: "DEFAULT", label: "Default Order" },
    { value: "SCORE_DESC", label: "Highest Score First" },
    { value: "PENDING_FIRST", label: "Pending Review First" },
    { value: "NAME_ASC", label: "Company Name (A to Z)" },
  ];

  const hasActiveFilters =
    search.trim() !== "" ||
    statusFilter !== "ALL" ||
    scoreFilter !== "ALL" ||
    sortBy !== "DEFAULT";

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setScoreFilter("ALL");
    setSortBy("DEFAULT");
  };

  return (
    <div className="min-h-screen bg-transparent p-6 lg:p-8">
      {/* Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
            <span>Bidder Registry</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-slate-400">Compliance Center</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Bidders & Verification
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Review bidder submissions and verify their compliance documentation.
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="group rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 group-hover:text-blue-500 transition-colors">
              Registered Bidders
            </p>

            <div className="rounded-xl bg-blue-50 p-2 text-blue-600 transition-transform duration-300 group-hover:scale-110">
              <Users size={18} />
            </div>
          </div>

          <p className="text-3xl font-bold tracking-tight text-slate-900">
            {loading ? "..." : bidders.length}
          </p>

          <p className="mt-1 text-xs font-medium text-emerald-600">
            Active vendor profiles in database
          </p>
        </div>

        <div className="group rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-100 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 group-hover:text-emerald-500 transition-colors">
              Verified Files
            </p>

            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 transition-transform duration-300 group-hover:scale-110">
              <ShieldCheck size={18} />
            </div>
          </div>

          <p className="text-3xl font-bold tracking-tight text-slate-900">
            {loading ? "..." : verifiedFiles}
          </p>

          <p className="mt-1 text-xs font-medium text-slate-500">
            {clearanceRate}% clearance rate
          </p>
        </div>

        <div className="group rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-100 hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 group-hover:text-amber-500 transition-colors">
              Pending Review
            </p>

            <div className="rounded-xl bg-amber-50 px-2.5 py-2 text-amber-600 transition-transform duration-300 group-hover:scale-110">
              <Clock3 size={18} />
            </div>
          </div>

          <p className="text-3xl font-bold tracking-tight text-slate-900">
            {loading ? "..." : pendingFiles}
          </p>

          <p className="mt-1 text-xs font-medium text-amber-600">
            Requires verification sign-off
          </p>
        </div>
      </div>

      {/* Interactive Filters Bar */}
      <div className="relative z-30 mb-8 rounded-2xl border border-slate-200/80 bg-white/85 p-4 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Status Filter */}
          <FilterDropdown
            label="Verification Status"
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            options={statusOptions}
            icon={ShieldCheck}
            allValue="ALL"
            allLabel={`All Statuses (${bidders.length})`}
            placeholder="All Verification Statuses"
          />

          {/* Compliance Score Filter */}
          <FilterDropdown
            label="Compliance Score"
            value={scoreFilter}
            onChange={(val) => setScoreFilter(val)}
            options={scoreOptions}
            icon={CheckCircle2}
            allValue="ALL"
            allLabel="All Scores"
            placeholder="All Compliance Scores"
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
              placeholder="Search company, app ID, document..."
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

            {statusFilter !== "ALL" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 font-medium text-blue-700">
                Status: {statusFilter === "VERIFIED" ? "Fully Verified" : "Pending Review"}
                <button
                  type="button"
                  onClick={() => setStatusFilter("ALL")}
                  className="hover:text-blue-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {scoreFilter !== "ALL" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 font-medium text-indigo-700">
                Score: {scoreFilter === "HIGH" ? "≥ 90%" : "70%–89%"}
                <button
                  type="button"
                  onClick={() => setScoreFilter("ALL")}
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

      {/* Bidders List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Loader2 size={36} className="animate-spin text-blue-600 mb-3" />
          <p className="text-sm font-semibold text-slate-700">
            Fetching registered bidders and documents from database...
          </p>
          <p className="mt-1 text-xs text-slate-400">Loading vendor verification statuses</p>
        </div>
      ) : filteredBidders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300/80 bg-white/70 p-12 text-center backdrop-blur-xl">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Search size={22} />
          </div>
          <p className="text-base font-bold text-slate-800">
            {bidders.length === 0
              ? "No bidders found from database."
              : "No bidders match your filter criteria."}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {bidders.length === 0
              ? "Ensure the backend server is running on port 8000 and the database has records."
              : "Try adjusting your verification status, score tier, or search query."}
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
        <div className="space-y-3">
          {filteredBidders.map((bidder) => (
            <BidderCard
              key={bidder.id}
              bidder={bidder}
              onDocumentStatusChange={handleDocumentStatusChange}
              defaultOpen={String(selectedBidderId) === String(bidder.id) || String(selectedBidderId) === String(bidder.bidder_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export { Bidder_page };