interface BarChartProps {
    data: {
        label: string;
        value: number;
    }[];
    height?: number;
    formatValue?: (value: number) => string;
    className?: string;
}
export declare function BarChart({ data, height, formatValue, className, }: BarChartProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=bar-chart.d.ts.map