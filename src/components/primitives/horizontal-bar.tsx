interface HorizontalBarProps {
  label: string;
  value: number;
  max: number;
  /** Optional secondary text after the value */
  suffix?: string;
  className?: string;
  /** Label width in characters. Default: auto */
  labelWidth?: string;
}

export function HorizontalBar({
  label,
  value,
  max,
  suffix,
  className,
  labelWidth,
}: HorizontalBarProps) {
  const pct = max > 0 ? (value / max) * 100 : 0;

  return (
    <div data-analytics-bar className={className}>
      <span
        data-analytics-bar-label
        style={labelWidth ? { width: labelWidth } : undefined}
      >
        {label}
      </span>
      <div data-analytics-bar-track>
        <div
          data-analytics-bar-fill
          style={{ width: `${Math.max(pct > 0 ? 2 : 0, pct)}%` }}
        />
      </div>
      <span data-analytics-bar-value>
        {value}
        {suffix && (
          <span style={{ color: "var(--analytics-text-muted)", marginLeft: "0.25rem" }}>
            {suffix}
          </span>
        )}
      </span>
    </div>
  );
}
