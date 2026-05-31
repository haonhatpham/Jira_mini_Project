import axios, { type AxiosError } from "axios";
import { API_ERROR_CODES, HTTP_STATUS } from "../configs/api.config";
import type { ApiErrorBody } from "../types";

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const axiosError = error as AxiosError<ApiErrorBody>;

    if (axiosError.code === API_ERROR_CODES.TIMEOUT) {
      return "Request timeout. Please try again.";
    }
    if (!axiosError.response) {
      return "Cannot reach API server. Check VITE_API_BASE_URL and backend status.";
    }
    if (axiosError.response.status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
      return "Server error. Please try again later.";
    }
    return (
      axiosError.response.data?.message ||
      axiosError.message ||
      "Request failed"
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error";
}

export function isRequestCanceled(error: unknown): boolean {
  return (
    axios.isCancel(error) ||
    (axios.isAxiosError(error) && error.code === API_ERROR_CODES.CANCELED)
  );
}
