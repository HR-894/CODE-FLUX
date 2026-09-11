import type { NextFunction, Request, RequestHandler, Response } from "express";

export interface RateLimitStore {
  countAndExpire(key: string, windowMs: number, now: number): number;
}

/**
 * In-memory sliding window rate limiter with automatic memory cleanup (DoS protected).
 */
export class InMemoryRateLimitStore implements RateLimitStore {
  private readonly timestamps = new Map<string, number[]>();
  private lastPrunedAt = Date.now();
  private readonly pruneIntervalMs = 60_000;
  private readonly maxEntries = 5_000;

  private pruneExpired(windowMs: number, now: number): void {
    for (const [key, list] of this.timestamps.entries()) {
      const active = list.filter((t) => t > now - windowMs);
      if (active.length === 0) {
        this.timestamps.delete(key);
      } else {
        this.timestamps.set(key, active);
      }
    }
    
    // Force eviction of oldest entries if size still exceeds limit to prevent algorithmic complexity DoS
    if (this.timestamps.size > this.maxEntries) {
      const excess = this.timestamps.size - this.maxEntries;
      let removed = 0;
      for (const key of this.timestamps.keys()) {
        this.timestamps.delete(key);
        if (++removed >= excess) break;
      }
    }

    this.lastPrunedAt = now;
  }

  public countAndExpire(key: string, windowMs: number, now: number): number {
    // Periodic garbage collection to prevent unbounded memory growth
    if (now - this.lastPrunedAt > this.pruneIntervalMs || this.timestamps.size > this.maxEntries) {
      this.pruneExpired(windowMs, now);
    }

    const existing = this.timestamps.get(key) ?? [];
    const active = existing.filter((timestamp) => timestamp > now - windowMs);

    active.push(now);

    // Keep memory capped
    if (active.length > 50) {
      active.splice(0, active.length - 50);
    }

    this.timestamps.set(key, active);
    return active.length;
  }
}

export function createSlidingWindowRateLimit(options: {
  readonly limit: number;
  readonly windowMs: number;
  readonly store?: RateLimitStore;
}): RequestHandler {
  const store = options.store ?? new InMemoryRateLimitStore();

  return (req: Request, res: Response, next: NextFunction): void => {
    const identity = req.ip || req.socket.remoteAddress || "anonymous";
    const count = store.countAndExpire(
      `campus-os:rate:${identity}`,
      options.windowMs,
      Date.now(),
    );

    res.setHeader("X-RateLimit-Limit", options.limit);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, options.limit - count));

    if (count > options.limit) {
      res.status(429).json({
        error: "Too many complaint submissions. Try again in a minute.",
      });
      return;
    }

    next();
  };
}