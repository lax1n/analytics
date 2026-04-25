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
    }>>;
};
//# sourceMappingURL=funnel.d.ts.map