import { BrowserRouter, useLocation } from "react-router-dom";

import { Top_Navbar } from "./Officer/Top_Navbar";
import { LeftNavbar } from "./Officer/Left_Navbar/Left_Navbar";
import { OfficerRoutes } from "./Officer/officer.routes";

import BidderRoutes from "./Bidder/bidder.routes";

function AppContent() {
  const location = useLocation();

  const isBidderRoute =
    location.pathname === "/bidder" || location.pathname.startsWith("/bidder/");

  if (isBidderRoute) {
    return <BidderRoutes />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#ebf3fc] via-[#e2edfa] to-[#d6e5f7]">
      <LeftNavbar />

      <main className="min-w-0 flex-1 overflow-auto bg-transparent">
        <Top_Navbar />
        <OfficerRoutes />
      </main>
    </div>
  );
}

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;