import type { AnalyticsConfig } from "./types.js";
/**
 * Initialize the analytics package with your app's configuration.
 * Call this once in a file like `lib/analytics.ts`, then import that file
 * (for its side effect) in each API route that uses analytics handlers.
 */
export declare function defineAnalytics(config: AnalyticsConfig): AnalyticsConfig;
/**
 * Get the current analytics config. Throws if `defineAnalytics()` hasn't been called.
 */
export declare function getConfig(): AnalyticsConfig;
//# sourceMappingURL=config.d.ts.map