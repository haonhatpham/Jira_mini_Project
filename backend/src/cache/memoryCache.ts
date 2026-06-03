/**
 * File MemoryCache: cache in-memory co TTL, dung cho idempotency trong runtime hien tai.
 */
import type { Cache } from "./cache.interface.ts";

type CacheRecord = {
  expiresAt: number;
  value: unknown;
};

const MIN_TTL_SECONDS = 1;

/**
 * Cache luu trong Map cua process, phu hop development hoac single-instance server.
 */
export class MemoryCache implements Cache {
  private readonly store = new Map<string, CacheRecord>();

  /**
   * Lay entry con han va ep kieu ve generic T cho caller.
   */
  async get<T>(key: string): Promise<T | null> {
    const entry = this.getValidEntry(key);
    return entry ? entry.value as T : null;
  }

  /**
   * Ghi entry moi, prune entry het han va dat expiresAt theo TTL.
   */
  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    this.pruneExpired();
    this.store.set(key, {
      expiresAt: this.getExpiresAt(ttlSeconds),
      value,
    });
  }

  /**
   * Ghi entry chi khi key chua ton tai hoac entry cu da het han.
   */
  async setIfNotExists<T>(
    key: string,
    value: T,
    ttlSeconds: number,
  ): Promise<boolean> {
    if (this.getValidEntry(key)) {
      return false;
    }

    await this.set(key, value, ttlSeconds);
    return true;
  }

  /**
   * Xoa entry theo key.
   */
  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  /**
   * Lay entry neu con han, dong thoi tu dong xoa entry da het han.
   */
  private getValidEntry(key: string): CacheRecord | null {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return null;
    }

    return entry;
  }

  /**
   * Tinh timestamp het han, ep TTL toi thieu de tranh entry het han ngay lap tuc.
   */
  private getExpiresAt(ttlSeconds: number): number {
    return Date.now() + Math.max(ttlSeconds, MIN_TTL_SECONDS) * 1000;
  }

  /**
   * Quet Map va xoa nhung entry da het han.
   */
  private pruneExpired(): void {
    const now = Date.now();

    for (const [key, entry] of this.store.entries()) {
      if (entry.expiresAt <= now) {
        this.store.delete(key);
      }
    }
  }
}

// Instance singleton dung chung cho route product mutations.
export const memoryCache = new MemoryCache();
