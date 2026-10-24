"use client";

import { useId, useState } from "react";
import { stepEnterClass } from "@/components/auth/AuthStep";
import { FormAlert, SubmitButton, TextAreaField, outlineButtonClasses } from "@/components/forms/fields";
import { StarIcon, Stars } from "@/components/sessions/Stars";
import { SiteDialog } from "@/components/ui/SiteDialog";
import { ratingCopy as copy } from "@/data/sessions";
import { sessionsService } from "@/lib/sessions/service";
import type { MySession } from "@/lib/sessions/service";

const COMMENT_MAX = 1000;
const questions = copy.questions;

type Rating = NonNullable<MySession["myRating"]>;

// The platform's five-question survey, one question per step (options or 1–5 stars), then an optional comment
// with the overall rating, in the site's dialog. Saves one feedback row for the mentor.
export function RateSessionDialog({ session, userId, onClose, onRated }: { session: MySession; userId: string; onClose: () => void; onRated: (rating: Rating) => void }) {
  const titleId = useId();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const total = questions.length + 1;
  const go = (next: number) => {
    setDirection(next < step ? "back" : "forward");
    setHover(0);
    setStep(next);
  };
  const average = Object.values(answers).reduce((sum, value) => sum + value, 0) / questions.length;

  const submit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const expectation = questions[0].options?.find((option) => option.value === answers.expectation)?.label ?? "";
      const rating = await sessionsService.rate({ sessionId: session.id, userId, answers, expectationLabel: expectation, comment });
      onRated(rating);
      setDirection("forward");
      setDone(true);
    } catch (cause) {
      // Already rated (another tab) or the session isn't completed.
      setError(String(cause).includes("duplicate") ? copy.already : copy.error);
    } finally {
      setSubmitting(false);
    }
  };

  const progress = done ? 100 : Math.round((step / total) * 100);
  const question = questions[step];

  let content;
  if (done) {
    content = (
      <div className="text-center">
        <h2 id={titleId} className="text-[1.75rem] leading-tight font-medium text-ink md:text-[2rem]">
          {copy.done.title}
        </h2>
        <p className="mt-3 text-base text-ink-soft">{copy.done.body(session.mentor.name)}</p>
        <div className="mt-6 flex justify-center">
          <Stars value={Math.round(average)} label={copy.starsLabel(Math.round(average))} className="size-7" />
        </div>
        <div className="mx-auto mt-8 max-w-[20.625rem]">
          <SubmitButton type="button" loading={false} loadingLabel="" onClick={onClose}>
            {copy.done.close}
          </SubmitButton>
        </div>
      </div>
    );
  } else if (question) {
    const value = answers[question.id] ?? 0;
    content = (
      <div>
        <p className="text-center text-xs tracking-wide text-muted uppercase tabular-nums">{copy.stepOf(step + 1, total)}</p>
        <h2 id={titleId} className="mt-3 text-center text-[1.75rem] leading-tight font-medium text-ink md:text-[2rem]">
          {copy.title(session.mentor.name)}
        </h2>
        <p className="mt-6 text-xs tracking-[0.06em] text-brand uppercase">{question.title}</p>
        <p className="mt-1.5 text-lg leading-snug font-medium text-ink">{question.question}</p>

        {question.options ? (
          <div className="mt-5 grid gap-2.5" role="radiogroup" aria-label={question.question}>
            {question.options.map((option) => {
              const selected = value === option.value;
              return (
                <button
                  key={option.label}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setAnswers((current) => ({ ...current, [question.id]: option.value }))}
                  className={`flex items-center justify-between gap-4 border px-4 py-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                    selected ? "border-ink bg-ink text-white" : "border-[#dadada] text-ink hover:border-ink"
                  }`}
                >
                  {option.label}
                  <span className="inline-flex gap-0.5" aria-hidden>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} filled={star <= option.value} className="size-3.5" filledClass={selected ? "text-white" : "text-brand"} emptyClass={selected ? "text-white/30" : "text-line"} />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center">
            <div className="flex gap-1.5" role="radiogroup" aria-label={question.question} onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  role="radio"
                  aria-checked={value === star}
                  aria-label={copy.starsLabel(star)}
                  onMouseEnter={() => setHover(star)}
                  onClick={() => setAnswers((current) => ({ ...current, [question.id]: star }))}
                  className="p-1 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-brand"
                >
                  <StarIcon filled={star <= (hover || value)} className="size-10" />
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted" aria-live="polite">
              {value ? copy.starsLabel(value) : copy.selectRating}
            </p>
          </div>
        )}

        <div className="mt-8 flex gap-3">
          {step > 0 && (
            <button type="button" onClick={() => go(step - 1)} className={outlineButtonClasses()}>
              ← {copy.back}
            </button>
          )}
          <SubmitButton type="button" loading={false} loadingLabel="" disabled={!value} onClick={() => go(step + 1)} className="flex-1">
            {copy.next} →
          </SubmitButton>
        </div>
      </div>
    );
  } else {
    content = (
      <div>
        <p className="text-center text-xs tracking-wide text-muted uppercase tabular-nums">{copy.stepOf(total, total)}</p>
        <h2 id={titleId} className="mt-3 text-center text-[1.75rem] leading-tight font-medium text-ink md:text-[2rem]">
          {copy.finalTitle}
        </h2>
        <div className="mt-6 flex items-center justify-between gap-4 border border-line bg-surface px-5 py-4">
          <span className="text-sm text-ink-soft">{copy.overall}</span>
          <span className="flex items-center gap-3">
            <Stars value={Math.round(average)} label={copy.starsLabel(Math.round(average))} className="size-5" />
            <span className="text-base font-medium text-ink tabular-nums">{average.toFixed(1)} / 5</span>
          </span>
        </div>
        <TextAreaField
          id={`${titleId}-comment`}
          className="mt-5"
          label={copy.commentLabel}
          placeholder={copy.commentPlaceholder}
          maxLength={COMMENT_MAX}
          rows={4}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        <div className="mt-4">
          <FormAlert>{error}</FormAlert>
        </div>
        <div className="mt-4 flex gap-3">
          <button type="button" onClick={() => go(step - 1)} disabled={submitting} className={outlineButtonClasses()}>
            ← {copy.back}
          </button>
          <SubmitButton type="button" loading={submitting} loadingLabel={copy.submitting} onClick={() => void submit()} className="flex-1">
            {copy.submit}
          </SubmitButton>
        </div>
      </div>
    );
  }

  return (
    <SiteDialog titleId={titleId} closeLabel={copy.close} onClose={onClose} stepKey={done ? "done" : String(step)}>
      {/* Progress along the card's top edge, like onboarding. */}
      <div className="absolute inset-x-0 top-0 h-1 bg-surface" aria-hidden>
        <div className="h-full bg-brand transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>
      <div key={done ? "done" : step} className={stepEnterClass(direction)}>
        {content}
      </div>
    </SiteDialog>
  );
}
