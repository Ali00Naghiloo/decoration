import axios from "axios";
import { Sample } from "@/src/types"; // Import our new type
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});
// Interceptor to add the JWT token (remains the same)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
// --- NEW API FUNCTIONS ---
// Function to fetch all samples
export const getSamples = async (): Promise<{ items: Sample[] }> => {
  const response = await api.get("/samples?all=true");
  return { items: response.data.data };
};
// Function to delete a sample by its ID
export const deleteSample = async (id: string): Promise<void> => {
  await api.delete(`/samples/${id}`);
};
// Function to create a new sample
export const createSample = async (data: {
  // accept either legacy localized string or per-language object
  title: { fa?: string; en?: string } | string;
  description: { fa?: string; en?: string } | string;
}) => {
  await api.post("/samples", data);
};
// Function to update a sample by its ID
export const updateSample = async (
  id: string,
  data: {
    // accept either legacy localized string or per-language object for flexibility
    title: { fa?: string; en?: string } | string;
    description: { fa?: string; en?: string } | string;
    images?: string[];
    videoUrl?: string;
  }
) => {
  await api.put(`/samples/${id}`, data);
};
// Function to get a single sample by its ID
export const getSampleById = async (id: string): Promise<Sample> => {
  const response = await api.get(`/samples/${id}`);
  return response.data.data;
};
// Function to update sample status by its ID
export const updateSampleStatus = async (
  id: string,
  status: number
): Promise<void> => {
  await api.patch(`/samples/${id}/status`, { status });
};

export default api;
