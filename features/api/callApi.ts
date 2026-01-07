import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { baseUrl } from "./baseUrl.ts";

/* ================= AXIOS INSTANCE ================= */

export const apiClient: AxiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 20000,
});

/* ================= DEBUG INTERCEPTORS ================= */

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log("🚀 [API REQUEST]", {
      url: `${config.baseURL}${config.url}`,
      method: config.method?.toUpperCase(),
      headers: config.headers,
      data: config.data,
      timestamp: new Date().toISOString(),
    });
    return config;
  },
  (error) => {
    console.error("🚀 [API REQUEST ERROR]", error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log("✅ [API RESPONSE SUCCESS]", {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  (error) => {
    console.error("❌ [API RESPONSE ERROR]", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

/* ================= GENERIC REQUEST ================= */

export const apiRequest = async <R = any>(
  config: AxiosRequestConfig
): Promise<R> => {
  try {
    const response = await apiClient.request<R>(config);
    return response.data;
  } catch (error: any) {
    throw {
      status: error?.response?.status,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0] ||
        "API Error",
      data: error?.response?.data,
    };
  }
};
