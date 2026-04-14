interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

export function BarChart({
  data,
  height = 160,
  formatValue = (v) => String(v),
  className,
}: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={className}>
      <div
        data-analytics-barchart
        style={{ height: `${height}px` }}
        title={data.map((d) => `${d.label}: ${formatValue(d.value)}`).join("\n")}
      >
        {data.map((d, i) => (
          <div
            key={i}
            data-analytics-barchart-bar
            style={{ height: `${Math.max((d.value / max) * 100, d.value > 0 ? 2 : 0)}%` }}
            title={`${d.label}: ${formatValue(d.value)}`}
          />
        ))}
      </div>
      {data.length <= 15 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.625rem",
            color: "var(--analytics-text-muted)",
            marginTop: "0.25rem",
          }}
        >
          <span>{data[0]?.label}</span>
          {data.length > 1 && <span>{data[data.length - 1]?.label}</span>}
        </div>
      )}
    </div>
  );
}
