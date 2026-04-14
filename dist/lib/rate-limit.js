const requests = new Map();
let callCount = 0;
/**
 * Simple in-memory rate limiter.
 * Returns true if the request is allowed, false if rate limited.
 */
export function rateLimit(key, limit = 5, windowMs = 60_000) {
    const now = Date.now();
    // Periodic cleanup: every 500 calls, sweep expired entries
    callCount++;
    if (callCount % 500 === 0) {
        for (const [k, v] of requests) {
            if (now > v.resetAt)
                requests.delete(k);
        }
    }
    const entry = requests.get(key);
    if (!entry || now > entry.resetAt) {
        requests.set(key, { count: 1, resetAt: now + windowMs });
        return true;
    }
    if (entry.count >= limit) {
        return false;
    }
    entry.count++;
    return true;
}
//# sourceMappingURL=rate-limit.js.map