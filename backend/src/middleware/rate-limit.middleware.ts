import type { NextFunction, Request, Response } from "express";

type RateLimitOptions = {
  name: string;
  windowMs: number;
  maxRequests: number;
  key?: (req: Request, res: Response) => string;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

export const envRateLimit = (name: string, fallback: number) => {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value > 0 ? value : fallback;
};

export const rateLimit = ({
  name,
  windowMs,
  maxRequests,
  key = (req) => req.ip ?? req.socket.remoteAddress ?? "unknown",
}: RateLimitOptions) => {
  const entries = new Map<string, RateLimitEntry>();
  let requestsSinceCleanup = 0;

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const rateLimitKey = `${name}:${key(req, res)}`;
    const current = entries.get(rateLimitKey);
    const entry = !current || current.resetAt <= now
      ? { count: 0, resetAt: now + windowMs }
      : current;

    entry.count += 1;
    entries.set(rateLimitKey, entry);

    const remaining = Math.max(0, maxRequests - entry.count);
    const resetSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    res.setHeader("RateLimit-Limit", maxRequests);
    res.setHeader("RateLimit-Remaining", remaining);
    res.setHeader("RateLimit-Reset", resetSeconds);

    requestsSinceCleanup += 1;
    if (requestsSinceCleanup >= 100) {
      requestsSinceCleanup = 0;
      for (const [storedKey, storedEntry] of entries) {
        if (storedEntry.resetAt <= now) entries.delete(storedKey);
      }
    }

    if (entry.count > maxRequests) {
      res.setHeader("Retry-After", resetSeconds);
      return res.status(429).json({
        error: {
          code: "RATE_LIMITED",
          message: "Too many requests. Please try again later.",
        },
      });
    }

    return next();
  };
};
