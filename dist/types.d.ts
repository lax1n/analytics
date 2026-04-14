import type { NextRequest } from "next/server";
export interface FunnelStage {
    key: string;
    label: string;
    query: "sessions" | {
        event: string;
    } | {
        path: string;
    };
}
export interface RevenueData {
    today: {
        revenue: number;
        count: number;
    };
    thisWeek: {
        revenue: number;
        count: number;
    };
    thisMonth: {
        revenue: number;
        count: number;
    };
    allTime: {
        revenue: number;
        count: number;
    };
    dailyRevenue: {
        date: string;
        revenue: number;
        count: number;
    }[];
}
export interface AnalyticsConfig {
    /** Return a Drizzle db instance */
    getDb: () => unknown;
    /** Return true if the request is from an admin */
    requireAdmin: (request: NextRequest) => Promise<boolean>;
    /** Extract country from request headers. Default: reads cf-ipcountry */
    getCountry?: (headers: Headers) => string | null;
    /** Custom rate limiter. Default: built-in in-memory limiter */
    rateLimit?: (key: string, limit: number, windowMs: number) => boolean;
    /** Paths to skip tracking. Default: ["/api", "/admin"] */
    skipPaths?: string[];
    /** Funnel configuration */
    funnel?: {
        stages: FunnelStage[];
    };
    /** Revenue query — app implements this against its own payments table */
    revenue?: {
        query: (since: Date, until: Date | null) => Promise<RevenueData>;
    };
}
export interface TrafficData {
    range: string;
    totals: {
        views: number;
        uniqueSessions: number;
    };
    viewsByDay: {
        date: string;
        views: number;
        sessions: number;
    }[];
    topPages: {
        path: string;
        views: number;
    }[];
    devices: {
        deviceType: string;
        views: number;
    }[];
    referrers: {
        referrer: string;
        views: number;
    }[];
    countries: {
        country: string;
        views: number;
    }[];
    campaigns: {
        source: string;
        medium: string;
        campaign: string;
        views: number;
    }[];
}
export interface FunnelData {
    range: string;
    stages: {
        key: string;
        label: string;
        count: number;
    }[];
    bySource: {
        source: string;
        visitors: number;
        converted: number;
    }[];
    byDevice: {
        device: string;
        visitors: number;
        converted: number;
    }[];
    byKeyword: {
        keyword: string;
        visitors: number;
        converted: number;
    }[];
    conversionRates: {
        label: string;
        from: string;
        to: string;
        rate: number;
    }[];
}
export interface EventFeedData {
    events: EventRow[];
    total: number;
    hasMore: boolean;
    eventNames: {
        name: string;
        count: number;
    }[];
}
export interface EventRow {
    id: string;
    sessionId: string | null;
    eventName: string;
    properties: Record<string, unknown> | null;
    path: string | null;
    createdAt: string;
}
//# sourceMappingURL=types.d.ts.map