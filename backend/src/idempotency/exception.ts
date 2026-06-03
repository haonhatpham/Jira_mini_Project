/**
 * File exception rieng cho idempotency middleware.
 */
import { HttpStatus } from "../constants/httpStatus.js";
import { HttpException } from "../exceptions/index.js";

/**
 * trả 409 nếu request giống hệt đang được xử lý, chưa có kết quả để replay.
 */
export class IdempotencyInProgressException extends HttpException {
  /**
   * Tao IdempotencyInProgressException voi code mac dinh IDEMPOTENCY_IN_PROGRESS.
   */
  constructor(
    message = "Request is already processing",
    code = "IDEMPOTENCY_IN_PROGRESS",
  ) {
    super(HttpStatus.CONFLICT, code, message);
  }
}

/**
 * Loi 400 khi mutation route yeu cau Idempotency-Key nhung client khong gui.
 */
export class MissingIdempotencyKeyException extends HttpException {
  /**
   * Tao MissingIdempotencyKeyException voi code mac dinh MISSING_IDEMPOTENCY_KEY.
   */
  constructor(
    message = "Missing idempotency key",
    code = "MISSING_IDEMPOTENCY_KEY",
  ) {
    super(HttpStatus.BAD_REQUEST, code, message);
  }
}
