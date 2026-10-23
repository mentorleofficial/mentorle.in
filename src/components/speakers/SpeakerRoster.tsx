import { MentorCard } from "@/components/mentors/MentorCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { speakerHubPage, speakerRequestHref, speakers } from "@/data/speakers";

export function SpeakerRoster() {
  const { requestLabel, customRequest } = speakerHubPage;

  return (
    <section aria-label="Speakers" className="bg-dots py-16 md:py-24 lg:py-[8.125rem]">
      <div className="container-page">
        <div data-animate="stagger" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {speakers.map((speaker) => (
            <MentorCard
              key={speaker.slug}
              mentor={speaker}
              href={speakerRequestHref(speaker.slug)}
              bordered
              action={
                <ButtonLink href={speakerRequestHref(speaker.slug)} variant="dark" className="w-full">
                  {requestLabel}
                  <span className="sr-only"> with {speaker.name}</span>
                </ButtonLink>
              }
            />
          ))}

          <aside
            aria-labelledby="custom-speaker-title"
            className="flex min-h-[22rem] flex-col items-center justify-center bg-brand bg-[radial-gradient(85%_70%_at_50%_62%,#ef875f_0%,transparent_75%),linear-gradient(170deg,#e8521e_0%,#ef6c3d_38%,#ea7a54_100%)] px-8 pt-11 pb-8 text-center text-white md:col-span-2 lg:col-span-1"
          >
            <h2 id="custom-speaker-title" className="max-w-[15rem] text-[2rem] leading-[1.35] font-medium">
              {customRequest.title}
            </h2>
            <p className="mt-3 max-w-[19.75rem] text-base leading-[1.45] text-white/95">{customRequest.description}</p>
            <ButtonLink href={speakerRequestHref()} variant="light" className="mt-6">
              {customRequest.cta}
            </ButtonLink>
          </aside>
        </div>
      </div>
    </section>
  );
}
