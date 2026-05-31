/**
 * File page: bieu dien mot trang ket qua kem metadata tong so item.
 */
import type { Pageable } from "./pageable.js";

/**
 * Page boc data cua mot trang va tinh totalPages dung chung cho response list.
 */
export class Page<T> {
  constructor(
    public readonly items: T[],
    public readonly totalItems: number,
    public readonly page: number,
    public readonly limit: number,
  ) {}

  /**
   * Tong so trang dua tren tong item va limit moi trang.
   */
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.limit);
  }

  /**
   * Tao Page tu ket qua query va Pageable goc.
   */
  static of<T>(items: T[], totalItems: number, pageable: Pageable): Page<T> {
    return new Page(items, totalItems, pageable.page, pageable.limit);
  }
}
