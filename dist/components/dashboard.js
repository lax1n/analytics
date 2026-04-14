"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TrafficWidget } from "./widgets/traffic.js";
import { FunnelWidget } from "./widgets/funnel.js";
import { EventFeedWidget } from "./widgets/event-feed.js";
import { RevenueWidget } from "./widgets/revenue.js";
export function AnalyticsDashboard({ basePath = "/api/analytics", className, showRevenue = true, showFunnel = true, showEvents = true, formatCurrency, }) {
    return (_jsxs("div", { "data-analytics": true, "data-analytics-dashboard": true, className: className, children: [showRevenue && (_jsx(RevenueWidget, { basePath: basePath, formatCurrency: formatCurrency })), _jsx(TrafficWidget, { basePath: basePath }), showFunnel && _jsx(FunnelWidget, { basePath: basePath }), showEvents && _jsx(EventFeedWidget, { basePath: basePath })] }));
}
//# sourceMappingURL=dashboard.js.map