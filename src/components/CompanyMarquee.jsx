"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

// Sample product data
const products = [
  { id: 1, image: "https://adplist.org/supporters/s1.svg" },
  { id: 2, image: "https://adplist.org/supporters/s2.svg" },
  { id: 3, image: "https://adplist.org/supporters/s3.svg" },
  { id: 4, image: "https://adplist.org/supporters/s4.svg" },
  { id: 5, image: "https://adplist.org/supporters/s5.svg" },
  { id: 6, image: "https://adplist.org/supporters/s6.svg" },
  { id: 7, image: "https://adplist.org/supporters/s7.svg" },
  { id: 8, image: "https://adplist.org/supporters/s8.svg" },
  { id: 9, image: "https://adplist.org/supporters/s9.svg" },
  { id: 10, image: "https://adplist.org/supporters/s10.svg" },
  { id: 11, image: "https://adplist.org/supporters/s11.svg" },
  { id: 12, image: "https://adplist.org/supporters/s12.svg" },
  { id: 13, image: "https://adplist.org/supporters/s13.svg" },
  { id: 14, image: "https://adplist.org/supporters/s14.svg" },
  { id: 15, image: "https://adplist.org/supporters/s15.svg" },
  { id: 16, image: "https://adplist.org/supporters/s16.svg" },
  { id: 17, image: "https://adplist.org/supporters/s17.svg" },
  { id: 18, image: "https://adplist.org/supporters/s18.svg" },
  { id: 19, image: "https://adplist.org/supporters/s19.svg" },
  { id: 20, image: "https://adplist.org/supporters/s20.svg" },
];

// Duplicate products for seamless scrolling
const duplicatedProducts = [...products, ...products];

export default function ProductMarquee() {
  const marqueeRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const marqueeElement = marqueeRef.current;
    const containerElement = containerRef.current;

    if (!marqueeElement || !containerElement) return;

    let animationId;
    let scrollPosition = 0;
    const scrollSpeed = 1; // Increased for smoother animation

    const scroll = () => {
      scrollPosition += scrollSpeed;
      if (scrollPosition >= containerElement.scrollWidth / 2) {
        scrollPosition = 0;
      }
      marqueeElement.style.transform = `translateX(-${scrollPosition}px)`;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, []);
 
  return (
    <div className="w-full py-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center ">
          Proven success with top organizations
        </h2>

        <div className="relative">
          <div ref={containerRef} className="overflow-hidden">
            <div ref={marqueeRef} className="flex items-center gap-8 md:gap-12">
              {duplicatedProducts.map((product, index) => (
                <div
                  key={`${product.id}-${index}`}
                  className="flex-shrink-0 w-[150px] sm:w-[180px] md:w-[200px] lg:w-[220px]"
                >
                  <div className="relative group transition-all duration-300 hover:scale-105">
                    <Image
                      src={product.image}
                      alt={`Partner ${product.id}`}
                      width={220}
                      height={220}
                      className="w-full h-auto object-contain transition-opacity duration-300"
                      style={{ background: "transparent" }}
                      priority={index < 8} // Prioritize loading for first set
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fade effects on edges */}
          <div className="absolute top-0 left-0 w-16 md:w-24 h-full bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-16 md:w-24 h-full bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .flex {
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
