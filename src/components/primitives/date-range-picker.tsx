"use client";

interface DateRangePickerProps {
  range: string;
  from: string;
  to: string;
  onPreset: (range: string) => void;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
  onCustom: () => void;
  className?: string;
}

export function DateRangePicker({
  range,
  from,
  to,
  onPreset,
  onFromChange,
  onToChange,
  onCustom,
  className,
}: DateRangePickerProps) {
  return (
    <div data-analytics-picker className={className}>
      <div style={{ display: "flex", gap: "0.25rem" }}>
        {(["24h", "7d", "30d"] as const).map((r) => (
          <button
            key={r}
            data-active={range === r && !from ? "true" : undefined}
            onClick={() => onPreset(r)}
          >
            {r === "24h" ? "24h" : r}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
        <input
          type="date"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
        />
        <span
          style={{ fontSize: "0.75rem", color: "var(--analytics-text-muted)" }}
        >
          →
        </span>
        <input
          type="date"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
        />
        {from && <button onClick={onCustom}>Go</button>}
      </div>
    </div>
  );
}
