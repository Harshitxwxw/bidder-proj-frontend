import { BrowserRouter, useLocation, Routes, Route, Navigate } from "react-router-dom";

import { Top_Navbar } from "./Officer/Top_Navbar";
import { OfficerRoutes } from "./Officer/officer.routes";
import BidderRoutes from "./Bidder/bidder.routes";

import { Login } from "./pages/Auth/Login";
import { Signup } from "./pages/Auth/Signup";
import CreateTender from "./Tender/CreateTender";

import TenderDashboard from "./Tender/TenderDashboard";
import Profile from "./pages/Profile/Profile";

function AppContent() {
  const location = useLocation();
  const token = localStorage.getItem("token");

  const isAuthRoute = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/";

  if (!token && !isAuthRoute) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (isAuthRoute) {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    );
  }

  const isBidderRoute =
    location.pathname === "/bidder" || location.pathname.startsWith("/bidder/");

  if (isBidderRoute) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#ebf3fc] via-[#e2edfa] to-[#d6e5f7]">
        <main className="min-w-0 flex-1 overflow-auto bg-transparent">
          <BidderRoutes />
        </main>
      </div>
    );
  }

  const isTenderRoute = 
    location.pathname === "/tender" || location.pathname.startsWith("/tender/");
    
  if (isTenderRoute) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#ebf3fc] via-[#e2edfa] to-[#d6e5f7]">
        <main className="min-w-0 flex-1 overflow-auto bg-transparent">
          <Top_Navbar />
          <Routes>
            <Route path="/tender" element={<TenderDashboard />} />
            <Route path="/tender/create" element={<CreateTender />} />
            <Route path="/tender/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#ebf3fc] via-[#e2edfa] to-[#d6e5f7]">
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