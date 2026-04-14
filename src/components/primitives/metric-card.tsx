interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}

export function MetricCard({
  label,
  value,
  subtitle,
  className,
}: MetricCardProps) {
  return (
    <div data-analytics-metric className={className}>
      <span data-analytics-metric-label>{label}</span>
      <span data-analytics-metric-value>{value}</span>
      {subtitle && (
        <span
          style={{
            fontSize: "0.75rem",
            color: "var(--analytics-text-muted)",
          }}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
}
