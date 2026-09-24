import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/auth";

export const authService = {
  signup: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, userData);
      return response.data;
    } catch (error) {
      console.error("Signup error:", error);
      throw error.response?.data?.detail || "Signup failed";
    }
  },

  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error.response?.data?.detail || "Login failed";
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getProfile: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error.response?.data?.detail || "Failed to fetch profile";
    }
  },

  updateProfile: async (data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_BASE_URL}/profile`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optionally update the local storage user if they updated fields inside user model
      // But we just update profile, so maybe not needed
      return response.data;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error.response?.data?.detail || "Failed to update profile";
    }
  }
};
