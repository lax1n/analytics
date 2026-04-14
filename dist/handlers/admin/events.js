import { NextResponse } from "next/server";
import { getConfig } from "../../config.js";
import { analyticsEvents } from "../../schema.js";
import { rateLimit as defaultRateLimit } from "../../lib/rate-limit.js";
import { eq, desc, count, sql } from "drizzle-orm";
export function createEventFeedHandler() {
    async function GET(request) {
        const config = getConfig();
        const db = config.getDb();
        const limiter = config.rateLimit ?? defaultRateLimit;
        if (!(await config.requireAdmin(request))) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const ip = request.headers.get("x-forwarded-for") ?? "unknown";
        if (!limiter(`admin-events:${ip}`, 10, 60_000)) {
            return NextResponse.json({ error: "Too many requests" }, { status: 429 });
        }
        const limit = Math.min(parseInt(request.nextUrl.searchParams.get("limit") ?? "50"), 100);
        const offset = parseInt(request.nextUrl.searchParams.get("offset") ?? "0");
        const eventNameFilter = request.nextUrl.searchParams.get("event_name");
        const where = eventNameFilter
            ? eq(analyticsEvents.eventName, eventNameFilter)
            : undefined;
        const [rows, [{ total }], eventNames] = await Promise.all([
            db
                .select()
                .from(analyticsEvents)
                .where(where)
                .orderBy(desc(analyticsEvents.createdAt))
                .limit(limit)
                .offset(offset),
            db.select({ total: count() }).from(analyticsEvents).where(where),
            db
                .select({
                eventName: analyticsEvents.eventName,
                count: count(),
            })
                .from(analyticsEvents)
                .groupBy(analyticsEvents.eventName)
                .orderBy(desc(sql `count(*)`)),
        ]);
        return NextResponse.json({
            events: rows,
            total,
            hasMore: offset + limit < total,
            eventNames: eventNames.map((e) => ({
                name: e.eventName,
                count: e.count,
            })),
        });
    }
    return { GET };
}
//# sourceMappingURL=events.js.map