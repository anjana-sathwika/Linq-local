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

  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let x = 0;
    const speed = 0.35;
    let raf: number;

    const animate = () => {
      if (trackRef.current) {
        const width = trackRef.current.scrollWidth / 2;
        x -= speed;

        if (Math.abs(x) >= width) x = 0;

        trackRef.current.style.transform = `translateX(${x}px)`;
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const cards = [...testimonials, ...testimonials];

  return (
    <section className="py-28 bg-white overflow-hidden">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Loved by our riders
        </h2>
        <p className="text-gray-500 mt-3">
          Real feedback from our growing community
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-8 w-max items-center will-change-transform"
        >
          {cards.map((t, i) => (
            <div
              key={i}
              className="group relative min-w-[280px] sm:min-w-[360px]"
            >
              {/* card */}
              <div className="bg-white border rounded-3xl p-7 shadow-lg transition-all duration-500 group-hover:scale-105">

                {/* insta */}
                <a
                  href={t.instaLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex justify-center mb-5"
                >
                  <div className="w-11 h-11 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center shadow-md">
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

                <p className="text-gray-700 text-center leading-relaxed">
                  “{t.quote}”
                </p>
              </div>

              {/* glow */}
              <div className="absolute inset-0 rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 bg-blue-400 transition"></div>
            </div>
          ))}
        </div>

        {/* center fade mask */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent"></div>
      </div>
    </section>
  );
}
