"use client";

import { useState } from "react";
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
  const [results, setResults] = useState<Listing[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!from || !to) return;

    setLoading(true);
    setSearched(true);

    const response = await fetch(
      "https://sheetdb.io/api/v1/y6sm0l77x4p3n/search?status=active"
    );

    const data = await response.json();

    const searchFrom = from.toLowerCase().trim();
    const searchTo = to.toLowerCase().trim();

    const matched = data.filter((item: Listing) => {
      return (
        item.from?.toLowerCase().includes(searchFrom) &&
        item.to?.toLowerCase().includes(searchTo)
      );
    });

    setResults(matched);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 md:px-12 pt-32 pb-20">
      <div className="max-w-5xl mx-auto">
        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Find a Ride Partner
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
              disabled={loading}
              className="bg-[#2F5EEA] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1E3FAE] transition disabled:opacity-60"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Results */}
        {searched && (
          <>
            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((person) => {
                  const maskedName =
                    person.name?.slice(0, 3) + "***";

                  const isFemale =
                    person.gender?.toLowerCase() === "female";

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
                              isFemale
                                ? "text-pink-400"
                                : "text-[#3256B5]"
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
              <div className="text-center mt-12">
                <p className="text-gray-600 mb-4">
                  Didn’t find the right partner with your requirements?
                </p>

                <Link href="/connect/new">
                  <button className="bg-[#2F5EEA] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1E3FAE] transition">
                    Give your details — we’ll match you shortly
                  </button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
