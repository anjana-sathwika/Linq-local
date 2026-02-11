"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface NavbarProps {
  refs: {
    home: React.RefObject<HTMLDivElement | null>;
    features: React.RefObject<HTMLDivElement | null>;
    footer: React.RefObject<HTMLDivElement | null>;
  };
}

export default function Navbar({ refs }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white shadow-md border-b border-gray-200"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-10 py-3">

        {/* LOGO */}
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="LinQ Logo"
            width={140}
            height={32}
            className="h-7 md:h-8 w-auto"
            priority
          />
        </div>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex gap-10 font-medium text-gray-700">
          <li
            className="hover:text-[#2F5EEA] cursor-pointer transition"
            onClick={() => scrollToSection(refs.home)}
          >
            Home
          </li>

          <li
            className="hover:text-[#2F5EEA] cursor-pointer transition"
            onClick={() => scrollToSection(refs.features)}
          >
            Features
          </li>

          <li
            className="hover:text-[#2F5EEA] cursor-pointer transition"
            onClick={() => scrollToSection(refs.footer)}
          >
            Careers
          </li>
        </ul>

        {/* DESKTOP CTA */}
        <div className="hidden md:block">
          <Link href="/#search">
            <button className="bg-[#2F5EEA] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#1E3FAE] transition">
              Find a Ride
            </button>
          </Link>
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden p-2 rounded-full border border-gray-200 bg-white shadow-sm"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <X className="w-6 h-6 text-[#2F5EEA]" />
          ) : (
            <Menu className="w-6 h-6 text-[#2F5EEA]" />
          )}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-80 opacity-100 py-4" : "max-h-0 opacity-0 py-0"
        } bg-white border-t`}
      >
        <ul className="flex flex-col items-center gap-5 font-medium text-gray-700">
          <li onClick={() => scrollToSection(refs.home)}>Home</li>
          <li onClick={() => scrollToSection(refs.features)}>Features</li>
          <li onClick={() => scrollToSection(refs.footer)}>Careers</li>

          <Link href="/#search" onClick={() => setMenuOpen(false)}>
            <button className="bg-[#2F5EEA] text-white px-6 py-2 rounded-full">
              Find a Ride
            </button>
          </Link>
        </ul>
      </div>
    </nav>
  );
}
