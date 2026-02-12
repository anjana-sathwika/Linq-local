"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface Listing {
  id: string;
  name: string;
  gender: string;
  from: string;
  to: string;
}

export default function SearchListings() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [results, setResults] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchListings() {
      try {
        const response = await fetch("/api/listings"); // secure backend route
        const data = await response.json();
        setAllListings(data);
        setResults(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load listings");
      }
    }

    fetchListings();
  }, []);

  function handleSearch() {
    const searchFrom = from.toLowerCase().trim();
    const searchTo = to.toLowerCase().trim();

    const filtered = allListings.filter((item) => {
      const fromMatch = searchFrom
        ? item.from?.toLowerCase().includes(searchFrom)
        : true;

      const toMatch = searchTo
        ? item.to?.toLowerCase().includes(searchTo)
        : true;

      return fromMatch && toMatch;
    });

    setResults(filtered);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  return (
    <section
      id="search"
      className="bg-gray-50 rounded-3xl p-6 md:p-10 mt-24 scroll-mt-32"
    >
      {/* CTA */}
      <div className="bg-[#2F5EEA]/10 border border-[#2F5EEA]/20 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            ✨ Share your details — we’ll match you shortly
          </h2>
          <p className="text-sm text-gray-600">
            No searching needed. We’ll find the right ride for you.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Link href="/connect/new">
            <button className="bg-[#2F5EEA] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1E3FAE] transition">
              Give my details
            </button>
          </Link>

          <a
            href="https://www.instagram.com/gotogetherrides"
            target="_blank"
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M7.75 2C4.678 2 2.25 4.428 2.25 7.5v9c0 3.072 2.428 5.5 5.5 5.5h8.5c3.072 0 5.5-2.428 5.5-5.5v-9c0-3.072-2.428-5.5-5.5-5.5h-8.5zm0 1.5h8.5c2.243 0 4 1.757 4 4v9c0 2.243-1.757 4-4 4h-8.5c-2.243 0-4-1.757-4-4v-9c0-2.243 1.757-4 4-4zm9.75 1.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 1.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z"/>
            </svg>
            View on Insta
          </a>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Search by route
        </h3>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="From"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full md:w-1/3 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2F5EEA]"
          />

          <input
            type="text"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full md:w-1/3 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2F5EEA]"
          />

          <button
            onClick={handleSearch}
            className="bg-[#2F5EEA] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1E3FAE] transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* RESULTS */}
      <div
        ref={resultsRef}
        className="bg-white rounded-2xl shadow-inner p-4 max-h-[500px] overflow-y-auto"
      >
        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading people…</p>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((person) => {
              const maskedName = person.name?.slice(0, 3) + "***";
              const isFemale = person.gender?.toLowerCase() === "female";

              return (
                <div
                  key={person.id}
                  className="bg-gray-50 rounded-2xl shadow-sm p-6 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800">
                        {maskedName}
                      </span>
                      <span
                        className={`text-lg ${
                          isFemale ? "text-pink-400" : "text-[#3256B5]"
                        }`}
                      >
                        {isFemale ? "♀" : "♂"}
                      </span>
                    </div>

                    <div className="text-sm text-gray-500">
                      {person.from} → {person.to}
                    </div>
                  </div>

                  <Link href={`/connect/${person.id}`}>
                    <button className="bg-[#3256B5] text-white px-4 py-2 rounded-full font-medium hover:opacity-90 transition">
                      Connect
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10">
            No matches found yet.
          </p>
        )}
      </div>
    </section>
  );
}
