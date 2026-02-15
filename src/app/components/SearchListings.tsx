"use client";

import { FaInstagram } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import LocationInput from "./LocationInput";

interface Coordinates {
  lat: number;
  lon: number;
}

interface Listing {
  id: string;
  name: string;
  gender: string;
  from: string;
  to: string;
  from_lat?: number;
  from_lng?: number;
  to_lat?: number;
  to_lng?: number;
}

export default function SearchListings() {
  const [fromCoords, setFromCoords] = useState<Coordinates | null>(null);
  const [toCoords, setToCoords] = useState<Coordinates | null>(null);
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");

  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [results, setResults] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchPressed, setSearchPressed] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  // ===== LOAD DATA FROM SHEETDB =====
  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_SHEETDB_URL as string
        );
        const data = await res.json();

        setAllListings(data);
        setResults(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed loading listings:", err);
        setError("Failed to load listings. Please try again.");
        setLoading(false);
      }
    }

    fetchListings();
  }, []);

  // ===== DISTANCE CALC =====
  function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // ===== HELPER FUNCTIONS =====
  function shortLocation(address: string) {
    if (!address) return "";
    return address.split(",")[0];
  }

  // ===== SEARCH =====
  function performSearch() {
    setError(null);
    setSearching(true);
    setHasSearched(true);

    let filtered = allListings;

    // Priority 1: If coordinates exist, use distance filtering
    if (fromCoords && toCoords) {
      filtered = filtered.filter((item) => {
        if (!item.from_lat || !item.to_lat) return false;

        const d1 = getDistance(
          fromCoords.lat,
          fromCoords.lon,
          Number(item.from_lat),
          Number(item.from_lng)
        );

        const d2 = getDistance(
          toCoords.lat,
          toCoords.lon,
          Number(item.to_lat),
          Number(item.to_lng)
        );

        return d1 < 6 && d2 < 6;
      });
    }

    // Priority 2: Text matching (fallback or additional filter)
    if (fromText.trim()) {
      const fromLower = fromText.toLowerCase().trim();
      filtered = filtered.filter((item) =>
        item.from.toLowerCase().includes(fromLower)
      );
    }

    if (toText.trim()) {
      const toLower = toText.toLowerCase().trim();
      filtered = filtered.filter((item) =>
        item.to.toLowerCase().includes(toLower)
      );
    }

    setResults(filtered);
    setSearching(false);

    // Only scroll when search button is pressed
    if (searchPressed) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      setSearchPressed(false);
    }
  }

  function handleSearch() {
    setSearchPressed(true);
    performSearch();
  }

  // Real-time search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      if (fromText || toText) {
        performSearch();
      } else if (!fromText && !toText) {
        // Show all listings when both inputs are empty
        setResults(allListings);
      }
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [fromText, toText, fromCoords, toCoords, allListings]);

  return (
    <section
      id="search"
      className="bg-gray-50 rounded-3xl p-6 md:p-10 mt-24 scroll-mt-32"
    >
      {/* ===== TOP CTA BOX ===== */}
      <div className="bg-[#2F5EEA]/10 border border-[#2F5EEA]/20 rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            ✨ Share your details — we’ll match you shortly
          </h2>
          <p className="text-sm text-gray-600">
            No searching needed. We’ll find the right ride.
          </p>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-wrap gap-3">

          {/* GIVE DETAILS */}
          <Link href="/connect/new">
            <button className="bg-[#2F5EEA] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1E3FAE] transition">
              Give your details directly
            </button>
          </Link>

          {/* INSTAGRAM */}
          <a
            href="https://www.instagram.com/gotogetherrides/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition inline-flex"
            onClick={(e) => e.stopPropagation()}
          >
            <FaInstagram className="text-lg" />
            View us on Insta
          </a>

        </div>
      </div>

      {/* ===== SEARCH BOX ===== */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Search by route
        </h3>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4">
          <LocationInput
            placeholder="From"
            value={fromText}
            onChange={setFromText}
            onSelect={(coords) => {
              setFromCoords(coords);
              setError(null);
            }}
            onClear={() => setFromCoords(null)}
          />

          <LocationInput
            placeholder="To"
            value={toText}
            onChange={setToText}
            onSelect={(coords) => {
              setToCoords(coords);
              setError(null);
            }}
            onClear={() => setToCoords(null)}
          />

          <button
            onClick={handleSearch}
            disabled={searching}
            className="bg-[#2F5EEA] text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1E3FAE] transition"
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* ===== RESULTS ===== */}
      <div
        ref={resultsRef}
        className="bg-white rounded-2xl shadow-inner p-4 max-h-[500px] overflow-y-auto"
      >
        {loading ? (
          <p className="text-center py-10">Loading people…</p>
        ) : error && !loading ? (
          <p className="text-center py-10 text-red-500">{error}</p>
        ) : results.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {results.map((person) => {
              const masked = person.name?.slice(0, 3) + "***";
              const female = person.gender?.toLowerCase() === "female";

              return (
                <div
                  key={person.id}
                  className="bg-gray-50 rounded-2xl p-6 flex justify-between"
                >
                  <div>
                    <div className="font-semibold">
                      {masked} {female ? "♀" : "♂"}
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium max-w-[180px] truncate inline-block">
                        {shortLocation(person.from)} → {shortLocation(person.to)}
                      </span>
                    </div>
                  </div>

                  <Link href={`/connect/${person.id}`}>
                    <button className="bg-[#2F5EEA] text-white px-4 py-2 rounded-full hover:bg-[#1E3FAE] transition">
                      Connect
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (fromText || toText) ? (
          <div>
            {/* Message + button */}
            {(results.length === 0 && searchPressed) ? (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center mb-8">
                <p className="text-gray-800 mb-4">
                  If exact matches aren't found, please give your details directly — we'll match you shortly.
                </p>
                <Link href="/connect/new">
                  <button className="bg-[#2F5EEA] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1E3FAE] transition">
                    Give your details directly
                  </button>
                </Link>
              </div>
            ) : null}

            {/* Matched users first */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {results.map((person) => {
                const masked = person.name?.slice(0, 3) + "***";
                const female = person.gender?.toLowerCase() === "female";

                return (
                  <div
                    key={person.id}
                    className="bg-gray-50 rounded-2xl p-6 flex justify-between"
                  >
                    <div>
                      <div className="font-semibold">
                        {masked} {female ? "♀" : "♂"}
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium max-w-[180px] truncate inline-block">
                          {shortLocation(person.from)} → {shortLocation(person.to)}
                        </span>
                      </div>
                    </div>

                    <Link href={`/connect/${person.id}`}>
                      <button className="bg-[#2F5EEA] text-white px-4 py-2 rounded-full hover:bg-[#1E3FAE] transition">
                        Connect
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* All listings grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {allListings
                .filter(person => !results.find(result => result.id === person.id))
                .map((person) => {
                  const masked = person.name?.slice(0, 3) + "***";
                  const female = person.gender?.toLowerCase() === "female";

                  return (
                    <div
                      key={person.id}
                      className="bg-gray-50 rounded-2xl p-6 flex justify-between"
                    >
                      <div>
                        <div className="font-semibold">
                          {masked} {female ? "♀" : "♂"}
                        </div>
                        <div className="text-sm text-gray-500">
                          <span className="font-medium max-w-[180px] truncate inline-block">
                            {shortLocation(person.from)} → {shortLocation(person.to)}
                          </span>
                        </div>
                      </div>

                      <Link href={`/connect/${person.id}`}>
                        <button className="bg-[#2F5EEA] text-white px-4 py-2 rounded-full hover:bg-[#1E3FAE] transition">
                          Connect
                        </button>
                        </Link>
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          <p className="text-center py-10 text-gray-500">
            No matches nearby
          </p>
        )}
      </div>
    </section>
  );
}
