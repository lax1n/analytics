interface PageTrackerProps {
    /** API base path for analytics endpoints. Default: "/api/analytics" */
    basePath?: string;
    /** Prefix for sessionStorage/localStorage/cookie keys. Default: "bp" */
    prefix?: string;
    /** Path prefixes to skip tracking. Default: ["/api", "/admin"] */
    skipPaths?: string[];
}
export declare function PageTracker({ basePath, prefix, skipPaths, }: PageTrackerProps): null;
export {};
//# sourceMappingURL=tracker.d.ts.map