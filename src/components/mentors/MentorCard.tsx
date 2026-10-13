import Image from "next/image";
import type { ReactNode } from "react";
import Link from "next/link";
import { prefetchFor } from "@/lib/routes";
import type { Mentor } from "@/data/mentors";

type MentorCardProps = {
  mentor: Mentor;
  href?: string;
  action?: ReactNode;
  bordered?: boolean;
};

export function MentorCard({ mentor, href = "/mentors", action, bordered = false }: MentorCardProps) {
  return (
    <article className="group relative flex h-full flex-col gap-2">
      <div className="relative aspect-[433/377] overflow-hidden">
        <Image
          src={mentor.photo.src}
          alt={mentor.name}
          fill
          sizes="(min-width: 768px) 27rem, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-[0.4rem] bg-black/45 px-2.5 py-1.5 text-sm whitespace-nowrap text-white backdrop-blur-md md:max-w-[calc(100%-1.5rem)] md:text-xs lg:bottom-4 lg:left-4 lg:px-3 lg:text-sm">
          <svg viewBox="0 0 24 24" className="size-3.5 fill-badge" aria-hidden>
            <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7.3L12 17.8 5.7 21.5l1.7-7.3L2 9.5l7.1-.6L12 2z" />
          </svg>
          <span>
            <strong className="font-bold">{mentor.experience}</strong>, {mentor.focus}
          </span>
        </span>
      </div>
      <div className={`flex-1 bg-white p-4 ${bordered ? "border border-line" : ""}`}>
        <h3 className="text-xl font-medium text-ink lg:text-2xl">
          <Link href={href} prefetch={prefetchFor(href)} className="after:absolute after:inset-0 hover:underline hover:underline-offset-4">
            {mentor.name}
          </Link>
        </h3>
        <p className="mt-1.5 text-sm text-ink/85 lg:text-base">{mentor.role}</p>
        {action && <div className="relative z-10 mt-[1.125rem]">{action}</div>}
      </div>
    </article>
  );
}
