import { NextRequest, NextResponse } from "next/server";
import { getConfig } from "../../config.js";
import { pageViews } from "../../schema.js";
import { rateLimit as defaultRateLimit } from "../../lib/rate-limit.js";
import { parseDateRange } from "../../lib/date-range.js";
import { sql, gte, lte, and, count, countDistinct } from "drizzle-orm";

export function createAnalyticsHandler() {
  async function GET(request: NextRequest) {
    const config = getConfig();
    const db = config.getDb() as any;
    const limiter = config.rateLimit ?? defaultRateLimit;

    if (!(await config.requireAdmin(request))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    if (!limiter(`admin-analytics:${ip}`, 10, 60_000)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const range = request.nextUrl.searchParams.get("range") ?? "7d";
    const { since, until } = parseDateRange(request.nextUrl.searchParams);

    const dateFilter = until
      ? and(gte(pageViews.createdAt, since), lte(pageViews.createdAt, until))
      : gte(pageViews.createdAt, since);

    const [
      [totals],
      viewsByDay,
      topPages,
      devices,
      referrers,
      countries,
      campaigns,
    ] = await Promise.all([
      db
        .select({
          views: count(),
          uniqueSessions: countDistinct(pageViews.sessionId),
        })
        .from(pageViews)
        .where(dateFilter),

      db
        .select({
          date: sql<string>`DATE(${pageViews.createdAt})`.as("date"),
          views: count(),
          sessions: countDistinct(pageViews.sessionId),
        })
        .from(pageViews)
        .where(dateFilter)
        .groupBy(sql`DATE(${pageViews.createdAt})`)
        .orderBy(sql`DATE(${pageViews.createdAt})`),

      db
        .select({
          path: pageViews.path,
          views: count(),
        })
        .from(pageViews)
        .where(dateFilter)
        .groupBy(pageViews.path)
        .orderBy(sql`count(*) DESC`)
        .limit(10),

      db
        .select({
          deviceType: pageViews.deviceType,
          views: count(),
        })
        .from(pageViews)
        .where(dateFilter)
        .groupBy(pageViews.deviceType)
        .orderBy(sql`count(*) DESC`),

      db
        .select({
          referrer: pageViews.referrer,
          views: count(),
        })
        .from(pageViews)
        .where(dateFilter)
        .groupBy(pageViews.referrer)
        .orderBy(sql`count(*) DESC`)
        .limit(10),

      db
        .select({
          country: pageViews.country,
          views: count(),
        })
        .from(pageViews)
        .where(dateFilter)
        .groupBy(pageViews.country)
        .orderBy(sql`count(*) DESC`)
        .limit(10),

      db
        .select({
          source: pageViews.utmSource,
          medium: pageViews.utmMedium,
          campaign: pageViews.utmCampaign,
          views: count(),
        })
        .from(pageViews)
        .where(dateFilter)
        .groupBy(
          pageViews.utmSource,
          pageViews.utmMedium,
          pageViews.utmCampaign
        )
        .orderBy(sql`count(*) DESC`)
        .limit(10),
    ]);

    return NextResponse.json({
      range,
      totals: {
        views: totals?.views ?? 0,
        uniqueSessions: totals?.uniqueSessions ?? 0,
      },
      viewsByDay,
      topPages,
      devices: devices.filter(
        (d: { deviceType: string | null }) => d.deviceType
      ),
      referrers: referrers.filter(
        (r: { referrer: string | null }) => r.referrer
      ),
      countries: countries.filter(
        (c: { country: string | null }) => c.country
      ),
      campaigns: campaigns.filter(
        (c: { source: string | null }) => c.source
      ),
    });
  }

  return { GET };
}
