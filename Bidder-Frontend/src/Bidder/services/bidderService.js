import { MOCK_TENDERS } from "../data/mockData";
import {
  createApplication,
  getApplications,
  getUploadedDocuments,
  saveUploadedDocuments,
} from "./bidderStorage";

// Temporary frontend service layer.
// Replace the internals of these functions with FastAPI calls during integration.
export const bidderService = {
  async getTenders() {
    return [...MOCK_TENDERS];
  },

  async getTenderById(tenderId) {
    return MOCK_TENDERS.find((tender) => tender.tenderId === tenderId) || null;
  },

  async getApplications() {
    return getApplications();
  },

  async saveDocuments(tenderId, documents) {
    saveUploadedDocuments(tenderId, documents);
    return getUploadedDocuments(tenderId);
  },

  async submitApplication(tender) {
    return createApplication(tender);
  },
};
