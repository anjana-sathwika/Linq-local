"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Listing {
  id: string;
  name: string;
  gender: string;
  from: string;
  to: string;
}

export default function SearchPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [results, setResults] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch ALL active listings on page load
  useEffect(() => {
    async function fetchListings() {
      const response = await fetch(
        "https://sheetdb.io/api/v1/y6sm0l77x4p3n/search?status=active"
      );
      const data = await response.json();
      setAllListings(data);
      setResults(data);
      setLoading(false);
    }

    fetchListings();
  }, []);

  // Search is OPTIONAL – acts as filter
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
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 md:px-12 pt-24 pb-20">
      <div className="max-w-5xl mx-auto">

        {/* Back Button */}
        <div className="mb-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-[#2F5EEA]">
            ← Back to home
          </Link>
        </div>

        {/* Direct CTA */}
        <div className="bg-[#2F5EEA]/10 border border-[#2F5EEA]/20 rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              ✨ Give your details directly — we’ll match you shortly
            </h2>
            <p className="text-sm text-gray-600">
              No need to search. Share your details and we’ll find the right match.
            </p>
          </div>

          <Link href="/connect/new">
            <button className="bg-[#2F5EEA] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1E3FAE] transition">
              Give my details
            </button>
          </Link>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
          <h1 className="text-xl font-bold text-gray-800 mb-4">
            Search by route 
          </h1>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="From"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full md:w-1/3 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5EEA]"
            />

            <input
              type="text"
              placeholder="To"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full md:w-1/3 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F5EEA]"
            />

            <button
              onClick={handleSearch}
              className="bg-[#2F5EEA] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1E3FAE] transition"
            >
              Search
            </button>
          </div>
        </div>

        {/* Listings */}
        {loading ? (
          <p className="text-center text-gray-500">Loading people...</p>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((person) => {
              const maskedName = person.name?.slice(0, 3) + "***";
              const isFemale = person.gender?.toLowerCase() === "female";

              return (
                <div
                  key={person.id}
                  className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between"
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
          <p className="text-center text-gray-500">
            No matches found yet.
          </p>
        )}
      </div>
    </main>
  );
}
