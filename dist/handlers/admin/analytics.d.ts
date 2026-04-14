import { NextRequest, NextResponse } from "next/server";
export declare function createAnalyticsHandler(): {
    GET: (request: NextRequest) => Promise<NextResponse<{
        error: string;
    }> | NextResponse<{
        range: string;
        totals: {
            views: any;
            uniqueSessions: any;
        };
        viewsByDay: any;
        topPages: any;
        devices: any;
        referrers: any;
        countries: any;
        campaigns: any;
    }>>;
};
//# sourceMappingURL=analytics.d.ts.map