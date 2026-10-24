"use client";

import { useRef, useState } from "react";
import { Spinner } from "@/components/forms/fields";
import { sessionsCopy } from "@/data/sessions";
import { formatEventDate } from "@/lib/dates";
import { ATTACHMENT_MAX_BYTES, actionItemsService } from "@/lib/sessions/actionItems";
import type { ActionItem, Attachment } from "@/lib/sessions/actionItems";
import type { MySession } from "@/lib/sessions/service";

const copy = sessionsCopy.tasks;

// "2026-10-30" → "October 30, 2026" (a calendar date, not an instant, so it's read as noon IST).
const dueLabel = (date: string) => formatEventDate(`${date}T12:00:00+05:30`);

function FileLink({ file, onRemove, removeLabel }: { file: Attachment; onRemove?: () => void; removeLabel?: string }) {
  return (
    <li className="flex min-w-0 items-center gap-2 border border-[#dadada] bg-white py-1.5 pr-1.5 pl-3 text-sm">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-4 shrink-0 text-muted" aria-hidden>
        <path d="M14 3H6v18h12V7z" />
        <path d="M14 3v4h4" />
      </svg>
      <a href={file.url} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1 truncate text-ink underline-offset-4 hover:underline" title={file.name}>
        {file.name}
      </a>
      {onRemove && (
        <button type="button" onClick={onRemove} aria-label={removeLabel} className="flex size-7 shrink-0 items-center justify-center text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-brand">
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-3" aria-hidden>
            <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" />
          </svg>
        </button>
      )}
    </li>
  );
}

function ItemCard({ item, session, userId, filesAllowed, today, onChange }: { item: ActionItem; session: MySession | undefined; userId: string; filesAllowed: boolean; today: string; onChange: (item: ActionItem) => void }) {
  const [busy, setBusy] = useState<"toggle" | "file" | null>(null);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const overdue = !item.done && item.dueDate !== null && item.dueDate < today;

  const run = async (kind: "toggle" | "file", task: () => Promise<ActionItem>) => {
    setBusy(kind);
    setError("");
    try {
      onChange(await task());
    } catch {
      setError(copy.error);
    } finally {
      setBusy(null);
    }
  };

  const toggle = () =>
    run("toggle", async () => {
      await actionItemsService.setDone(item.id, !item.done);
      return { ...item, done: !item.done, completedAt: item.done ? null : new Date().toISOString() };
    });

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > ATTACHMENT_MAX_BYTES) return setError(copy.tooLarge);
    void run("file", async () => ({ ...item, myFiles: await actionItemsService.attach(item, userId, file) }));
  };

  return (
    <article className={`flex gap-4 border bg-white p-5 md:p-6 ${item.done ? "border-line" : "border-[#cbcbcb]"}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={item.done}
        aria-label={item.done ? copy.markOpen(item.title) : copy.markDone(item.title)}
        onClick={() => void toggle()}
        disabled={busy !== null}
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60 ${
          item.done ? "border-brand bg-brand text-white" : "border-ink/40 bg-white hover:border-ink"
        }`}
      >
        {busy === "toggle" ? (
          <Spinner />
        ) : (
          item.done && (
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="size-4" aria-hidden>
              <path d="M3.5 8.5l3 3 6-7" />
            </svg>
          )
        )}
      </button>

      <div className="min-w-0 flex-1">
        <h3 className={`text-lg leading-snug font-medium ${item.done ? "text-ink-soft line-through decoration-line" : "text-ink"}`}>{item.title}</h3>
        {item.description && <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-line text-ink/85">{item.description}</p>}
        <p className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-soft">
          {item.done && item.completedAt ? (
            <span>{copy.completed(formatEventDate(item.completedAt))}</span>
          ) : item.dueDate ? (
            <span className={overdue ? "text-brand-dark" : ""}>{overdue ? copy.overdue(dueLabel(item.dueDate)) : copy.due(dueLabel(item.dueDate))}</span>
          ) : null}
          {session && <span>{copy.from(session.title, formatEventDate(session.startsAt), session.mentor.name)}</span>}
        </p>

        {item.mentorFiles.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-muted">{copy.mentorFiles}</p>
            <ul className="mt-1.5 grid gap-2 sm:grid-cols-2">
              {item.mentorFiles.map((file, index) => (
                <FileLink key={`${file.url}-${index}`} file={file} />
              ))}
            </ul>
          </div>
        )}

        {(item.myFiles.length > 0 || filesAllowed) && (
          <div className="mt-4">
            {item.myFiles.length > 0 && (
              <>
                <p className="text-xs text-muted">{copy.myFiles}</p>
                <ul className="mt-1.5 grid gap-2 sm:grid-cols-2">
                  {item.myFiles.map((file, index) => (
                    <FileLink
                      key={`${file.url}-${index}`}
                      file={file}
                      removeLabel={copy.removeFile(file.name)}
                      onRemove={() => void run("file", async () => ({ ...item, myFiles: await actionItemsService.detach(item, index) }))}
                    />
                  ))}
                </ul>
              </>
            )}
            {filesAllowed && (
              <>
                <button
                  type="button"
                  onClick={() => input.current?.click()}
                  disabled={busy !== null}
                  className="mt-2.5 inline-flex items-center gap-2 text-sm text-ink underline-offset-4 hover:underline disabled:text-muted"
                >
                  {busy === "file" ? (
                    <>
                      <Spinner />
                      {copy.uploading}
                    </>
                  ) : (
                    <>+ {copy.addFile}</>
                  )}
                </button>
                <input
                  ref={input}
                  type="file"
                  className="sr-only"
                  tabIndex={-1}
                  aria-hidden
                  onChange={(event) => {
                    onFile(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
              </>
            )}
          </div>
        )}
        {error && (
          <p className="mt-2 text-xs text-brand-dark" role="alert">
            {error}
          </p>
        )}
      </div>
    </article>
  );
}

// The Action items tab: open items first (soonest due first), then done ones.
export function ActionItems({ items, sessions, userId, filesAllowed, today, onChange }: { items: ActionItem[]; sessions: MySession[]; userId: string; filesAllowed: Map<string, boolean>; today: string; onChange: (item: ActionItem) => void }) {
  const byId = new Map(sessions.map((session) => [session.id, session]));
  const open = items.filter((item) => !item.done).sort((a, b) => (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999"));
  const done = items.filter((item) => item.done);
  const group = (title: string, list: ActionItem[]) =>
    list.length > 0 && (
      <section className="grid gap-4">
        <h2 className="text-sm text-ink-soft">
          {title} <span className="text-muted tabular-nums">· {list.length}</span>
        </h2>
        {list.map((item) => (
          <ItemCard key={item.id} item={item} session={byId.get(item.sessionId)} userId={userId} filesAllowed={filesAllowed.get(item.mentorId) ?? false} today={today} onChange={onChange} />
        ))}
      </section>
    );
  return (
    <div className="grid gap-8">
      <p className="max-w-[42rem] text-sm leading-relaxed text-ink-soft">{copy.intro}</p>
      {group(copy.open, open)}
      {group(copy.done, done)}
    </div>
  );
}
