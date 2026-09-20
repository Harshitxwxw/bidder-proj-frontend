import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getTenders = async () => {
  const response = await api.get("/tenders");
  return response.data;
};

const getTenderBidders = async (tenderId) => {
  const response = await api.get(
    `/tenders/${tenderId}/bidders`
  );

  return response.data;
};

const getTenderRequirements = async (tenderId) => {
  const response = await api.get(
    `/tenders/${tenderId}/requirements`
  );

  return response.data;
};

const getBidder = async (bidderId) => {
  const response = await api.get(
    `/bidders/${bidderId}`
  );

  return response.data;
};

const getBidderDocuments = async (bidderId) => {
  const response = await api.get(
    `/bidders/${bidderId}/documents`
  );

  return response.data;
};

const downloadDocument = async (fileUrl) => {
  const response = await axios.get(fileUrl, {
    responseType: "blob",
  });

  return response.data;
};

export {
  api,
  getTenders,
  getTenderBidders,
  getTenderRequirements,
  getBidder,
  getBidderDocuments,
  downloadDocument,
};