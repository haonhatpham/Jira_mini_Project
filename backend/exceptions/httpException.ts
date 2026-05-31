/**
 * File dinh nghia base HttpException cho moi loi HTTP co status/code/message.
 */
import type { HttpStatusType } from "../constants/httpStatus.js";

/**
 * Base class cho loi API, giu status HTTP va flag expose message trong production.
 */
export class HttpException extends Error {
  public readonly status: HttpStatusType;
  public readonly code: string;
  public readonly expose: boolean;

  /**
   * Tao HttpException va sua prototype/stack de instanceof hoat dong dung.
   */
  constructor(status: HttpStatusType, code: string, message: string, expose = true) {
    super(message);
    this.status = status;
    this.code = code;
    this.expose = expose;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, this.constructor);
  }
}
