import axios, { type AxiosError } from "axios";
import { API_CONFIG } from "../configs/api.config";
import { clearStoredToken, getStoredToken } from "../utils/authToken.util";

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? API_CONFIG.DEV_BASE_URL : "");

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: API_CONFIG.TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === API_CONFIG.UNAUTHORIZED_STATUS) {
      clearStoredToken();
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);

export default api;
