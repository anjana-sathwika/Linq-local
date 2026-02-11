"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

function CountUp({ end, start }: { end: number; start: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let current = 0;
    const duration = 1600;
    const step = 20;
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
    title: "Precision Route Matching",
    desc: "Match with commuters who travel your exact route and schedule.",
  },
  {
    title: "Transparent Cost Sharing",
    desc: "Fair distance-based splits with zero surge pricing or hidden fees.",
  },
  {
    title: "Verified Community",
    desc: "Profiles, trust scores, and reviews ensure safe shared rides.",
  },
  {
    title: "Eco-Conscious Travel",
    desc: "Reduce congestion and carbon emissions every commute.",
  },
];

export default function WhyLinq() {
  const [active, setActive] = useState(0);
  const [startCount, setStartCount] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // start number animation only when section visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setStartCount(true);
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // auto highlight cards
  useEffect(() => {
    const i = setInterval(() => {
      setActive((p) => (p + 1) % cards.length);
    }, 2500);
    return () => clearInterval(i);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-24 px-6 bg-[#F7F9FF]"
    >
      <div className="max-w-7xl mx-auto text-center">

        {/* HEADING */}
        <h2 className="text-4xl md:text-5xl font-semibold mb-6">
          Smarter Commutes.
          <span className="text-[#2F5EEA]"> Built on Community.</span>
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto mb-16">
          LinQ connects commuters on the same routes to share rides,
          reduce costs and travel responsibly through a trusted network.
        </p>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-10 rounded-3xl shadow-md">
            <h3 className="text-3xl font-bold text-[#2F5EEA]">
              <CountUp end={34000} start={startCount} />+
            </h3>
            <p className="text-gray-600 mt-2">Trusted commuters</p>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-md">
            <h3 className="text-3xl font-bold text-[#2F5EEA]">
              <CountUp end={8000} start={startCount} />+
            </h3>
            <p className="text-gray-600 mt-2">Daily active users</p>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-md">
            <h3 className="text-3xl font-bold text-[#2F5EEA]">
              4.8★
            </h3>
            <p className="text-gray-600 mt-2">Average rating</p>
          </div>
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`p-10 rounded-3xl bg-white border transition-all duration-500 shadow-md
              ${
                active === i
                  ? "border-[#2F5EEA] shadow-[0_20px_60px_rgba(47,94,234,0.25)] scale-[1.02]"
                  : "border-gray-200"
              }`}
            >
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {card.title}
              </h3>
              <p className="text-gray-600">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* CAREERS CTA (NO CONFETTI) */}
        <div className="text-center py-16 px-6 bg-[#2F5EEA] text-white rounded-3xl shadow-lg">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              We are Expanding Our Family!
            </h2>

            <p className="text-lg mb-8 text-white/90">
              Join the passionate LinQ team shaping smarter travel.
            </p>

            <Link href="https://docs.google.com/forms/d/e/1FAIpQLScCsaBXeMS_FCF_LIyGpQsWoagHuDv-FWoSEa_ul5dRpem1Qw/viewform">
              <button className="bg-white text-[#2F5EEA] px-10 py-4 rounded-full font-semibold shadow-md hover:bg-gray-50 transition">
                Apply Now
              </button>
            </Link>

            <p className="mt-6 text-sm text-white/80">
              Exciting roles. Real impact. ✨
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
