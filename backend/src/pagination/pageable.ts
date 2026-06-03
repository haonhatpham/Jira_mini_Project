/**
 * File pageable: bieu dien thong tin phan trang va sap xep cua mot request list.
 */
import { Sort } from "./sort.js";

/**
 * Pageable giu page, limit va sort; cac getter giup model tinh skip/take cho Prisma.
 */
export class Pageable {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly sort: Sort = Sort.UNSORTED,
  ) {
    this.validatePage(page);
    this.validateLimit(limit);
  }

  /**
   * So record can bo qua, dung cho Prisma skip.
   */
  get skip(): number {
    return (this.page - 1) * this.limit;
  }

  /**
   * So record can lay, dung cho Prisma take.
   */
  get take(): number {
    return this.limit;
  }

  /**
   * Tao Pageable tu gia tri da validate.
   */
  static of(page: number, limit: number, sort: Sort = Sort.UNSORTED): Pageable {
    return new Pageable(page, limit, sort);
  }

  /**
   * Validate page la so nguyen duong.
   */
  private validatePage(page: number): void {
    if (!Number.isInteger(page) || page < 1) {
      throw new Error("Page must be a positive integer");
    }
  }

  /**
   * Validate limit la so nguyen duong.
   */
  private validateLimit(limit: number): void {
    if (!Number.isInteger(limit) || limit < 1) {
      throw new Error("Limit must be a positive integer");
    }
  }
}
