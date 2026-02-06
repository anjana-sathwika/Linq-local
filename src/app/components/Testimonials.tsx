"use client";

import { useEffect, useRef } from "react";

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "I really liked the Go Together Ride platform - it's a great idea for connecting riders and people who need transport.",
      instaLink: "https://www.instagram.com/p/DPlX7nzkaUs/",
    },
    {
      quote:
        "Thank you so much for helping me out till I find a perfect lead. You guys are really patient and supportive.",
      instaLink: "https://www.instagram.com/p/DPwCSIgiAZV/",
    },
    {
      quote:
        "Such a good initiative to save time and money. I felt very happy using Go Together rides.",
      instaLink: "https://www.instagram.com/p/DPtdNCJkVgz/",
    },
    {
      quote:
        "Smooth experience and reliable coordination. This platform makes finding partners easy.",
      instaLink: "https://www.instagram.com/p/DPQWyRDEQD6/",
    },
    {
      quote:
        "Safe rides, great vibes, and lots of memories made. Can't wait to ride again!",
      instaLink: "https://www.instagram.com/p/DPN2noEkQaJ/",
    },
  ];

  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let x1 = 0;
    let x2 = 0;
    const speed = 0.3; // 🔥 CONTROL SPEED HERE

    const animate = () => {
      x1 -= speed;
      x2 += speed;

      if (row1Ref.current) {
        row1Ref.current.style.transform = `translateX(${x1}px)`;
      }
      if (row2Ref.current) {
        row2Ref.current.style.transform = `translateX(${x2}px)`;
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <section className="bg-white py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <h3 className="text-3xl font-extrabold text-gray-800">
            What our community says
          </h3>
          <p className="text-gray-500 mt-2">
            Real stories from riders across LinQ
          </p>
        </div>
      </div>

      {/* Row 1 */}
      <div className="overflow-hidden mb-8">
        <div ref={row1Ref} className="flex gap-6 w-max">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div
              key={`row1-${i}`}
              className="min-w-[280px] sm:min-w-[360px] bg-white border rounded-2xl p-6 shadow-sm"
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
                    v
