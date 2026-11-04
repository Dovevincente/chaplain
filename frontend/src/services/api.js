import axios from "axios";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (
      typeof FormData !== "undefined" &&
      config.data instanceof FormData
    ) {
      if (config.headers) {
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Shared refresh promise
let refreshPromise = null;

export const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${API_BASE_URL}/auth/refresh`,
        {},
        {
          withCredentials: true,
          timeout: 15000,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const AUTH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
];

const isAuthEndpoint = (url = "") => {
  const normalizedUrl = String(url)
    .split("?")[0]
    .replace(/\/+$/, "")
    .toLowerCase();

  return AUTH_ENDPOINTS.some((endpoint) =>
    normalizedUrl.endsWith(endpoint)
  );
};

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;

    if (!error?.response || status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    if (originalRequest.skipAuthRefresh === true) {
      return Promise.reject(error);
    }

    if (isAuthEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (originalRequest._retry === true) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await refreshAccessToken();
      // Browser will automatically attach the new cookies
      return api(originalRequest);
    } catch (refreshError) {
      // On iOS Safari this is the common path
      return Promise.reject(refreshError);
    }
  }
);

export default api;