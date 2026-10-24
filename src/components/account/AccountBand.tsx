// Header for signed-in pages (My sessions, Account): the legal pages' dark band (no photo), clearing the header.
export function AccountBand({ id, eyebrow, title, subtitle }: { id: string; eyebrow: string; title: string; subtitle: string }) {
  return (
    <section aria-labelledby={id} className="bg-ink text-white">
      <div className="container-page pt-28 pb-12 md:pt-[10.5rem] md:pb-16 xl:pt-[12.125rem]">
        <p data-hero="1" className="text-sm tracking-[0.06em] text-white/75 uppercase">
          {eyebrow}
        </p>
        <h1 id={id} data-hero="2" className="mt-4 max-w-[48rem] text-[2.125rem] leading-[1.18] font-medium tracking-[-0.01em] md:text-5xl">
          {title}
        </h1>
        <p data-hero="3" className="mt-5 max-w-[42rem] text-base leading-snug text-white/90 md:text-lg">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
