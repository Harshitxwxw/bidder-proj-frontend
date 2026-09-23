import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X } from "lucide-react";

/**
 * FilterDropdown
 *
 * A modern, beautifully styled filter dropdown designed for ProcureX Officer pages.
 * - Prevents premature dismissal or "going back" by using direct pointer-event handling.
 * - Floats in z-50 with glassmorphism and subtle drop shadows.
 * - Displays active filter badge, count labels, and clearable indicators.
 */
export const FilterDropdown = ({
  label,
  value,
  onChange,
  options = [],
  icon: Icon,
  allValue = "ALL",
  allLabel = "All",
  placeholder,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const isActive = value !== allValue && value !== "DEFAULT" && Boolean(value);

  // Normalize options array: handles both ["Option1", "Option2"] and [{ value, label, count }]
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === "object" && opt !== null) {
      return {
        value: opt.value,
        label: opt.label || opt.value,
        count: opt.count,
        subtext: opt.subtext,
      };
    }
    return {
      value: opt,
      label: opt === allValue ? allLabel : opt,
    };
  });

  // Find currently active option label
  const activeOption = normalizedOptions.find((opt) => opt.value === value);
  const displayLabel = activeOption
    ? activeOption.label
    : placeholder || `${allLabel} ${label || ""}`.trim();

  const handleSelect = (newValue) => {
    onChange(newValue);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(allValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`group relative flex h-10 w-full sm:w-auto items-center justify-between gap-2.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer select-none ${
          isActive
            ? "border-blue-500/80 bg-gradient-to-r from-blue-50 to-indigo-50/60 text-blue-800 shadow-sm shadow-blue-500/10 ring-2 ring-blue-500/20"
            : isOpen
            ? "border-blue-400 bg-white text-slate-900 shadow-sm ring-2 ring-blue-100"
            : "border-slate-200/80 bg-white/90 text-slate-700 hover:border-slate-300 hover:bg-white hover:text-slate-900 shadow-2xs"
        }`}
      >
        {/* Left Icon */}
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon
              size={14}
              className={`shrink-0 transition-colors ${
                isActive
                  ? "text-blue-600"
                  : isOpen
                  ? "text-blue-500"
                  : "text-slate-400 group-hover:text-slate-600"
              }`}
            />
          )}

          {/* Label Display */}
          <span className="truncate max-w-[140px] sm:max-w-[180px]">
            {displayLabel}
          </span>
        </div>

        {/* Right Badges / Chevron */}
        <div className="flex items-center gap-1.5 ml-1">
          {/* Active quick clear button */}
          {isActive && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => e.key === "Enter" && handleClear(e)}
              title="Reset this filter"
              className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-200/80 text-blue-700 hover:bg-blue-300 hover:text-blue-900 transition-colors cursor-pointer"
            >
              <X size={10} />
            </span>
          )}

          {/* Chevron */}
          <ChevronDown
            size={14}
            className={`shrink-0 transition-transform duration-200 ${
              isOpen
                ? "rotate-180 text-blue-600"
                : isActive
                ? "text-blue-500"
                : "text-slate-400 group-hover:text-slate-600"
            }`}
          />
        </div>
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 min-w-[210px] sm:min-w-[240px] max-h-72 overflow-y-auto rounded-2xl border border-slate-200/90 bg-white/95 p-1.5 shadow-xl shadow-slate-900/10 backdrop-blur-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150">
          {label && (
            <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
              Filter by {label}
            </div>
          )}

          <div className="space-y-0.5">
            {normalizedOptions.map((opt) => {
              const isSelected = opt.value === value;

              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  onPointerDown={(e) => {
                    // Prevent blur or document-level outside click listeners from prematurely intercepting
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelect(opt.value);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer text-left select-none ${
                    isSelected
                      ? "bg-blue-50 text-blue-700 font-bold shadow-2xs"
                      : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-1">
                    <span className="truncate">{opt.label}</span>
                    {opt.subtext && (
                      <span className="text-[10px] font-normal text-slate-400">
                        {opt.subtext}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                    {typeof opt.count === "number" && (
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                          isSelected
                            ? "bg-blue-200/60 text-blue-800"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {opt.count}
                      </span>
                    )}

                    {isSelected && (
                      <Check size={14} className="text-blue-600 stroke-[2.5]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
