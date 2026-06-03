/**
 * File middleware loi tap trung: bien exception thanh JSON response thong nhat.
 */
import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { HttpStatus } from "../constants/httpStatus.js";
import type { ErrorResponse } from "../types/http.js";
import { HttpException } from "./httpException.js";
import {
  InternalServerErrorException,
  NotFoundException,
  type ValidationException,
} from "./commonExceptions.js";

export const GENERIC_ERROR_RESPONSE: ErrorResponse = {
  status: HttpStatus.INTERNAL,
  code: "UNKNOWN_ERROR",
  message: "Unknown error",
};

const isProduction = env.NODE_ENV === "production";

/**
 * Tao NotFoundException cho moi route khong match truoc khi vao middleware loi.
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundException(`Route ${req.method} ${req.originalUrl} not found`));
}

/**
 * Middleware loi Express: log loi va tra response theo HttpException hoac loi unknown.
 */
export function exceptionMiddleware(
  err: unknown,
  req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction,
): Response<ErrorResponse> {
  if (err instanceof HttpException) {
    logHandledException(err, req);
    return res.status(err.status).json(createHttpExceptionResponse(err));
  }

  logUnknownException(err, req);
  return res.status(HttpStatus.INTERNAL).json(createUnknownErrorResponse(err));
}

/**
 * Tao ErrorResponse tu HttpException, an message neu production va expose=false.
 */
function createHttpExceptionResponse(err: HttpException): ErrorResponse {
  const shouldExpose = !isProduction || err.expose;
  const response: ErrorResponse = {
    status: err.status,
    code: err.code,
    message: shouldExpose ? err.message : GENERIC_ERROR_RESPONSE.message,
  };

  if ("details" in err && err.details !== undefined) {
    response.details = (err as ValidationException).details;
  }

  return response;
}

/**
 * Tao ErrorResponse cho loi khong phai HttpException, development co kem stack.
 */
function createUnknownErrorResponse(err: unknown): ErrorResponse {
  if (!isProduction && err instanceof Error) {
    return {
      status: HttpStatus.INTERNAL,
      code: GENERIC_ERROR_RESPONSE.code,
      message: err.message,
      stack: err.stack,
    };
  }

  return GENERIC_ERROR_RESPONSE;
}

/**
 * Log loi da duoc backend du kien xu ly nhu 400/401/404/503.
 */
function logHandledException(err: HttpException, req: Request): void {
  console.warn({
    code: err.code,
    status: err.status,
    message: err.message,
    method: req.method,
    path: req.originalUrl,
  });
}

/**
 * Log loi khong xac dinh de debug nhung van tra response generic cho client.
 */
function logUnknownException(err: unknown, req: Request): void {
  console.error({
    err,
    method: req.method,
    path: req.originalUrl,
  });
}
