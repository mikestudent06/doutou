import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// In-memory token storage (secure against XSS)
let accessToken: string | null = null;

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Essential for httpOnly cookies
  timeout: 10000, // 10 second timeout (optional enhancement)
});

// Token management functions
export const tokenManager = {
  setToken: (token: string) => {
    accessToken = token;
    // Optional: Add debug logging in development
    if (import.meta.env.DEV) {
      console.log("🔐 Access token stored in memory");
    }
  },

  getToken: (): string | null => {
    return accessToken;
  },

  clearToken: () => {
    accessToken = null;
    if (import.meta.env.DEV) {
      console.log("🗑️ Access token cleared from memory");
    }
  },

  hasToken: (): boolean => {
    return accessToken !== null;
  },
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Optional: Add request logging in development
    if (import.meta.env.DEV) {
      console.log(`🔄 ${config.method?.toUpperCase()} ${config.url}`, {
        hasToken: !!token,
        withCredentials: config.withCredentials,
      });
    }

    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error("❌ Request error:", error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => {
    // If response contains new access token, store it
    if (response.data?.access_token) {
      tokenManager.setToken(response.data.access_token);
    }

    // Optional: Add response logging in development
    if (import.meta.env.DEV) {
      console.log(
        `✅ ${response.config.method?.toUpperCase()} ${response.config.url}`,
        {
          status: response.status,
          hasNewToken: !!response.data?.access_token,
        }
      );
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log errors in development
    if (import.meta.env.DEV) {
      console.error(
        `❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        {
          status: error.response?.status,
          message: error.response?.data?.message,
        }
      );
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (import.meta.env.DEV) {
          console.log("🔄 Attempting token refresh...");
        }

        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        const { access_token } = response.data;
        tokenManager.setToken(access_token);

        if (import.meta.env.DEV) {
          console.log("✅ Token refresh successful");
        }

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        if (import.meta.env.DEV) {
          console.error("❌ Token refresh failed:", refreshError);
        }

        // Refresh failed - clear token and redirect to login
        tokenManager.clearToken();
        window.dispatchEvent(new CustomEvent("auth:logout"));

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
