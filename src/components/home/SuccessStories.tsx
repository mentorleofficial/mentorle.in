import { SectionHeader } from "@/components/ui/SectionHeader";
import { SuccessStoriesCarousel } from "@/components/home/SuccessStoriesCarousel";
import { successStories } from "@/data/home";

export function SuccessStories() {
  return (
    <section aria-labelledby="success-title" className="overflow-hidden bg-dots py-16 md:py-24 lg:py-[8.125rem]">
      <div className="container-page">
        <SectionHeader
          id="success-title"
          eyebrow="Success Stories"
          title="Proof of Work"
          description="Read how Mentorle has helped thousands of students and builders land their dream roles."
        />
      </div>
      <div data-animate="fade-up" className="mt-12 md:mt-[5rem]">
        <SuccessStoriesCarousel stories={successStories} />
      </div>
    </section>
  );
}
