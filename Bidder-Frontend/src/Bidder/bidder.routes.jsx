import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import BidderDashboard from "./pages/BidderDashboard";
import TenderAcknowledgement from "./pages/TenderAcknowledgement";
import TenderDetails from "./pages/TenderDetails";
import DocumentUpload from "./pages/DocumentUpload";
import ApplicationStatus from "./pages/ApplicationStatus";
import ApplicationsPage from "./pages/ApplicationsPage";
import WishlistPage from "./pages/WishlistPage";
import AllottedPage from "./pages/AllottedPage";
import AllotmentDetails from "./pages/AllotmentDetails";
import Profile from "../pages/Profile/Profile";

export default function BidderRoutes() {
  return (
    <Routes>
      <Route path="/bidder" element={<Outlet />}>
        <Route index element={<Navigate to="tenders" replace />} />
        <Route path="tenders" element={<BidderDashboard />} />
        <Route path="tenders/:tenderId/acknowledge" element={<TenderAcknowledgement />} />
        <Route path="tenders/:tenderId/details" element={<TenderDetails />} />
        <Route path="tenders/:tenderId/upload" element={<DocumentUpload />} />
        <Route path="tenders/:tenderId/status" element={<ApplicationStatus />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="applications/:applicationId" element={<ApplicationStatus />} />
        <Route path="allotted" element={<AllottedPage />} />
        <Route path="allotted/:tenderId" element={<AllotmentDetails />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
