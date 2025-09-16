import axios from "axios";
import { Sample } from "@/src/types"; // Import our new type
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
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
export const getSamples = async (): Promise<Sample[]> => {
  const response = await api.get("/samples");
  // The actual data is in response.data.data.items based on your backend controller
  return response.data.data.items;
};
// Function to delete a sample by its ID
export const deleteSample = async (id: string): Promise<void> => {
  await api.delete(`/samples/${id}`);
};
export default api;
