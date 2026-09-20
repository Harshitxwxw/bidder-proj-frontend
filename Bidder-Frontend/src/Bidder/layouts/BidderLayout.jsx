import { Outlet } from "react-router-dom";
import BidderSidebar from "../components/BidderSidebar";

export default function BidderLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <BidderSidebar />
      <main className="min-w-0 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
