"use client";

import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

export function CareerPathway() {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isMobile = useMobile();

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < maxScroll - 1);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Handle mouse wheel
    const handleWheel = (e) => {
      e.preventDefault();
      const scrollAmount = e.deltaY * 0.5; // Reduced sensitivity
      container.scrollTo({
        left: container.scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    };

    // Handle touch scrolling
    let touchStartX = 0;
    let scrollStartX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      scrollStartX = container.scrollLeft;
    };

    const handleTouchMove = (e) => {
      const touchX = e.touches[0].clientX;
      const deltaX = touchStartX - touchX;
      container.scrollLeft = scrollStartX + deltaX;
      e.preventDefault();
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("scroll", checkScrollPosition, {
      passive: true,
    });

    // Initial check
    checkScrollPosition();

    // Resize observer to update scroll state on window resize
    const resizeObserver = new ResizeObserver(checkScrollPosition);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("scroll", checkScrollPosition);
      resizeObserver.disconnect();
    };
  }, []);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of container width
    container.scrollTo({
      left:
        container.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount),
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-full max-w-7xl px-4">
        <div className="flex justify-between items-center mb-6 w-full">
          <div className="bg-[#c3f27e] text-[#1e4d28] font-semibold px-4 py-2 rounded-full">
            Programs & Services
          </div>
          {!isMobile && (
            <div className="bg-[#c3f27e] text-[#1e4d28] font-semibold px-4 py-2 rounded-full">
              Programs & Services
            </div>
          )}
        </div>

        <div className="relative w-full">
          <Button
            variant="outline"
            size="icon"
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#c3f27e] text-[#1e4d28] border-[#c3f27e] hover:bg-[#a6d968] transition-opacity ${
              !canScrollLeft ? "opacity-50 cursor-not-allowed" : "opacity-100"
            }`}
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
              overscrollBehaviorX: "contain",
            }}
          >
            <div className="flex gap-4" style={{ padding: "0 1rem" }}>
              <PathwayStep
                number="1.0"
                title="Freshmen Year"
                subtitle="Mentorship and Career Pathways Exposure"
                items={[
                  "Support from senior mentors...",
                  "Guide students in making academic decisions",
                ]}
              />
              <PathwayConnector />
              <PathwayStep
                number="2.0"
                title="Sophomore & Junior Years"
                subtitle="Cohort Experience..."
                items={[
                  "Develop soft skills",
                  "Career-specific learning conversations",
                ]}
              />
              <PathwayConnector />
              <PathwayStep
                number="3.0"
                title="Senior Year"
                subtitle="Job Search Support..."
                items={[
                  "Work toward full-time position",
                  "Industry-specific hard skills",
                ]}
              />
              <PathwayConnector />
              <PathwayStep
                number="4.0"
                title="Early Years Post-Graduation"
                subtitle="On-The-Job Support"
                items={["Post-graduation mentorship", "Cohort engagement"]}
                isLast
              />
              {/* Add more PathwaySteps as needed */}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#c3f27e] text-[#1e4d28] border-[#c3f27e] hover:bg-[#a6d968] transition-opacity ${
              !canScrollRight ? "opacity-50 cursor-not-allowed" : "opacity-100"
            }`}
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function PathwayStep({ number, title, subtitle, items, isLast = false }) {
  return (
    <div className="snap-start flex-shrink-0 w-[300px]">
      <div className="flex flex-col">
        <div className="bg-[#c3f27e] text-[#1e4d28] font-bold rounded-full w-10 h-10 flex items-center justify-center mb-2 z-10">
          {number}
        </div>
        <div className="bg-[#e8ffc2] text-[#1e4d28] rounded-lg p-4 h-full">
          <h3 className="font-semibold text-sm">{title}</h3>
          <h2 className="font-bold text-lg mb-3">{subtitle}</h2>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-[#1e4d28] mt-1">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function PathwayConnector() {
  return (
    <div className="flex-shrink-0 flex items-center self-start mt-5 border-dashed border-t-2 border-[#c3f27e] w-8"></div>
  );
}
