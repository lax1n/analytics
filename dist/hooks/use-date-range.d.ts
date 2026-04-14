export declare function useDateRange(defaultRange?: string): {
    range: string;
    from: string;
    to: string;
    params: URLSearchParams;
    setPreset: (preset: string) => void;
    setFrom: import("react").Dispatch<import("react").SetStateAction<string>>;
    setTo: import("react").Dispatch<import("react").SetStateAction<string>>;
    setCustomRange: (newFrom: string, newTo?: string) => void;
};
//# sourceMappingURL=use-date-range.d.ts.map