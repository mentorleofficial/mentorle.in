"use client";

import { useEffect, useState } from "react";

const LAUNCH_AT = new Date(
  process.env.NEXT_PUBLIC_LAUNCH_AT || "2026-10-26T00:00:00+05:30"
).getTime();

const UNITS = [
  { label: "Days", ms: 86400000 },
  { label: "Hours", ms: 3600000 },
  { label: "Minutes", ms: 60000 },
  { label: "Seconds", ms: 1000 },
];

function splitRemaining(remaining) {
  let rest = Math.max(remaining, 0);
  return UNITS.map(({ label, ms }) => {
    const value = Math.floor(rest / ms);
    rest -= value * ms;
    return { label, value };
  });
}

export default function Countdown() {
  // null until mounted, so server and client markup match
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now !== null && now >= LAUNCH_AT) {
    return (
      <p className="text-2xl sm:text-3xl font-extrabold text-black text-center">
        We&apos;re launching — check back shortly.
      </p>
    );
  }

  const parts = now === null ? null : splitRemaining(LAUNCH_AT - now);

  return (
    <div
      className="grid grid-cols-4 gap-2 sm:gap-4 w-full max-w-xl"
      role="timer"
      aria-label="Time until launch"
    >
      {UNITS.map(({ label }, i) => (
        <div
          key={label}
          className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white py-4 sm:py-6 shadow-sm"
        >
          <span className="text-3xl sm:text-5xl font-extrabold text-black tabular-nums leading-none">
            {parts ? String(parts[i].value).padStart(2, "0") : "--"}
          </span>
          <span className="mt-2 text-[0.6875rem] sm:text-sm font-semibold uppercase tracking-wider text-black/60">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
