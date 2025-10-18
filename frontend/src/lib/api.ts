import axios, { AxiosRequestConfig } from "axios";

const DEFAULT_API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function apiFetch(
  endpoint: string,
  options: AxiosRequestConfig = {},
  baseUrl?: string
): Promise<{ data: unknown; status: number; ok: boolean }> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${baseUrl || DEFAULT_API_BASE}${
        endpoint.startsWith("/") ? endpoint : "/" + endpoint
      }`;
  try {
    const response = await axios({
      url,
      ...options,
    });
    return {
      data: response.data?.data ? response.data.data : response.data,
      status: response.status,
      ok: response.status >= 200 && response.status < 300,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        data: error.response.data ?? null,
        status: error.response.status ?? 500,
        ok: false,
      };
    }
    return {
      data: null,
      status: 500,
      ok: false,
    };
  }
}
