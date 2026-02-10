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
    let x1 = 0;
    let x2 = 0;
    const speed = 0.4;
    let rafId: number;

    const animate = () => {
      if (row1Ref.current && row2Ref.current) {
        const rowWidth = row1Ref.current.scrollWidth / 2;

        x1 -= speed;
        x2 += speed;

        if (Math.abs(x1) >= rowWidth) x1 = 0;
        if (x2 >= rowWidth) x2 = 0;

        row1Ref.current.style.transform = `translateX(${x1}px)`;
        row2Ref.current.style.transform = `translateX(${x2}px)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const renderCards = () =>
    [...testimonials, ...testimonials].map((t, i) => (
      <div
        key={i}
        className="min-w-[280px] sm:min-w-[360px] bg-white border rounded-2xl p-6 shadow-md hover:shadow-lg transition"
      >
        {/* Insta icon */}
        <a
          href={t.instaLink}
          target="_blank"
          rel="noreferrer"
          className="flex justify-center mb-4"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zM12 7a5 5 0 100 10 5 5 0 000-10zm5.25-1.5a.75.75 0 110 1.5.75.75 0 010-1.5z" />
            </svg>
          </div>
        </a>

        <p className="text-gray-700 text-sm leading-relaxed text-center">
          “{t.quote}”
        </p>
      </div>
    ));

  return (
    <section className="bg-white py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center mb-14">
        <h3 className="text-3xl md:text-4xl font-extrabold text-gray-800">
          What our community says
        </h3>
        <p className="text-gray-500 mt-3">
          Real stories from riders across LinQ
        </p>
      </div>

      {/* Row 1 */}
      <div className="overflow-hidden mb-8">
        <div
          ref={row1Ref}
          className="flex gap-6 w-max will-change-transform"
        >
          {renderCards()}
        </div>
      </div>

      {/* Row 2 */}
      <div className="overflow-hidden">
        <div
          ref={row2Ref}
          className="flex gap-6 w-max will-change-transform"
        >
          {renderCards()}
        </div>
      </div>
    </section>
  );
}
