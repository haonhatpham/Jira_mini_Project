/**
 * File dinh nghia cac HTTP exception pho bien cho backend.
 */
import { HttpStatus } from "../constants/httpStatus.js";
import { HttpException } from "./httpException.js";

/**
 * Loi 400 khi request sai cu phap hoac du lieu khong hop le.
 */
export class BadRequestException extends HttpException {
  /**
   * Tao BadRequestException voi code mac dinh BAD_REQUEST.
   */
  constructor(message = "Bad Request", code = "BAD_REQUEST") {
    super(HttpStatus.BAD_REQUEST, code, message);
  }
}

/**
 * Loi 401 khi request thieu hoac sai thong tin xac thuc.
 */
export class UnauthorizedException extends HttpException {
  /**
   * Tao UnauthorizedException voi code mac dinh UNAUTHORIZED.
   */
  constructor(message = "Unauthorized", code = "UNAUTHORIZED") {
    super(HttpStatus.UNAUTHORIZED, code, message);
  }
}

/**
 * Loi 403 khi user da xac thuc nhung khong du quyen.
 */
export class ForbiddenException extends HttpException {
  /**
   * Tao ForbiddenException voi code mac dinh FORBIDDEN.
   */
  constructor(message = "Forbidden", code = "FORBIDDEN") {
    super(HttpStatus.FORBIDDEN, code, message);
  }
}

/**
 * Loi 404 khi resource hoac route khong ton tai.
 */
export class NotFoundException extends HttpException {
  /**
   * Tao NotFoundException voi code mac dinh NOT_FOUND.
   */
  constructor(message = "Resource Not Found", code = "NOT_FOUND") {
    super(HttpStatus.NOT_FOUND, code, message);
  }
}

/**
 * Loi 409 khi du lieu/request xung dot voi trang thai hien tai.
 */
export class ConflictException extends HttpException {
  /**
   * Tao ConflictException voi code mac dinh CONFLICT.
   */
  constructor(message = "Conflict", code = "CONFLICT") {
    super(HttpStatus.CONFLICT, code, message);
  }
}

/**
 * Loi validation co them details de client biet field nao sai.
 */
export class ValidationException extends HttpException {
  /**
   * Tao ValidationException va luu details validation neu co.
   */
  constructor(
    message = "Validation Error",
    public readonly details?: unknown,
  ) {
    super(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", message);
  }
}

/**
 * Loi 429 khi request vuot gioi han tan suat.
 */
export class TooManyRequestsException extends HttpException {
  /**
   * Tao TooManyRequestsException voi message mac dinh than thien cho client.
   */
  constructor(message = "Too many requests, please try again later.") {
    super(HttpStatus.TOO_MANY_REQUESTS, "TOO_MANY_REQUESTS", message);
  }
}

/**
 * Loi 503 khi dich vu phu thuoc, hien chu yeu la database, khong san sang.
 */
export class ServiceUnavailableException extends HttpException {
  /**
   * Tao ServiceUnavailableException voi code mac dinh SERVICE_UNAVAILABLE.
   */
  constructor(message = "Service Unavailable", code = "SERVICE_UNAVAILABLE") {
    super(HttpStatus.SERVICE_UNAVAILABLE, code, message);
  }
}

/**
 * Loi 500 noi bo, mac dinh khong expose message that trong production.
 */
export class InternalServerErrorException extends HttpException {
  /**
   * Tao InternalServerErrorException voi expose=false de an chi tiet noi bo.
   */
  constructor(
    message = "Internal Server Error",
    code = "INTERNAL_SERVER_ERROR",
  ) {
    super(HttpStatus.INTERNAL, code, message, false);
  }
}
