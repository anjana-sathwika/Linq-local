"use client";

import { useEffect, useRef, useState } from "react";

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "I really liked the Go Together Ride platform - it's a great idea for connecting riders and people who need transport. The response is quick, and they help find matching leads fast. The team communicates clearly and is very supportive.",
      instaLink: "https://www.instagram.com/p/DPlX7nzkaUs/?igsh=cTU2ZXRoN3ppZzQ3",
    },
    {
      quote:
        "Thank you so much for helping me out till I find a perfect lead. You guys are really spending time and finding the exact match with patience.",
      instaLink: "https://www.instagram.com/p/DPwCSIgiAZV/?igsh=MTExdWk1ZDdpODd5cw==",
    },
    {
      quote:
        "While using instagram I found Go Together rides. Such a good initiative to save time and money.",
      instaLink: "https://www.instagram.com/p/DPtdNCJkVgz/?igsh=dnFpejc1MGFvbXR2",
    },
    {
      quote:
        "I got a wonderful partner through Go Together. Smooth experience and reliable coordination.",
      instaLink: "https://www.instagram.com/p/DPQWyRDEQD6/?igsh=N282bWJyOW1sNDN4",
    },
    {
      quote:
        "Had an amazing experience with Go Together Riders. Safe rides and great vibes!",
      instaLink: "https://www.instagram.com/p/DPN2noEkQaJ/?igsh=dnFlNzZ5YnRxejJs",
    },
  ];

  const trackRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const delta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;

      setOffset((prev) => prev - delta * 0.35); // 🔥 velocity control
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="bg-white py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-extrabold text-gray-800">
            What our community says
          </h3>
          <p className="text-gray-500 mt-2">
            Real stories from riders across LinQ <br />
            Click Instagram icon to view testimonials
          </p>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-6 w-max will-change-transform"
          style={{ transform: `translateX(${offset}px)` }}
        >
          {[...testimonials, ...testimonials].map((t, i) => (
            <div
              key={i}
              className="min-w-[300px] sm:min-w-[360px] bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <a
                href={t.instaLink}
                target="_blank"
                rel="noreferrer"
                className="flex justify-center mb-4"
              >
                <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-[#E1306C]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2z" />
                  </svg>
                </div>
              </a>

              <p className="text-gray-700 text-sm leading-relaxed">
                “{t.quote}”
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
