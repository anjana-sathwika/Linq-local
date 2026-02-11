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

  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    let x1 = 0;
    let x2 = 0;
    const speed = 0.25;
    let raf: number;
    let paused = false;

    const animate = () => {
      if (!paused && row1Ref.current && row2Ref.current) {
        const width = row1Ref.current.scrollWidth / 2;

        x1 -= speed;
        x2 += speed;

        if (Math.abs(x1) >= width) x1 = 0;
        if (x2 >= width) x2 = 0;

        row1Ref.current.style.transform = `translateX(${x1}px)`;
        row2Ref.current.style.transform = `translateX(${x2}px)`;
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    const pause = () => (paused = true);
    const resume = () => (paused = false);

    const r1 = row1Ref.current;
    const r2 = row2Ref.current;

    r1?.addEventListener("mouseenter", pause);
    r1?.addEventListener("mouseleave", resume);
    r2?.addEventListener("mouseenter", pause);
    r2?.addEventListener("mouseleave", resume);

    r1?.addEventListener("touchstart", pause);
    r2?.addEventListener("touchstart", pause);
    r1?.addEventListener("touchend", resume);
    r2?.addEventListener("touchend", resume);

    return () => cancelAnimationFrame(raf);
  }, []);

  const renderCards = (arr: typeof testimonials) =>
    [...arr, ...arr].map((t, i) => (
      <a
        key={i}
        href={t.instaLink}
        target="_blank"
        rel="noopener noreferrer"
        className="
          min-w-[260px] sm:min-w-[320px] md:min-w-[360px]
          bg-white border border-gray-200
          rounded-3xl p-6 md:p-7
          shadow-sm hover:shadow-xl
          transition-all duration-300
        "
      >
        {/* Insta icon */}
        <div className="flex justify-center mb-5">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm4.25 5a5 5 0 100 10 5 5 0 000-10zm5.25-1.5a.75.75 0 110 1.5.75.75 0 010-1.5z"/>
            </svg>
          </div>
        </div>

        <p className="text-gray-700 text-center text-sm md:text-base leading-relaxed">
          “{t.quote}”
        </p>
      </a>
    ));

  const reversed = [...testimonials].reverse();

  return (
    <section className="py-24 md:py-28 bg-white overflow-hidden">
      <div className="text-center mb-14 px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          What our riders say
        </h2>
        <p className="text-gray-500 mt-3">
          Real feedback from our growing community
        </p>
      </div>

      {/* ROW 1 */}
      <div className="overflow-hidden mb-8">
        <div
          ref={row1Ref}
          className="flex gap-6 md:gap-8 w-max will-change-transform"
        >
          {renderCards(testimonials)}
        </div>
      </div>

      {/* ROW 2 */}
      <div className="overflow-hidden">
        <div
          ref={row2Ref}
          className="flex gap-6 md:gap-8 w-max will-change-transform"
        >
          {renderCards(reversed)}
        </div>
      </div>
    </section>
  );
}
