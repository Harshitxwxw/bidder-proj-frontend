// src/Officer/services/officerService.js
import axios from "axios";

const BACKEND_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const apiClient = axios.create({
  baseURL: BACKEND_URL,
  timeout: 6000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to automatically retry with localhost or relative proxy if 127.0.0.1 fails
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.config && !error.config._retry) {
      error.config._retry = true;
      try {
        const altUrl =
          error.config.baseURL === "http://127.0.0.1:8000"
            ? "http://localhost:8000"
            : "";
        return await axios({
          ...error.config,
          baseURL: altUrl,
        });
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }
    return Promise.reject(error);
  }
);

export const officerService = {
  /**
   * 1. Fetch all tenders from database.
   * If backend is not started or returns an error, returns empty array [].
   */
  async fetchTenders() {
    console.info("⚡ [Axios] Fetching tenders from backend -> /api/officer/tenders");
    try {
      const response = await apiClient.get("/api/officer/tenders");
      console.info("[Axios] Received tenders from backend:", response.data);
      if (Array.isArray(response.data)) {
        return response.data.map((t, index) => ({
          id: t.id || t.tender_id || index + 1,
          tender_id: t.tender_id,
          name: t.title || t.name,
          location: t.location || "National",
          bidders: typeof t.bidders === "number" ? t.bidders : (t.bidders_count || 0),
          sector: t.category || t.sector || "General Procurement",
          estimated_value: t.estimated_value,
          display_id: t.display_id,
        }));
      }
      return [];
    } catch (error) {
      console.warn("[Axios] Backend /api/officer/tenders call failed, trying /api/tenders/:", error.message);
      try {
        const fallbackRes = await apiClient.get("/api/tenders/");
        if (Array.isArray(fallbackRes.data)) {
          return fallbackRes.data.map((t, index) => ({
            id: t.id || t.tender_id || index + 1,
            tender_id: t.tender_id,
            name: t.title || t.name,
            location: t.location || "National",
            bidders: (t.submissions && t.submissions.length) || 0,
            sector: t.category || "General Procurement",
            estimated_value: t.estimated_value,
            display_id: t.display_id,
          }));
        }
      } catch (err2) {
        console.error("[Axios] Backend is not responding. No tenders will be displayed:", err2.message);
      }
      return [];
    }
  },

  /**
   * 2. Fetch all tenders with submitted bidders from database.
   * If backend is not started or returns an error, returns empty array [].
   */
  async fetchTendersWithBidders() {
    console.info("⚡ [Axios] Fetching tender bidders from backend -> /api/officer/tender-bidders");
    try {
      const response = await apiClient.get("/api/officer/tender-bidders");
      console.info("✅ [Axios] Received tender bidders from backend:", response.data);
      if (Array.isArray(response.data)) {
        return response.data.map((t, index) => ({
          id: t.id || t.tender_id || index + 1,
          tender_id: t.tender_id,
          name: t.title || t.name,
          location: t.location || "National",
          sector: t.category || t.sector || "General Procurement",
          bidders: Array.isArray(t.bidders)
            ? t.bidders.map((sub, sIdx) => ({
                id: sub.id || sIdx + 1,
                application_id: sub.application_id || `APP-${t.tender_id}-${sIdx + 1}`,
                name: sub.name || sub.company_name || `Bidder ${sIdx + 1}`,
                complianceScore: typeof sub.complianceScore === "number" ? sub.complianceScore : (sub.compliance_score || 0),
                submittedDate: sub.submittedDate || "2026-09-12",
                documents: Array.isArray(sub.documents)
                  ? sub.documents.map((doc, dIdx) => ({
                      id: doc.id || dIdx + 1,
                      document_id: doc.document_id,
                      name: doc.name || doc.original_file_name,
                      uploadDate: doc.uploadDate || sub.submittedDate || "2026-09-12",
                      verified: Boolean(doc.verified),
                    }))
                  : [],
              }))
            : [],
        }));
      }
      return [];
    } catch (error) {
      console.error("⚠️ [Axios] Backend tender-bidders call failed. No tender bidders will be displayed:", error.message);
      return [];
    }
  },

  /**
   * 3. Trigger compliance score analysis for a tender.
   * If backend is not started or returns an error, returns empty results.
   */
  async analyzeTenderBidders(tenderId, bidders = []) {
    console.info(`⚡ [Axios] Requesting compliance analysis for Tender ${tenderId} from backend -> /api/officer/analyze/${tenderId}`);
    try {
      const res = await apiClient.post(`/api/officer/analyze/${tenderId}`);
      console.info(`✅ [Axios] Compliance analysis response for Tender ${tenderId}:`, res.data);
      if (res.data && Array.isArray(res.data.bidders) && res.data.bidders.length > 0) {
        return {
          status: "SUCCESS",
          tender_id: tenderId,
          bidders: res.data.bidders.map((b, idx) => ({
            id: b.id || idx + 1,
            application_id: b.application_id,
            name: b.name,
            complianceScore: typeof b.complianceScore === "number" ? b.complianceScore : (b.compliance_score || 0),
          })),
        };
      }
    } catch (err) {
      console.warn(`[Axios] Backend batch analysis failed for Tender ${tenderId}:`, err.message);
    }

    return {
      status: "FAILED",
      tender_id: tenderId,
      bidders: [],
    };
  },

  /**
   * 4. Fetch all registered bidders and their submitted documents from database.
   * If backend is not started or returns an error, returns empty array [].
   */
  async fetchBiddersWithDocuments() {
    console.info("⚡ [Axios] Fetching bidders and documents from backend -> /api/officer/bidders");
    try {
      const response = await apiClient.get("/api/officer/bidders");
      console.info("✅ [Axios] Received bidders with documents from backend:", response.data);
      if (Array.isArray(response.data)) {
        return response.data.map((b, index) => ({
          id: b.id || index + 1,
          bidder_id: b.bidder_id,
          application_id: b.application_id,
          name: b.name || b.company_name,
          complianceScore: typeof b.complianceScore === "number" ? b.complianceScore : (b.compliance_score || 0),
          submittedDate: b.submittedDate || "Sep 16, 2026",
          documents: Array.isArray(b.documents)
            ? b.documents.map((doc, dIdx) => ({
                id: doc.id || dIdx + 1,
                document_id: doc.document_id,
                name: doc.name || doc.original_file_name,
                uploadDate: doc.uploadDate || b.submittedDate || "Sep 16, 2026",
                verified: Boolean(doc.verified),
              }))
            : [],
        }));
      }
      return [];
    } catch (error) {
      console.error("⚠️ [Axios] Backend /api/officer/bidders call failed. No bidders will be displayed:", error.message);
      return [];
    }
  },

  /**
   * 5. Verify a document and update status in database.
   */
  async verifyDocument(documentId) {
    console.info(`⚡ [Axios] Verifying document ID ${documentId} via backend -> /api/officer/documents/${documentId}/verify`);
    try {
      const res = await apiClient.post(`/api/officer/documents/${documentId}/verify`);
      console.info(`✅ [Axios] Document verified in database:`, res.data);
      return res.data;
    } catch (error) {
      console.warn(`[Axios] Direct document verify endpoint failed:`, error.message);
      throw error;
    }
  },
};
