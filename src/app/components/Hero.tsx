"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Hero() {
  const startNumber = 28000;
  const endNumber = 35000;
  const duration = 1500;

  const [count, setCount] = useState(startNumber);

  const texts = [
    "Turning Empty Seats Into Shared Journeys.",
    "ఖాళీ సీట్లు… కలిసి ప్రయాణం",
  ];

  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let startTime: number | null = null;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      const percentage = Math.min(progress / duration, 1);
      const current = Math.floor(
        startNumber + (endNumber - startNumber) * percentage
      );

      setCount(current);

      if (percentage < 1) requestAnimationFrame(animateCount);
    };

    requestAnimationFrame(animateCount);
  }, []);

  useEffect(() => {
    const currentText = texts[textIndex];
    const typingSpeed = isDeleting ? 17 : 70;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentText.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);

        if (charIndex + 1 === currentText.length) {
          setTimeout(() => setIsDeleting(true), 700);
        }
      } else {
        setDisplayText(currentText.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);

        if (charIndex === 0) {
          setIsDeleting(false);
          setTextIndex((textIndex + 1) % texts.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex]);

  return (
    <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-6 bg-white pt-24 overflow-hidden">

      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,233,255,0.06),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(0,230,118,0.06),transparent_40%)] pointer-events-none"></div>

      {/* 💬 CHAT BACKGROUND IMAGES */}
      <div className="absolute inset-0 pointer-events-none">

        <img
          src="/chat1.jpeg"
          className="hidden md:block absolute left-[-60px] top-[140px] w-[230px] opacity-10 blur-lg rotate-[-8deg]"
        />

        <img
          src="/chat2.jpeg"
          className="hidden md:block absolute left-[40px] bottom-[80px] w-[240px] opacity-10 blur-lg rotate-[6deg]"
        />

        <img
          src="/chat3.jpeg"
          className="hidden md:block absolute right-[60px] top-[200px] w-[240px] opacity-10 blur-lg rotate-[8deg]"
        />

        <img
          src="/chat4.jpeg"
          className="hidden md:block absolute right-[-40px] bottom-[60px] w-[220px] opacity-10 blur-lg rotate-[-6deg]"
        />
      </div>

      {/* HERO CONTENT */}
      <div className="relative z-10 flex flex-col items-center">

        <p className="text-sm font-semibold tracking-wide text-[#2F5EEA] uppercase mb-3">
          Telangana’s No.1 Ride Sharing Community
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold max-w-3xl leading-tight text-gray-900">
          {displayText}
          <span className="animate-pulse">|</span>
        </h1>

        <p className="mt-6 text-gray-600 max-w-xl text-lg">
          For daily commuters heading the same way across Telangana.
          <br />
          Already{" "}
          <span className="text-[#2F5EEA] font-semibold">
            {count.toLocaleString()}+
          </span>{" "}
          people are riding smarter every day.
        </p>

        {/* SCROLL BUTTON */}
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
    </section>
  );
}
