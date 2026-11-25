import type { ReactNode } from "react";

// The dark screen for "page not found" and errors: eyebrow with the brand square, a large title, a short line, then
// actions, centred so it reads as one block at every width. It's only as tall as its content on phones and tablets
// (padding clears the overlaid header); on desktops it fills the screen, capped so very tall screens don't strand it.
export function StatusScreen({ eyebrow, title, body, children, footer }: { eyebrow: string; title: string; body: string; children?: ReactNode; footer?: ReactNode }) {
  return (
    <section aria-labelledby="status-title" className="bg-ink text-white">
      <div className="container-page flex flex-col items-center pt-32 pb-16 text-center sm:pt-44 sm:pb-20 lg:min-h-[min(100svh,56rem)] lg:justify-center lg:pt-52 lg:pb-24">
        <p className="flex items-center gap-3 text-sm tracking-[0.12em] text-white/75 uppercase">
          <span className="size-2.5 bg-brand" aria-hidden />
          {eyebrow}
        </p>
        <h1 id="status-title" className="mt-5 max-w-[44rem] text-[2.25rem] leading-[1.08] font-medium tracking-[-0.02em] text-balance sm:text-[3rem] lg:text-[4rem]">
          {title}
        </h1>
        <p className="mt-5 max-w-[34rem] text-base leading-snug text-pretty text-white/80 md:text-lg">{body}</p>
        {children && <div className="mt-9 flex w-full max-w-[20rem] flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:justify-center [&>*]:w-full sm:[&>*]:w-auto">{children}</div>}
        {footer && <div className="mt-9 text-sm text-white/70">{footer}</div>}
      </div>
    </section>
  );
}
