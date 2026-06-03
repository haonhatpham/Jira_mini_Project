/**
 * File sort: bieu dien cau hinh sap xep dung chung cho cac API list.
 */
export type Direction = "asc" | "desc";

export interface Order {
  readonly property: string;
  readonly direction: Direction;
}

/**
 * Sort la object bat bien chua danh sach field can sap xep.
 */
export class Sort {
  public static readonly UNSORTED = new Sort([]);

  constructor(public readonly orders: Order[]) {}

  /**
   * Kiem tra request co sap xep hay khong.
   */
  public get isUnsorted(): boolean {
    return this.orders.length === 0;
  }

  /**
   * Lay order dau tien, phu hop voi API hien tai chi sort theo mot field.
   */
  public get first(): Order | undefined {
    return this.orders[0];
  }

  /**
   * Tao Sort voi mot field va direction.
   */
  static by(property: string, direction: Direction = "asc"): Sort {
    return new Sort([{ property, direction }]);
  }

  /**
   * Parse chuoi sort kieu "-name,price" thanh danh sach order.
   */
  static from(sortString?: string): Sort {
    if (!sortString?.trim()) {
      return Sort.UNSORTED;
    }

    const orders = sortString
      .split(",")
      .map((token) => token.trim())
      .filter(Boolean)
      .map((token): Order => {
        const isDesc = token.startsWith("-");
        return {
          direction: isDesc ? "desc" : "asc",
          property: isDesc ? token.slice(1) : token,
        };
      });

    return new Sort(orders);
  }

  /**
   * Chuyen Sort thanh query string dang "-name,price".
   */
  toString(): string {
    return this.orders
      .map((order) => (order.direction === "desc" ? `-${order.property}` : order.property))
      .join(",");
  }
}
