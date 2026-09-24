import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/tenders";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const tenderService = {
  createTender: async (tenderData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/`, tenderData, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Create tender error:", error);
      throw error.response?.data?.detail || "Failed to create tender";
    }
  },
  
  getMyTenders: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/me`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Get my tenders error:", error);
      throw error;
    }
  },

  getTenders: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/`);
      return response.data;
    } catch (error) {
      console.error("Get tenders error:", error);
      throw error;
    }
  }
};
