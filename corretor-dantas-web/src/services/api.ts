import axios from "axios";
import { getToken, removeToken } from "../utils/auth";

export const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8080";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  const isAuthRoute = config.url?.startsWith("/auth/");

  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url: string = error.config?.url ?? "";

    if (status === 401 && !url.startsWith("/auth/") && getToken()) {
      removeToken();

      if (window.location.pathname !== "/login") {
        window.location.href = "/login?expired=1";
      }
    }

    return Promise.reject(error);
  }
);

export default api;