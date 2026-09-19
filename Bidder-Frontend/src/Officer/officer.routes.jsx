import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import TendersPage from "./pages/Tender_page";
import TenderBidderPage from "./pages/Tender_bidder_page";
import BidderInfoPage from "./pages/Bidder_page";

const OfficerRoutes = () => {
  return (
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/tenders" replace />}
        />
        <Route
          path="/tenders"
          element={<TendersPage />}
        />
        <Route
          path="/tender-bidder"
          element={<TenderBidderPage />}
        />
        <Route
          path="/bidder-info"
          element={<BidderInfoPage />}
        />
        <Route
          path="*"
          element={<Navigate to="/tenders" replace />}
        />
      </Routes>
  );
};

export { OfficerRoutes };