import { NextResponse } from "next/server";
import { getConfig } from "../config.js";
import { pageViews } from "../schema.js";
import { rateLimit as defaultRateLimit } from "../lib/rate-limit.js";
function normalizeReferrer(raw) {
    if (!raw)
        return null;
    try {
        return new URL(raw).hostname;
    }
    catch {
        return raw.slice(0, 200);
    }
}
export function createTrackHandler() {
    async function POST(request) {
        const config = getConfig();
        const db = config.getDb();
        const limiter = config.rateLimit ?? defaultRateLimit;
        const ip = request.headers.get("x-forwarded-for") ?? "unknown";
        if (!limiter(`track:${ip}`, 30, 60_000)) {
            return new NextResponse(null, { status: 204 });
        }
        try {
            const body = (await request.json());
            if (!body.path || typeof body.path !== "string") {
                return new NextResponse(null, { status: 204 });
            }
            const userAgent = request.headers.get("user-agent") ?? undefined;
            const country = config.getCountry
                ? config.getCountry(request.headers)
                : request.headers.get("cf-ipcountry") ?? undefined;
            await db.insert(pageViews).values({
                path: body.path.slice(0, 500),
                referrer: normalizeReferrer(body.referrer),
                userAgent: userAgent?.slice(0, 500) || null,
                country: country || null,
                sessionId: body.sessionId?.slice(0, 100) || null,
                deviceType: body.deviceType?.slice(0, 20) || null,
                screenWidth: typeof body.screenWidth === "number" ? body.screenWidth : null,
                screenHeight: typeof body.screenHeight === "number" ? body.screenHeight : null,
                language: body.language?.slice(0, 20) || null,
                utmSource: body.utm_source?.slice(0, 200) || null,
                utmMedium: body.utm_medium?.slice(0, 200) || null,
                utmCampaign: body.utm_campaign?.slice(0, 200) || null,
                utmTerm: body.utm_term?.slice(0, 200) || null,
                utmContent: body.utm_content?.slice(0, 200) || null,
                gclid: body.gclid?.slice(0, 200) || null,
            });
            return new NextResponse(null, { status: 204 });
        }
        catch (error) {
            console.error("[@bestillpass/analytics] Failed to record page view:", error);
            return new NextResponse(null, { status: 204 });
        }
    }
    return { POST };
}
//# sourceMappingURL=track.js.map