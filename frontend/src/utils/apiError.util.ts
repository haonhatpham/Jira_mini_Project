import axios, { type AxiosError } from "axios";
import { API_CONFIG } from "../configs/api.config";
import type { ApiErrorBody } from "../types";

export function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const axiosError = error as AxiosError<ApiErrorBody>;

    if (axiosError.code === "ECONNABORTED") {
      return "Request timeout. Please try again.";
    }
    if (!axiosError.response) {
      return "Cannot reach server. Is JSON Server running on port 3001?";
    }
    if (axiosError.response.status === API_CONFIG.SERVER_ERROR_STATUS) {
      return "Server error. Please try again later.";
    }
    return (
      axiosError.response.data?.message || axiosError.message || "Request failed"
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error";
}
