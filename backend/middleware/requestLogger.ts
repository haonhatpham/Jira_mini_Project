/**
 * Middleware log request: ghi method, URL, status code va thoi gian xu ly.
 */
import type { NextFunction, Request, Response } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startedAt = Date.now();

  // Callback chay sau khi Express gui response xong de tinh duration chinh xac.
  res.on("finish", () => {
    const duration = Date.now() - startedAt;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });

  next();
}
