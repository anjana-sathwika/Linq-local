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

  // morph switch
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-6 bg-white pt-28 overflow-hidden">

      {/* ===== BACKGROUND CHAT IMAGES ===== */}
      <div className="absolute inset-0 z-0 pointer-events-none">

        <img
          src="/chat1.jpeg"
          className="absolute left-6 top-40 w-[260px] opacity-40 rotate-[-8deg] shadow-xl"
        />

        <img
          src="/chat2.jpeg"
          className="absolute left-10 bottom-24 w-[260px] opacity-40 rotate-[6deg] shadow-xl"
        />

        <img
          src="/chat3.jpeg"
          className="absolute right-10 top-44 w-[260px] opacity-40 rotate-[8deg] shadow-xl"
        />

        <img
          src="/chat4.jpeg"
          className="absolute right-10 bottom-24 w-[260px] opacity-40 rotate-[-6deg] shadow-xl"
        />
      </div>

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl">

        <p className="text-sm font-semibold tracking-wide text-[#2F5EEA] uppercase mb-6">
          Telangana’s No.1 Ride Sharing Community
        </p>

        {/* TEXT MORPH */}
        <div className="h-[110px] flex items-center justify-center mb-6">
          <h1
            key={index}
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-gray-900 transition-all duration-700"
          >
            {texts[index]}
          </h1>
        </div>

        {/* BIG COUNT */}
        <div className="mt-6 mb-6">
          <div className="text-6xl md:text-8xl font-extrabold text-[#2F5EEA]">
            {count.toLocaleString()}+
          </div>
          <p className="text-gray-600 text-lg mt-3">
            people already riding smarter across Telangana
          </p>
        </div>

        {/* BUTTON */}
        <div className="mt-6">
          <a href="#search">
            <button className="bg-[#2F5EEA] text-white font-semibold px-10 py-4 rounded-full hover:bg-[#1E3FAE] transition text-lg shadow-md hover:shadow-lg">
              Find a Ride partner 
            </button>
          </a>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Free to join • Verified users • No commission • No app needed
        </p>

      </div>
    </section>
  );
}
