export const API_TIMEOUT_MS = 10000;

export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const API_ERROR_CODES = {
  CANCELED: "ERR_CANCELED",
  TIMEOUT: "ECONNABORTED",
} as const;
