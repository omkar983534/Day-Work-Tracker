import axios from "axios";

// In dev, "/api" is proxied to the Express server (see vite.config.js).
// In production you can set VITE_API_URL to your deployed API base.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Attach the saved JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is rejected, clear it so the app falls back to the login screen
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default api;
