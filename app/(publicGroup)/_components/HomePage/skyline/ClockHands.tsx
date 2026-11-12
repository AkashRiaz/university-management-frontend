"use client";

import { useEffect, useState } from "react";

const angles = (date: Date) => {
  const minutes = date.getMinutes();
  return {
    hour: ((date.getHours() % 12) + minutes / 60) * 30,
    minute: minutes * 6,
  };
};

/**
 * Hands of the clock tower. Server HTML shows a classic 10:10; after mount
 * the clock shows the visitor's real local time and ticks every 30 seconds.
 */
export default function ClockHands({ cx, cy }: { cx: number; cy: number }) {
  const [time, setTime] = useState({ hour: 305, minute: 60 });

  useEffect(() => {
    const update = () => setTime(angles(new Date()));
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <g stroke="var(--scene-shade)" strokeLinecap="round">
      <line
        x1={cx}
        y1={cy}
        x2={cx}
        y2={cy - 12}
        strokeWidth="3"
        transform={`rotate(${time.hour} ${cx} ${cy})`}
      />
      <line
        x1={cx}
        y1={cy}
        x2={cx}
        y2={cy - 18}
        strokeWidth="2"
        transform={`rotate(${time.minute} ${cx} ${cy})`}
      />
      <circle cx={cx} cy={cy} r="2.5" fill="var(--scene-shade)" />
    </g>
  );
}
