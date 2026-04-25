"use client";

import { useEffect, useMemo, useState } from "react";

type AnimatedCounterProps = {
  end: number;
  duration?: number;
  suffix?: string;
};

export function AnimatedCounter({ end, duration = 1400, suffix = "" }: AnimatedCounterProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    let startTime = 0;

    const tick = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * end));

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, end]);

  const formatted = useMemo(() => value.toLocaleString("en-IN"), [value]);

  return (
    <>
      {formatted}
      {suffix}
    </>
  );
}
