import { Inbox } from "lucide-react";

export default function EmptyState({ title, description }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        <Inbox size={22} />
      </div>
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}
