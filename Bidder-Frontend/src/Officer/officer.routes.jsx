import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import {Tender_Page} from "./pages/Tender_Page/Tender_page";
import {Tender_bidder_page} from "./pages/Tender_Bidder_Page/Tender_bidder_page";
import {Bidder_page} from "./pages/Bidder_Page/Bidder_page";

const OfficerRoutes = () => {
  return (
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/tenders" replace />}
        />
        <Route
          path="/tenders"
          element={<Tender_Page />}
        />
        <Route
          path="/tender-bidder"
          element={<Tender_bidder_page />}
        />
        <Route
          path="/bidder-info"
          element={<Bidder_page />}
        />
        <Route
          path="*"
          element={<Navigate to="/tenders" replace />}
        />
      </Routes>
  );
};

export { OfficerRoutes };