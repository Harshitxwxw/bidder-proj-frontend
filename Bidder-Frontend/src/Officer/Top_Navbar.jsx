import {
  Bell,
  HelpCircle,
  Search,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";

const Top_Navbar = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-slate-200/60 bg-white/70 backdrop-blur-md px-6 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <ShieldCheck size={18} />
          </div>

          <div className="leading-tight">
            <p className="text-sm font-bold">ProcureX</p>
            <p className="text-[10px] text-slate-500">
              Enterprise Portal
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 text-sm text-slate-500 md:flex">
          <span className="font-medium text-slate-700">
            ProcureX System
          </span>

          <span className="text-slate-300">/</span>

          <span>Procurement Operations</span>
        </div>
      </div>

      {/* Search */}
      <div className="hidden w-[360px] items-center rounded-xl border border-slate-200/80 bg-slate-50/50 px-3 py-2 lg:flex transition-all focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100/50 focus-within:border-blue-400">
        <Search size={16} className="text-slate-400" />

        <input
          type="text"
          placeholder="Search tenders, vendors, IDs..."
          className="ml-2 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />

        <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">
          ⌘K
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative rounded-xl p-2 text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-800"
        >
          <Bell size={19} />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <button
          type="button"
          className="rounded-xl p-2 text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-800"
        >
          <HelpCircle size={19} />
        </button>

        <div className="ml-1 h-8 w-px bg-slate-200" />

        <button
          type="button"
          className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition-all duration-300 hover:bg-slate-100/80"
        >
          <div className="hidden text-right leading-tight sm:block">
            <p className="text-sm font-semibold text-slate-800">
              Director Vance
            </p>

            <p className="text-[11px] text-slate-500">
              Compliance Officer
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-sm font-semibold text-white">
            DV
          </div>

          <ChevronDown size={15} className="text-slate-400" />
        </button>
      </div>
    </header>
  );
};

export { Top_Navbar };