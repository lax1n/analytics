import { NextResponse } from "next/server";
import { getConfig } from "../config.js";
import { analyticsEvents } from "../schema.js";
import { rateLimit as defaultRateLimit } from "../lib/rate-limit.js";
export function createEventsHandler() {
    async function POST(request) {
        const config = getConfig();
        const db = config.getDb();
        const limiter = config.rateLimit ?? defaultRateLimit;
        const ip = request.headers.get("x-forwarded-for") ?? "unknown";
        if (!limiter(`events:${ip}`, 60, 60_000)) {
            return new NextResponse(null, { status: 204 });
        }
        try {
            const body = (await request.json());
            if (!body.eventName || typeof body.eventName !== "string") {
                return new NextResponse(null, { status: 204 });
            }
            // Limit properties size to prevent abuse (10KB max)
            const properties = body.properties ?? null;
            if (properties && JSON.stringify(properties).length > 10_000) {
                return new NextResponse(null, { status: 204 });
            }
            await db.insert(analyticsEvents).values({
                sessionId: body.sessionId?.slice(0, 100) || null,
                eventName: body.eventName.slice(0, 100),
                path: body.path?.slice(0, 500) || null,
                properties,
            });
            return new NextResponse(null, { status: 204 });
        }
        catch (error) {
            console.error("[@bestillpass/analytics] Failed to record event:", error);
            return new NextResponse(null, { status: 204 });
        }
    }
    return { POST };
}
//# sourceMappingURL=events.js.map