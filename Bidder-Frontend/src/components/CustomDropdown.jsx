import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export const CustomDropdown = ({
  options = [],
  value,
  onChange,
  icon: Icon,
  placeholder = "Select an option",
  className = "",
  name
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Find currently active option label
  const activeOption = options.find((opt) => opt.value === value);
  const displayLabel = activeOption ? activeOption.label : placeholder;

  // Handle outside click to close dropdown
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutsideClick);
    return () => document.removeEventListener("pointerdown", handleOutsideClick);
  }, [isOpen]);

  const handleSelect = (val) => {
    // If it's used in a form where `onChange` expects an event-like object:
    // onChange({ target: { name, value: val } })
    // If it's used with direct value: onChange(val)
    if (name && typeof onChange === 'function') {
      // Simulate event
      onChange({ target: { name, value: val } });
    } else if (typeof onChange === 'function') {
      onChange(val);
    }
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Hidden native input for forms, if needed, though usually state is enough */}
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative flex w-full items-center justify-between gap-3 rounded-xl border bg-white py-3 pl-11 pr-10 text-sm font-medium outline-none transition-all cursor-pointer ${
          isOpen
            ? "border-blue-500 ring-2 ring-blue-100 shadow-sm"
            : "border-slate-200/80 hover:border-slate-300"
        }`}
      >
        {/* Left Icon (Absolute positioning matching inputs) */}
        {Icon && (
          <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon size={18} />
          </div>
        )}

        {/* Label */}
        <span className={`truncate ${!activeOption ? "text-slate-400" : "text-slate-800"}`}>
          {displayLabel}
        </span>

        {/* Right Chevron */}
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-blue-500" : ""}`}
          />
        </div>
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg animate-in fade-in zoom-in-95 duration-100">
          <div className="max-h-60 overflow-y-auto py-1">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault(); // prevent blur
                    handleSelect(opt.value);
                  }}
                  className={`flex w-full items-center px-4 py-2.5 text-sm transition-colors ${
                    isSelected
                      ? "bg-[#1d4ed8] text-white font-medium"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
