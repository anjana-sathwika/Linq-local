"use client";
import { useRef } from "react";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import CareersCTA from "./components/CareersCTA";
import Footer from "./components/Footer";
import Testimonials from "./components/Testimonials";
import SearchListings from "./components/SearchListings";
import WhyLinq from "./components/WhyLinq";

export default function Home() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const whyRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);

  return (
    <main>
      <Navbar
        refs={{
          home: heroRef,
          features: whyRef,
          footer: footerRef,
        }}
      />

      {/* HERO */}
      <div ref={heroRef}>
        <Hero />
      </div>

      {/* SEARCH + LISTINGS */}
      <section className="scroll-mt-24">
        <SearchListings />
      </section>

      {/* MERGED SECTION */}
      <div ref={whyRef}>
        <WhyLinq />
      </div>

      <Testimonials />
      <CareersCTA />

      {/* FOOTER */}
      <div ref={footerRef}>
        <Footer />
      </div>
    </main>
  );
}
