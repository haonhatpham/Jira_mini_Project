import { IDEMPOTENCY_HEADER } from "./idempotency";

export interface RequestOptions {
  idempotencyKey?: string;
  signal?: AbortSignal;
}

export interface RequestConfig<TParams = unknown> {
  headers?: Record<string, string>;
  params?: TParams;
  signal?: AbortSignal;
}

export function createRequestConfig<TParams>(
  params?: TParams,
  options: RequestOptions = {},
): RequestConfig<TParams> {
  const config: RequestConfig<TParams> = {};

  if (params !== undefined) {
    config.params = params;
  }

  if (options.signal !== undefined) {
    config.signal = options.signal;
  }

  if (options.idempotencyKey !== undefined) {
    config.headers = {
      [IDEMPOTENCY_HEADER]: options.idempotencyKey,
    };
  }

  return config;
}

export function createSignalConfig(
  options: RequestOptions = {},
): RequestConfig {
  return createRequestConfig(undefined, options);
}
