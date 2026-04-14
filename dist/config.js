let _config = null;
/**
 * Initialize the analytics package with your app's configuration.
 * Call this once in a file like `lib/analytics.ts`, then import that file
 * (for its side effect) in each API route that uses analytics handlers.
 */
export function defineAnalytics(config) {
    _config = config;
    return config;
}
/**
 * Get the current analytics config. Throws if `defineAnalytics()` hasn't been called.
 */
export function getConfig() {
    if (!_config) {
        throw new Error("[@bestillpass/analytics] Config not initialized. Call defineAnalytics() before using analytics handlers.");
    }
    return _config;
}
//# sourceMappingURL=config.js.map