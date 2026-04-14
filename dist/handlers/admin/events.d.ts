import { NextRequest, NextResponse } from "next/server";
export declare function createEventFeedHandler(): {
    GET: (request: NextRequest) => Promise<NextResponse<{
        error: string;
    }> | NextResponse<{
        events: any;
        total: any;
        hasMore: boolean;
        eventNames: any;
    }>>;
};
//# sourceMappingURL=events.d.ts.map