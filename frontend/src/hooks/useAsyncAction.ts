import { useCallback, useRef, useState } from "react";
import type { AsyncStatus } from "../types";
import { getErrorMessage } from "../utils/apiError.util";

type ActionStatus = Exclude<AsyncStatus, "empty">;
type AsyncAction<TArgs extends unknown[], TResult> = (
  ...args: TArgs
) => Promise<TResult> | TResult;

interface UseAsyncActionState<TResult> {
  data: TResult | null;
  error: string | null;
  status: ActionStatus;
}

interface UseAsyncActionResult<
  TArgs extends unknown[],
  TResult,
> extends UseAsyncActionState<TResult> {
  execute: (...args: TArgs) => Promise<TResult>;
  isLoading: boolean;
  reset: () => void;
}

export function useAsyncAction<TArgs extends unknown[], TResult>(
  action: AsyncAction<TArgs, TResult>,
): UseAsyncActionResult<TArgs, TResult> {
  const actionRef = useRef(action);
  const [state, setState] = useState<UseAsyncActionState<TResult>>({
    data: null,
    error: null,
    status: "idle",
  });

  actionRef.current = action;

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      status: "idle",
    });
  }, []);

  const execute = useCallback(async (...args: TArgs): Promise<TResult> => {
    setState((current) => ({
      ...current,
      error: null,
      status: "loading",
    }));

    try {
      const data = await actionRef.current(...args);

      setState({
        data,
        error: null,
        status: "data",
      });

      return data;
    } catch (err) {
      setState({
        data: null,
        error: getErrorMessage(err),
        status: "error",
      });

      throw err;
    }
  }, []);

  return {
    ...state,
    execute,
    isLoading: state.status === "loading",
    reset,
  };
}
