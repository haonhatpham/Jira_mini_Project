/**
 * File middleware idempotency.
 *
 * Muc dich:
 * - Bao ve cac request thay doi du lieu nhu POST/PUT/DELETE khi client retry.
 * - Neu request dau tien dang xu ly, request trung lap se nhan loi 409.
 * - Neu request dau tien da thanh cong, request trung lap se nhan lai dung response cu.
 */
import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { Cache } from "../cache/cache.interface.js";
import { HttpStatus } from "../constants/httpStatus.js";
import {
  DEFAULT_IDEMPOTENCY_TTL_SECONDS,
  IDEMPOTENCY_HEADER,
} from "./constants.js";
import {
  IdempotencyInProgressException,
  MissingIdempotencyKeyException,
} from "./exception.js";
import { buildFingerprint, hashKey } from "./utils.js";

type IdempotencyState = "IN_PROGRESS" | "COMPLETED";

// Entry nay duoc luu ngay khi request dau tien bat dau chay.
// No dong vai tro nhu mot lock: "request nay dang duoc xu ly".
type IdempotencyInProgressEntry = {
  state: Extract<IdempotencyState, "IN_PROGRESS">;
};

// Entry nay duoc luu sau khi request dau tien tra response 2xx.
// Lan retry sau do se dung entry nay de replay response, khong chay controller lai.
type IdempotencyCompletedEntry = {
  body?: unknown;
  state: Extract<IdempotencyState, "COMPLETED">;
  status: number;
};

type IdempotentCacheEntry =
  | IdempotencyInProgressEntry
  | IdempotencyCompletedEntry;

// Du lieu tam luu trong res.locals khi middleware can ghi lai response body.
type IdempotencyResponseLocals = {
  idempotencyBody?: unknown;
};

/**
 * Tao middleware idempotency.
 *
 * Cach hoat dong tong quat:
 * 1. Lay Idempotency-Key tu header.
 * 2. Tao fingerprint tu method, URL, query, body, user va key.
 * 3. Hash fingerprint thanh cache key.
 * 4. Neu cache key chua co, tao lock IN_PROGRESS va cho request di tiep.
 * 5. Neu cache key da co, replay response cu hoac bao request dang xu ly.
 */
export function idempotency(
  cache: Cache,
  ttlSeconds = DEFAULT_IDEMPOTENCY_TTL_SECONDS,
): RequestHandler {
  // Ham return nay moi la Express middleware that su chay tren tung request.
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const key = req.header(IDEMPOTENCY_HEADER)?.trim();

    if (!key) {
      // Route mutation bat buoc client gui Idempotency-Key de retry khong gay trung du lieu.
      next(new MissingIdempotencyKeyException());
      return;
    }

    try {
      // Fingerprint giup phan biet 2 request khac nhau du cho client dung cung mot key.
      const cacheKey = hashKey(buildFingerprint(req, key));

      // setIfNotExists chi thanh cong voi request dau tien.
      // Neu thanh cong, cache dang giu trang thai IN_PROGRESS cho fingerprint nay.
      const locked = await cache.setIfNotExists<IdempotencyInProgressEntry>(
        cacheKey,
        { state: "IN_PROGRESS" },
        ttlSeconds,
      );

      if (!locked) {
        // Da co request cung fingerprint trong cache: khong cho controller chay lai.
        await handleCachedRequest(cache, cacheKey, res, next);
        return;
      }

      // Request dau tien can ghi lai response de cac lan retry co the replay.
      interceptResponse(res);

      // Sau khi response ket thuc, doi IN_PROGRESS thanh COMPLETED hoac xoa lock neu loi.
      attachCleanupHandlers({
        cache,
        cacheKey,
        res,
        ttlSeconds,
      });

      next();
    } catch (err) {
      next(err);
    }
  };
}

/**
 * Xu ly request trung fingerprint.
 *
 * - Neu request dau tien da COMPLETED: gui lai response cu.
 * - Neu request dau tien van IN_PROGRESS hoac cache bi mat body: bao 409 de client thu lai sau.
 */
async function handleCachedRequest(
  cache: Cache,
  cacheKey: string,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const cached = await cache.get<IdempotentCacheEntry>(cacheKey);

  if (cached?.state === "COMPLETED") {
    replayCachedResponse(res, cached);
    return;
  }

  next(new IdempotencyInProgressException());
}

/**
 * Gui lai response da cache cho request retry.
 *
 * Header Idempotency-Replayed=true giup client/debugger biet response nay khong tao moi.
 */
function replayCachedResponse(
  res: Response,
  cached: IdempotencyCompletedEntry,
): void {
  res.set("Idempotency-Replayed", "true");

  // 204 hoac response khong co body thi khong goi json, chi send rong.
  if (cached.status === HttpStatus.NO_CONTENT || cached.body === undefined) {
    res.status(cached.status).send();
    return;
  }

  // Route mutation hien tai tra JSON khi co body, nen retry cung replay bang JSON.
  res.status(cached.status).json(cached.body);
}

/**
 * Boc res.json de ghi lai body truoc khi Express gui response.
 */
function interceptResponse(res: Response) {
  const originalJson = res.json.bind(res);

  res.json = function (body: unknown): Response {
    res.locals.idempotencyBody = body;

    return originalJson(body);
  } as typeof res.json;
}

/**
 * Gan cac cleanup handler cho response.
 *
 * - finish: response da gui xong, co the quyet dinh cache response hay xoa lock.
 * - close: ket noi bi dong som, xoa lock de client duoc retry request.
 */
function attachCleanupHandlers({
  cache,
  cacheKey,
  res,
  ttlSeconds,
}: {
  cache: Cache;
  cacheKey: string;
  res: Response;
  ttlSeconds: number;
}): void {
  // finish chay khi response da hoan tat binh thuong.
  res.on("finish", () => {
    void persistResponse({
      cache,
      cacheKey,
      res,
      ttlSeconds,
    });
  });

  // close co the xay ra khi client ngat ket noi truoc luc server gui xong.
  res.on("close", () => {
    if (!res.writableEnded) {
      void cache.delete(cacheKey);
    }
  });
}

/**
 * Doi cache tu IN_PROGRESS sang COMPLETED sau khi request dau tien ket thuc.
 *
 * Chi cache response 2xx vi day la request thanh cong co the replay an toan.
 * Neu response la 4xx/5xx, xoa lock de lan retry sau duoc xu ly lai tu dau.
 */
async function persistResponse({
  cache,
  cacheKey,
  res,
  ttlSeconds,
}: {
  cache: Cache;
  cacheKey: string;
  res: Response;
  ttlSeconds: number;
}): Promise<void> {
  try {
    if (res.statusCode >= HttpStatus.OK && res.statusCode < 300) {
      const locals = getIdempotencyLocals(res);

      // Luu status va body JSON de request retry co the nhan lai response cu.
      await cache.set<IdempotentCacheEntry>(
        cacheKey,
        {
          body: locals.idempotencyBody,
          state: "COMPLETED",
          status: res.statusCode,
        },
        ttlSeconds,
      );
      return;
    }

    // Request that bai thi khong replay loi cu; cho client retry tao request moi.
    await cache.delete(cacheKey);
  } catch (err) {
    // Khong throw tai day vi response da gui xong; chi log de debug van de cache.
    console.error({
      err,
      message: "Failed to persist idempotency response",
    });
  }
}

/**
 * Lay vung res.locals dung rieng cho idempotency.
 *
 * res.locals la noi Express cho middleware chia se du lieu trong vong doi mot request.
 */
function getIdempotencyLocals(res: Response): IdempotencyResponseLocals {
  return res.locals as IdempotencyResponseLocals;
}
