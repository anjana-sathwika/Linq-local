"use client";

import { useEffect, useRef } from "react";

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "I really liked the Go Together Ride platform. Great idea for daily commuters.",
      instaLink: "https://www.instagram.com/p/DPlX7nzkaUs/",
    },
    {
      quote:
        "Thank you so much for helping me find a perfect lead with patience.",
      instaLink: "https://www.instagram.com/p/DPwCSIgiAZV/",
    },
    {
      quote:
        "Such a good initiative to save time and money. Really happy using it.",
      instaLink: "https://www.instagram.com/p/DPtdNCJkVgz/",
    },
    {
      quote:
        "Smooth experience and reliable coordination. Highly recommended.",
      instaLink: "https://www.instagram.com/p/DPQWyRDEQD6/",
    },
    {
      quote:
        "Safe rides and great vibes. Can’t wait to ride again!",
      instaLink: "https://www.instagram.com/p/DPN2noEkQaJ/",
    },
  ];

  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let x = 0;
    let raf: number;
    let paused = false;

    const speed = window.innerWidth < 640 ? 0.22 : 0.35;

    const animate = () => {
      if (!paused && rowRef.current) {
        const width = rowRef.current.scrollWidth / 2;

        x -= speed;
        if (Math.abs(x) >= width) x = 0;

        rowRef.current.style.transform = `translateX(${x}px)`;
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    const pause = () => (paused = true);
    const resume = () => (paused = false);

    rowRef.current?.addEventListener("mouseenter", pause);
    rowRef.current?.addEventListener("mouseleave", resume);
    rowRef.current?.addEventListener("touchstart", pause);
    rowRef.current?.addEventListener("touchend", resume);

    return () => cancelAnimationFrame(raf);
  }, []);

  const cards = [...testimonials, ...testimonials];

  return (
    <section className="py-20 md:py-28 bg-[#F7F9FF] overflow-hidden">
      <div className="text-center mb-12 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Loved by our community
        </h2>
        <p className="text-gray-500 mt-2">
          Real stories from LinQ commuters
        </p>
      </div>

      <div className="overflow-hidden">
        <div
          ref={rowRef}
          className="flex gap-5 md:gap-8 w-max will-change-transform px-4"
        >
          {cards.map((t, i) => (
            <a
              key={i}
              href={t.instaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="
                min-w-[240px] sm:min-w-[280px] md:min-w-[320px]
                bg-white rounded-3xl p-6 md:p-7
                border border-gray-200
                shadow-sm hover:shadow-xl
                transition-all duration-300
              "
            >
              {/* icon */}
              <div className="flex justify-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">IG</span>
                </div>
              </div>

              {/* TEXT → forced 2-3 lines */}
              <p className="
                text-gray-700 text-center
                text-sm md:text-base
                leading-relaxed
                max-w-[220px] md:max-w-[260px]
                mx-auto
              ">
                “{t.quote}”
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
