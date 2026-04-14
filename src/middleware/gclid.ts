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
export function withAnalyticsMiddleware(
  request: NextRequest,
  response: NextResponse,
  prefix: string = "bp"
): NextResponse {
  const searchParams = request.nextUrl.searchParams;

  for (const param of ["gclid", "gbraid", "wbraid"]) {
    const value = searchParams.get(param);
    if (value) {
      const isProduction = process.env.NODE_ENV === "production";
      const cookieOptions = {
        maxAge: 90 * 24 * 60 * 60, // 90 days
        sameSite: "lax" as const,
        secure: isProduction,
        path: "/",
      };

      response.cookies.set(`${prefix}-gclid`, value, cookieOptions);
      response.cookies.set(`${prefix}-gclid-type`, param, cookieOptions);
      break; // only capture the first one found
    }
  }

  return response;
}
