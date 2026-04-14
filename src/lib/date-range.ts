/**
 * Parse date range from API query params.
 * Supports preset ranges (24h, 7d, 30d) and custom from/to dates.
 */
export function parseDateRange(params: URLSearchParams): {
  since: Date;
  until: Date | null;
} {
  const range = params.get("range") ?? "7d";
  const fromParam = params.get("from");
  const toParam = params.get("to");

  if (fromParam) {
    return {
      since: new Date(fromParam + "T00:00:00"),
      until: toParam ? new Date(toParam + "T23:59:59") : null,
    };
  }

  const days = range === "30d" ? 30 : range === "24h" ? 1 : 7;
  return {
    since: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
    until: null,
  };
}
