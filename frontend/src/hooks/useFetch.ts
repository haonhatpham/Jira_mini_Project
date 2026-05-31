import { useCallback, useEffect, useRef, useState } from "react";
import type { AsyncStatus } from "../types";
import { getErrorMessage, isRequestCanceled } from "../utils/apiError.util";

type QueryKey = readonly unknown[];
type Fetcher<T> = (signal: AbortSignal) => Promise<T>;

interface UseFetchOptions {
  enabled?: boolean;
}

interface UseFetchState<T> {
  data: T | null;
  error: string | null;
  status: AsyncStatus;
}

interface UseFetchResult<T> extends UseFetchState<T> {
  abort: () => void;
  refetch: () => Promise<T | undefined>;
}

export function useFetch<T>(
  queryKey: QueryKey,
  fetcher: Fetcher<T>,
  options: UseFetchOptions = {},
): UseFetchResult<T> {
  const { enabled = true } = options;
  const abortRef = useRef<AbortController | null>(null);
  const fetcherRef = useRef(fetcher);
  const key = JSON.stringify(queryKey);
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    error: null,
    status: enabled ? "loading" : "idle",
  });

  fetcherRef.current = fetcher;

  const abort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const refetch = useCallback(async (): Promise<T | undefined> => {
    if (!enabled) {
      abort();
      setState({
        data: null,
        error: null,
        status: "idle",
      });
      return undefined;
    }

    abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setState((current) => ({
      ...current,
      error: null,
      status: "loading",
    }));

    try {
      const data = await fetcherRef.current(controller.signal);

      if (controller.signal.aborted) {
        return undefined;
      }

      setState({
        data,
        error: null,
        status: "data",
      });

      return data;
    } catch (err) {
      if (controller.signal.aborted || isRequestCanceled(err)) {
        return undefined;
      }

      setState({
        data: null,
        error: getErrorMessage(err),
        status: "error",
      });

      return undefined;
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
    }
  }, [abort, enabled]);

  useEffect(() => {
    if (!enabled) {
      abort();
      setState({
        data: null,
        error: null,
        status: "idle",
      });
      return undefined;
    }

    void refetch();

    return () => {
      abort();
    };
  }, [abort, enabled, key, refetch]);

  return {
    ...state,
    abort,
    refetch,
  };
}
