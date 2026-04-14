interface AnalyticsDashboardProps {
    basePath?: string;
    className?: string;
    /** Show revenue widget. Default: true */
    showRevenue?: boolean;
    /** Show funnel widget. Default: true */
    showFunnel?: boolean;
    /** Show event feed widget. Default: true */
    showEvents?: boolean;
    /** Format currency value for revenue widget */
    formatCurrency?: (amount: number) => string;
}
export declare function AnalyticsDashboard({ basePath, className, showRevenue, showFunnel, showEvents, formatCurrency, }: AnalyticsDashboardProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=dashboard.d.ts.map