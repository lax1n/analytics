import { NextRequest, NextResponse } from "next/server";
export declare function createFunnelHandler(): {
    GET: (request: NextRequest) => Promise<NextResponse<{
        error: string;
    }> | NextResponse<{
        range: string;
        stages: {
            key: string;
            label: string;
            count: any;
        }[];
        bySource: any;
        byDevice: any;
        byKeyword: any;
        conversionRates: {
            label: string;
            from: string;
            to: string;
            rate: number;
        }[];
    }>>;
};
//# sourceMappingURL=funnel.d.ts.map