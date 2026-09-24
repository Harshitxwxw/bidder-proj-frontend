import { Routes, Route, Navigate } from "react-router-dom";

import { Tender_Page } from "./pages/Tender_Page/Tender_page";
import { Tender_bidder_page } from "./pages/Tender_Bidder_Page/Tender_bidder_page";
import { Bidder_page } from "./pages/Bidder_Page/Bidder_page";
import Profile from "../pages/Profile/Profile";

const OfficerRoutes = () => {
  return (
    <Routes>
      {/* Root redirects to /officer/tenders */}
      <Route
        path="/"
        element={<Navigate to="/officer/tenders" replace />}
      />
      <Route
        path="/officer"
        element={<Navigate to="/officer/tenders" replace />}
      />

      {/* Target Officer Routes */}
      <Route
        path="/officer/tenders"
        element={<Tender_Page />}
      />
      <Route
        path="/officer/tender-bidder"
        element={<Tender_bidder_page />}
      />
      <Route
        path="/officer/bidder-info"
        element={<Bidder_page />}
      />
      <Route
        path="/officer/profile"
        element={<Profile />}
      />

      {/* Direct aliases for /tenders, /tender-bidder, /bidder-info */}
      <Route
        path="/tenders"
        element={<Navigate to="/officer/tenders" replace />}
      />
      <Route
        path="/tender-bidder"
        element={<Navigate to="/officer/tender-bidder" replace />}
      />
      <Route
        path="/bidder-info"
        element={<Navigate to="/officer/bidder-info" replace />}
      />

      {/* Catch-all */}
      <Route
        path="*"
        element={<Navigate to="/officer/tenders" replace />}
      />
    </Routes>
  );
};

export { OfficerRoutes };