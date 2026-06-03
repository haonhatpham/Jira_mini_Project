/**
 * File interface cache: dinh nghia hop dong cache toi thieu cho idempotency.
 */
export interface Cache {
  /** Lay gia tri theo key, tra null neu khong co hoac da het han. */
  get<T>(key: string): Promise<T | null>;

  /** Ghi gia tri voi TTL tinh bang giay. */
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;

  /** Chi ghi neu key chua ton tai, dung nhu distributed lock don gian. */
  setIfNotExists<T>(key: string, value: T, ttlSeconds: number): Promise<boolean>;

  /** Xoa key khoi cache. */
  delete(key: string): Promise<void>;
}
