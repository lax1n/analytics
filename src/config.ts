import type { AnalyticsConfig } from "./types.js";

let _config: AnalyticsConfig | null = null;

/**
 * Initialize the analytics package with your app's configuration.
 * Call this once in a file like `lib/analytics.ts`, then import that file
 * (for its side effect) in each API route that uses analytics handlers.
 */
export function defineAnalytics(config: AnalyticsConfig): AnalyticsConfig {
  _config = config;
  return config;
}

/**
 * Get the current analytics config. Throws if `defineAnalytics()` hasn't been called.
 */
export function getConfig(): AnalyticsConfig {
  if (!_config) {
    throw new Error(
      "[@bestillpass/analytics] Config not initialized. Call defineAnalytics() before using analytics handlers."
    );
  }
  return _config;
}
