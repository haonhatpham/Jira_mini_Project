import axios, {
  AxiosHeaders,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { API_PATHS, BASE_URL } from "./paths";
import {
  createIdempotencyKey,
  IDEMPOTENCY_HEADER,
  shouldAttachIdempotencyKey,
} from "./idempotency";
import {
  API_ERROR_CODES,
  API_TIMEOUT_MS,
  HTTP_STATUS,
} from "../configs/api.config";
import { clearStoredToken, getStoredToken } from "../utils/authToken.util";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const headers = ensureAxiosHeaders(config);
    const token = getStoredToken();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    if (
      shouldAttachIdempotencyKey(config.method) &&
      !headers.has(IDEMPOTENCY_HEADER)
    ) {
      headers.set(IDEMPOTENCY_HEADER, createIdempotencyKey());
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const requestUrl = error.config?.url || "";
    const isAuthRequest =
      requestUrl.includes(API_PATHS.AUTH.LOGIN) ||
      requestUrl.includes(API_PATHS.AUTH.LOGOUT) ||
      requestUrl.includes(API_PATHS.AUTH.REGISTER);

    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !isAuthRequest) {
      clearStoredToken();

      const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      const loginUrl = new URL("/login", window.location.origin);
      loginUrl.searchParams.set("from", currentPath);
      loginUrl.searchParams.set("message", "session-expired");

      window.location.assign(loginUrl.toString());
    }

    if (error.response?.status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
      console.error("Server error. Please try again later.");
    } else if (error.code === API_ERROR_CODES.TIMEOUT) {
      console.error("Request timeout. Please try again.");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;

function ensureAxiosHeaders(config: InternalAxiosRequestConfig): AxiosHeaders {
  const headers = AxiosHeaders.from(config.headers);
  config.headers = headers;
  return headers;
}
