import type { FunnelData } from "../types.js";
export declare function useFunnel(basePath?: string): {
    data: FunnelData | null;
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
//# sourceMappingURL=use-funnel.d.ts.map