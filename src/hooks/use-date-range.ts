"use client";

import { useState, useMemo } from "react";

export function useDateRange(defaultRange: string = "7d") {
  const [range, setRange] = useState(defaultRange);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (from) {
      p.set("from", from);
      if (to) p.set("to", to);
    } else {
      p.set("range", range);
    }
    return p;
  }, [range, from, to]);

  const setPreset = (preset: string) => {
    setFrom("");
    setTo("");
    setRange(preset);
  };

  const setCustomRange = (newFrom: string, newTo?: string) => {
    setFrom(newFrom);
    setTo(newTo || newFrom);
    setRange("custom");
  };

  return {
    range,
    from,
    to,
    params,
    setPreset,
    setFrom,
    setTo,
    setCustomRange,
  };
}
