"use client";

import { useEffect, useState } from "react";

export default function Hero() {
  const startNumber = 28000;
  const endNumber = 35000;
  const duration = 1500;

  const [count, setCount] = useState(startNumber);
  const [index, setIndex] = useState(0);

  const texts = [
    "Turning Empty Seats Into Shared Journeys.",
    "ఖాళీ సీట్లను ప్రయాణాలుగా మార్చే చిన్న ప్రయత్నం..",
  ];

  // counter animation
  useEffect(() => {
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      const percent = Math.min(progress / duration, 1);
      const current = Math.floor(
        startNumber + (endNumber - startNumber) * percent
      );

      setCount(current);

      if (percent < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, []);

  // morph text switch
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-6 bg-white pt-24 overflow-hidden">

      {/* BACKGROUND CHAT IMAGES */}
      <div className="absolute inset-0 pointer-events-none">

        <img
          src="/chat1.jpeg"
          className="hidden md:block absolute left-10 top-32 w-[260px] opacity-30 blur-sm rotate-[-8deg]"
        />

        <img
          src="/chat2.jpeg"
          className="hidden md:block absolute left-10 bottom-20 w-[260px] opacity-30 blur-sm rotate-[6deg]"
        />

        <img
          src="/chat3.jpeg"
          className="hidden md:block absolute right-10 top-40 w-[260px] opacity-30 blur-sm rotate-[8deg]"
        />

        <img
          src="/chat4.jpeg"
          className="hidden md:block absolute right-10 bottom-20 w-[260px] opacity-30 blur-sm rotate-[-6deg]"
        />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center">

        <p className="text-sm font-semibold tracking-wide text-[#2F5EEA] uppercase mb-3">
          Telangana’s No.1 Ride Sharing Community
        </p>

        {/* TEXT MORPH */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold max-w-3xl leading-tight text-gray-900 h-[90px] flex items-center justify-center">
          <span
            key={index}
            className="transition-all duration-700 ease-in-out opacity-0 animate-fadeIn"
          >
            {texts[index]}
          </span>
        </h1>

        {/* BIG COUNT */}
        <div className="mt-8 flex flex-col items-center">
          <div className="text-5xl md:text-7xl font-extrabold text-[#2F5EEA]">
            {count.toLocaleString()}+
          </div>
          <p className="text-gray-600 mt-2 text-lg">
            people already riding smarter across Telangana
          </p>
        </div>

        {/* BUTTON */}
        <div className="mt-10">
          <a href="#search">
            <button className="bg-[#2F5EEA] text-white font-semibold px-10 py-4 rounded-full hover:bg-[#1E3FAE] transition text-lg shadow-md hover:shadow-lg">
              Find a Ride 🚗
            </button>
          </a>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Free to join • Verified users • No commission • No app needed
        </p>

      </div>

      {/* animation style */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.7s forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
            filter: blur(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
      `}</style>
    </section>
  );
}
