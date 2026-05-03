"use client";

import { useEffect, useRef, useState } from "react";

function CountUp({ end, start }: { end: number; start: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let current = 0;
    const duration = 1400;
    const step = 16;
    const increment = end / (duration / step);

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, step);

    return () => clearInterval(timer);
  }, [start, end]);

  return <span>{count.toLocaleString()}</span>;
}

const cards = [
  {
    title: "Smart Route Overlap",
    desc: "No exact same pickup needed. We match overlapping routes automatically.",
  },
  {
    title: "Fair Cost Splitting",
    desc: "Share fuel costs fairly based on distance. No surge pricing.",
  },
  {
    title: "Verified Commuters",
    desc: "All users verified with ratings and reviews for safe daily travel.",
  },
  {
    title: "Daily Savings",
    desc: "Save 40-60% on commute costs while reducing traffic.",
  },
];

export default function WhyLinq() {
  const [active, setActive] = useState(0);
  const [startCount, setStartCount] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // FIXED MOBILE OBSERVER
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStartCount(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -80px 0px", // helps mobile trigger earlier
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // auto highlight cards
  useEffect(() => {
    const i = setInterval(() => {
      setActive((p) => (p + 1) % cards.length);
    }, 2400);
    return () => clearInterval(i);
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-20 md:py-24 px-4 bg-[#F7F9FF]">
      <div className="max-w-7xl mx-auto text-center">

        {/* HEADING */}
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold mb-3 leading-tight px-2 text-black">
          Link Your Commute.
          <span className="text-[#2F5EEA] block sm:inline"> {" "}Split Your Costs.</span>
        </h2>

        <p className="text-gray-600 max-w-xl mx-auto mb-10 md:mb-14 text-sm md:text-base px-4">
          LinQ finds people traveling on overlapping daily routes.
          No exact same pickup needed. Just smart matching for shared savings.
        </p>

        {/* ===== STATS ROW (MOBILE FIXED) ===== */}
        <div className="flex justify-between gap-3 md:gap-8 mb-16">

          <div className="flex-1 bg-white py-6 md:py-10 rounded-2xl md:rounded-3xl shadow-sm">
            <h3 className="text-xl md:text-3xl font-bold text-[#2F5EEA]">
              <CountUp end={34000} start={startCount} />+
            </h3>
            <p className="text-gray-600 text-xs md:text-sm mt-1">
              Commuters
            </p>
          </div>

          <div className="flex-1 bg-white py-6 md:py-10 rounded-2xl md:rounded-3xl shadow-sm">
            <h3 className="text-xl md:text-3xl font-bold text-[#2F5EEA]">
              <CountUp end={8000} start={startCount} />+
            </h3>
            <p className="text-gray-600 text-xs md:text-sm mt-1">
              Daily users
            </p>
          </div>

          <div className="flex-1 bg-white py-6 md:py-10 rounded-2xl md:rounded-3xl shadow-sm">
            <h3 className="text-xl md:text-3xl font-bold text-[#2F5EEA]">
              4.8★
            </h3>
            <p className="text-gray-600 text-xs md:text-sm mt-1">
              Rating
            </p>
          </div>

        </div>

        {/* ===== FEATURE CARDS ===== */}
        <div className="grid md:grid-cols-2 gap-5 md:gap-8 mb-20">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`p-6 md:p-10 rounded-3xl bg-white border transition-all duration-500 shadow-sm
              ${
                active === i
                  ? "border-[#2F5EEA] shadow-[0_20px_60px_rgba(47,94,234,0.25)] scale-[1.02]"
                  : "border-gray-200"
              }`}
            >
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-gray-900">
                {card.title}
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
