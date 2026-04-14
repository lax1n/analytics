"use client";
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
function getSessionId(prefix) {
    const key = `${prefix}-sid`;
    let sid = sessionStorage.getItem(key);
    if (!sid) {
        sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
        sessionStorage.setItem(key, sid);
    }
    return sid;
}
function getDeviceType() {
    const w = window.innerWidth;
    if (w < 768)
        return "mobile";
    if (w < 1024)
        return "tablet";
    return "desktop";
}
function getUtmParams(searchParams) {
    const utm = {};
    for (const key of [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
    ]) {
        const val = searchParams.get(key);
        if (val)
            utm[key] = val;
    }
    return Object.keys(utm).length > 0 ? utm : null;
}
function getCookie(name) {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}
function getGclid(searchParams, prefix) {
    for (const param of ["gclid", "gbraid", "wbraid"]) {
        const val = searchParams.get(param);
        if (val)
            return { value: val, type: param };
    }
    // Fallback: read from cookie set by middleware (Safari ITP workaround)
    const cookieValue = getCookie(`${prefix}-gclid`);
    const cookieType = getCookie(`${prefix}-gclid-type`);
    if (cookieValue) {
        return { value: cookieValue, type: cookieType || "gclid" };
    }
    return null;
}
function incrementPageViewCount(prefix) {
    const key = `${prefix}-pageviews`;
    const current = parseInt(sessionStorage.getItem(key) || "0", 10);
    const next = current + 1;
    sessionStorage.setItem(key, String(next));
    return next;
}
function ensureSessionStart(prefix) {
    const key = `${prefix}-session-start`;
    const existing = sessionStorage.getItem(key);
    if (existing)
        return parseInt(existing, 10);
    const now = Date.now();
    sessionStorage.setItem(key, String(now));
    return now;
}
function checkReturnVisitor(prefix) {
    const key = `${prefix}-visited`;
    const visited = localStorage.getItem(key);
    if (!visited) {
        localStorage.setItem(key, "1");
        return false;
    }
    return true;
}
function persistAttribution(searchParams, prefix) {
    const key = `${prefix}-attribution`;
    // "Best-touch" logic: update attribution if this page view has better data
    const existing = sessionStorage.getItem(key);
    if (existing) {
        const prev = JSON.parse(existing);
        const hasNewSource = searchParams.get("utm_source") ||
            searchParams.get("gclid") ||
            searchParams.get("gbraid") ||
            searchParams.get("wbraid");
        const hadSource = prev.utm_source || prev.gclid;
        if (!hasNewSource || hadSource)
            return;
    }
    const data = {};
    for (const k of [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
    ]) {
        const v = searchParams.get(k);
        if (v)
            data[k] = v;
    }
    // Google Ads ValueTrack params
    for (const k of [
        "matchtype",
        "device",
        "network",
        "adgroupid",
        "creative",
    ]) {
        const v = searchParams.get(k);
        if (v)
            data[k] = v;
    }
    const gclidInfo = getGclid(searchParams, prefix);
    if (gclidInfo) {
        data.gclid = gclidInfo.value;
        data.gclidType = gclidInfo.type;
    }
    if (document.referrer) {
        try {
            data.referrer = new URL(document.referrer).hostname;
        }
        catch {
            data.referrer = document.referrer.slice(0, 200);
        }
        data.referrerFull = document.referrer.slice(0, 500);
    }
    data.landingPage = window.location.pathname + window.location.search;
    data.isReturnVisitor = checkReturnVisitor(prefix) ? "true" : "false";
    data.pageViewCount = String(parseInt(sessionStorage.getItem(`${prefix}-pageviews`) || "0", 10));
    data.sessionStartedAt = String(ensureSessionStart(prefix));
    sessionStorage.setItem(key, JSON.stringify(data));
}
export function PageTracker({ basePath = "/api/analytics", prefix = "bp", skipPaths = ["/api", "/admin"], }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const lastPath = useRef(null);
    useEffect(() => {
        if (pathname === lastPath.current)
            return;
        lastPath.current = pathname;
        // Skip tracking for configured paths
        if (skipPaths.some((p) => pathname.startsWith(p) || pathname.includes(p))) {
            return;
        }
        try {
            const sessionId = getSessionId(prefix);
            ensureSessionStart(prefix);
            incrementPageViewCount(prefix);
            const utm = getUtmParams(searchParams);
            const gclidInfo = getGclid(searchParams, prefix);
            persistAttribution(searchParams, prefix);
            const payload = {
                path: pathname,
                referrer: document.referrer || null,
                sessionId,
                deviceType: getDeviceType(),
                screenWidth: window.screen.width,
                screenHeight: window.screen.height,
                language: navigator.language,
            };
            if (utm)
                Object.assign(payload, utm);
            if (gclidInfo)
                payload.gclid = gclidInfo.value;
            const blob = new Blob([JSON.stringify(payload)], {
                type: "application/json",
            });
            navigator.sendBeacon(`${basePath}/track`, blob);
        }
        catch {
            // silently fail — tracking should never break the app
        }
    }, [pathname, searchParams, basePath, prefix, skipPaths]);
    return null;
}
//# sourceMappingURL=tracker.js.map