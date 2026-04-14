import type { TrafficData } from "../types.js";
export declare function useTrafficStats(basePath?: string): {
    data: TrafficData | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
    dateRange: {
        range: string;
        from: string;
        to: string;
        params: URLSearchParams;
        setPreset: (preset: string) => void;
        setFrom: import("react").Dispatch<import("react").SetStateAction<string>>;
        setTo: import("react").Dispatch<import("react").SetStateAction<string>>;
        setCustomRange: (newFrom: string, newTo?: string) => void;
    };
};
//# sourceMappingURL=use-traffic-stats.d.ts.map