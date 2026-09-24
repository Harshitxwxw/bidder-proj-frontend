import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const bidderService = {
  async getTenders() {
    try {
      const response = await axios.get(`${API_BASE_URL}/tenders/`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Get tenders error:", error);
      throw error;
    }
  },

  async getTenderById(tenderId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/tenders/`, {
        headers: getHeaders(),
      });
      return response.data.find((tender) => tender.tender_id === tenderId || tender.tenderId === tenderId) || null;
    } catch (error) {
      console.error("Get tender by ID error:", error);
      throw error;
    }
  },

  async getApplications() {
    try {
      const response = await axios.get(`${API_BASE_URL}/submissions/me`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Get applications error:", error);
      throw error;
    }
  },
  
  async getApplication(applicationId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/submissions/${applicationId}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Get application error:", error);
      throw error;
    }
  },

  async initiateApplication(tenderId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/submissions/`, { tender_id: tenderId }, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Initiate application error:", error);
      throw error;
    }
  },

  async uploadDocument(applicationId, requirementId, file) {
    try {
      const formData = new FormData();
      formData.append("application_id", applicationId);
      formData.append("requirement_id", requirementId);
      formData.append("file", file);

      const response = await axios.post(`${API_BASE_URL}/documents/upload`, formData, {
        headers: {
          ...getHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Upload document error:", error);
      throw error;
    }
  },

  async submitApplication(applicationId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/submissions/${applicationId}/submit`, {}, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Submit application error:", error);
      throw error;
    }
  },
};
