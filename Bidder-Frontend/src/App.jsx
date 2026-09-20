import { BrowserRouter, useLocation } from "react-router-dom";

import { LeftNavbar } from "./Officer/Left_Navbar/Left_Navbar";
import { OfficerRoutes } from "./Officer/officer.routes";

import BidderRoutes from "./Bidder/bidder.routes";

function AppContent() {
  const location = useLocation();

  const isBidderRoute = location.pathname.startsWith("/bidder");

  if (isBidderRoute) {
    return <BidderRoutes />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <LeftNavbar />

      <main className="min-w-0 flex-1 overflow-auto">
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