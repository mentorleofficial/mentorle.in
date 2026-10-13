"use client";

import { useId, useState } from "react";
import type { CSSProperties } from "react";
import { becomeAMentorPage } from "@/data/become-a-mentor";

type CalculatorConfig = typeof becomeAMentorPage.calculator;

const rupees = (value: number) => `₹${value.toLocaleString("en-IN")}`;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

// Gross-up engine: the mentor's payout is fixed; gateway fee and platform margin are added on top,
// then the mentee price is rounded up to the next ₹…99 (₹512 → ₹599, ₹1,035 → ₹1,099).
export function menteePrice(payout: number, { gatewayFee, platformTake }: Pick<CalculatorConfig, "gatewayFee" | "platformTake">) {
  const raw = (payout * (1 + gatewayFee)) / (1 - platformTake);
  return Math.max(99, Math.ceil((raw - 99) / 100) * 100 + 99);
}

export function RateCalculator({ config }: { config: CalculatorConfig }) {
  const [rate, setRate] = useState(config.defaultRate);
  const [draft, setDraft] = useState(config.defaultRate.toLocaleString("en-IN"));
  const inputId = useId();
  const sliderId = useId();
  const hintId = useId();

  const commit = (value: number) => {
    const next = clamp(Math.round(value), config.typedRange.min, config.typedRange.max);
    setRate(next);
    setDraft(next.toLocaleString("en-IN"));
  };

  const { min, max, step } = config.slider;
  const fill = ((clamp(rate, min, max) - min) / (max - min)) * 100;

  return (
    <div className="grid gap-10 bg-white p-6 md:p-8 lg:grid-cols-[46%_1fr] lg:gap-0 lg:pt-8 lg:pb-12">
      <div className="lg:max-w-[22.375rem]">
        <label htmlFor={inputId} className="block text-xl font-medium text-ink md:text-2xl xl:whitespace-nowrap">
          {config.inputLabel}
        </label>
        <div className="mt-6 flex h-[4.8125rem] items-center gap-4 border border-line px-4 transition-colors focus-within:border-ink">
          <span aria-hidden className="text-5xl leading-none font-medium text-muted">
            ₹
          </span>
          <input
            id={inputId}
            inputMode="numeric"
            aria-describedby={hintId}
            value={draft}
            onChange={(event) => {
              const digits = event.target.value.replace(/[^\d]/g, "").slice(0, 5);
              setDraft(digits);
              if (digits) setRate(clamp(Number(digits), config.typedRange.min, config.typedRange.max));
            }}
            onBlur={() => commit(Number(draft.replace(/[^\d]/g, "")) || config.defaultRate)}
            onKeyDown={(event) => {
              if (event.key === "Enter") commit(Number(draft.replace(/[^\d]/g, "")) || config.defaultRate);
            }}
            className="w-full min-w-0 bg-transparent text-[2.5rem] leading-none font-medium text-ink tabular-nums outline-none"
          />
        </div>
        <p id={hintId} className="mt-6 text-base leading-snug text-ink">
          {config.hint}
        </p>
        <label htmlFor={sliderId} className="sr-only">
          Hourly take-home slider
        </label>
        <input
          id={sliderId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={clamp(rate, min, max)}
          aria-valuetext={`${rupees(rate)} per hour`}
          onChange={(event) => commit(Number(event.target.value))}
          style={{ "--fill": `${fill}%` } as CSSProperties}
          className="rate-slider mt-5 w-full"
        />
      </div>

      <div>
        <table className="w-full text-ink">
          <caption className="sr-only">Earnings at {rupees(rate)} per hour</caption>
          <thead>
            <tr className="text-base">
              <th scope="col" className="pb-3 text-left font-normal">
                {config.columns.format}
              </th>
              <th scope="col" className="pb-3 text-center font-normal">
                {config.columns.pays}
              </th>
              <th scope="col" className="pb-3 text-right font-normal lg:pr-[1.1875rem]">
                {config.columns.keep}
              </th>
            </tr>
          </thead>
          <tbody>
            {config.formats.map((format) => {
              const payout = Math.round((rate * format.minutes) / 60);
              return (
                <tr key={format.minutes}>
                  <th scope="row" className="py-3 text-left align-top font-normal">
                    <span className="block text-xl font-medium md:text-2xl">{format.minutes} min</span>
                    <span className="mt-1 block text-sm md:text-base">{format.name}</span>
                  </th>
                  <td className="py-3 text-center align-top text-lg tabular-nums md:text-2xl">{rupees(menteePrice(payout, config))}</td>
                  <td className="py-3 text-right align-top text-xl font-semibold tabular-nums md:text-[2rem] md:leading-tight lg:pr-[1.1875rem]">
                    {rupees(payout)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="sr-only" aria-live="polite">
          {`At ${rupees(rate)} an hour, a 60-minute session pays you ${rupees(rate)} and the mentee pays ${rupees(menteePrice(rate, config))}.`}
        </p>
        <p className="mt-4 max-w-[33.5rem] text-base leading-snug text-ink">{config.note}</p>
      </div>
    </div>
  );
}
