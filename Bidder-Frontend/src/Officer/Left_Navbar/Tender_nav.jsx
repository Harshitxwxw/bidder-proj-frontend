import { FolderOpen, ChevronRight } from "lucide-react";

const TendersNavbar = () => {
  return (
    <div className="flex h-full w-full items-center gap-3 px-3">
      <FolderOpen size={18} className="shrink-0" />

      <span className="flex-1 text-sm font-medium">
        Tenders
      </span>

      <ChevronRight size={16} className="shrink-0" />
    </div>
  );
};

export { TendersNavbar };