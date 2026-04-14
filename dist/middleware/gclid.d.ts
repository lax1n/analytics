import { NextRequest, NextResponse } from "next/server";
/**
 * Middleware helper to capture gclid/gbraid/wbraid from URL params
 * and persist them as first-party cookies (Safari ITP workaround).
 *
 * Call this inside your existing middleware function:
 * ```ts
 * const response = NextResponse.next();
 * return withAnalyticsMiddleware(request, response, "bp");
 * ```
 */
export declare function withAnalyticsMiddleware(request: NextRequest, response: NextResponse, prefix?: string): NextResponse;
//# sourceMappingURL=gclid.d.ts.map