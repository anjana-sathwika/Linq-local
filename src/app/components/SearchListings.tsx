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
  has_vehicle?: string;
  vehicle_type?: string;
  seats?: string;
  morning_time?: string;
  evening_connect?: string;
  evening_time?: string;
  message?: string;
  travel_days?: string;
  score?: number;
  matchType?: string;
}

export default function SearchListings() {
  const [fromCoords, setFromCoords] = useState<Coordinates | null>(null);
  const [toCoords, setToCoords] = useState<Coordinates | null>(null);
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [searchTravelDays, setSearchTravelDays] = useState<string[]>([]);

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

  function formatTravelDays(travelDays: string): string {
    if (!travelDays) return "";
    
    const days = travelDays.split(",").map(d => d.trim());
    
    // Check for common patterns
    if (days.length === 7) return "Everyday";
    if (days.length === 5 && days.includes("Mon") && days.includes("Fri") && !days.includes("Sat") && !days.includes("Sun")) {
      return "Mon-Fri";
    }
    if (days.length === 6 && days.includes("Mon") && days.includes("Sat") && !days.includes("Sun")) {
      return "Mon-Sat";
    }
    
    // Return comma-separated for specific days
    return days.join(", ");
  }

  // ===== SEARCH & MATCHING =====
  function calculateMatchScore(profile: Listing): { score: number; matchType: string } {
    let score = 0;
    let matchType = "Other";
    const fromLower = fromText.toLowerCase().trim();
    const toLower = toText.toLowerCase().trim();
    const profileFromLower = profile.from?.toLowerCase() || "";
    const profileToLower = profile.to?.toLowerCase() || "";

    // 🥇 1. Exact route match (highest priority)
    const exactFromMatch = fromLower && profileFromLower.includes(fromLower);
    const exactToMatch = toLower && profileToLower.includes(toLower);
    
    if (exactFromMatch && exactToMatch) {
      score += 100;
      matchType = "⭐ Best match";
    } else if (exactFromMatch || exactToMatch) {
      score += 30;
      matchType = "Partial match";
    }

    // 🥈 2. Nearby route match (lat/lng)
    if (fromCoords && toCoords && profile.from_lat && profile.from_lng && profile.to_lat && profile.to_lng) {
      const fromDistance = getDistance(
        fromCoords.lat,
        fromCoords.lon,
        profile.from_lat,
        profile.from_lng
      );
      const toDistance = getDistance(
        toCoords.lat,
        toCoords.lon,
        profile.to_lat,
        profile.to_lng
      );

      // Both within 8km = high priority
      if (fromDistance < 8 && toDistance < 8) {
        score += 80;
        if (matchType === "Other") matchType = "🔁 Similar route";
      } else if (fromDistance < 8 || toDistance < 8) {
        score += 40;
        if (matchType === "Other") matchType = "Nearby route";
      }
    }

    // 🥉 3. Same travel days
    if (searchTravelDays.length > 0 && profile.travel_days) {
      const profileDays = profile.travel_days.split(",").map(d => d.trim());
      const sameDays = searchTravelDays.filter(day => profileDays.includes(day));
      const overlappingDays = searchTravelDays.filter(day => profileDays.includes(day));
      
      if (sameDays.length === searchTravelDays.length && searchTravelDays.length > 0) {
        score += 25;
        if (matchType === "Other") matchType = "Same travel days";
      } else if (overlappingDays.length > 0) {
        score += 15;
        if (matchType === "Other") matchType = "Overlapping days";
      }
    }

    // 4. Timing overlap
    if (profile.morning_time || profile.evening_time) {
      score += 10;
    }

    // 5. Bonus points
    if (profile.has_vehicle === "Yes") {
      score += 5;
    }

    return { score, matchType };
  }

  function performSearch() {
    setError(null);
    setSearching(true);
    setHasSearched(true);

    // Calculate scores for all profiles
    const scoredListings = allListings.map(profile => {
      const { score, matchType } = calculateMatchScore(profile);
      return { ...profile, score, matchType };
    });

    // Sort by score (descending)
    const sortedListings = scoredListings.sort((a, b) => (b.score || 0) - (a.score || 0));

    setResults(sortedListings);
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
        
        {/* Travel Days Filter */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by travel days (optional)
          </label>
          <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <label key={day} className="flex items-center">
                <input
                  type="checkbox"
                  checked={searchTravelDays.includes(day)}
                  onChange={() => {
                    setSearchTravelDays(prev => 
                      prev.includes(day) 
                        ? prev.filter(d => d !== day)
                        : [...prev, day]
                    );
                  }}
                  className="mr-1"
                />
                <span className="text-xs">{day}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* ===== ALWAYS VISIBLE GIVE DETAILS SECTION ===== */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
        <p className="text-gray-800 mb-4 text-center">
          If exact matches aren't found, "Give your details directly" — we'll match you shortly.
        </p>
        <div className="text-center">
          <Link href="/connect/new">
            <button className="bg-[#2F5EEA] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1E3FAE] transition">
              Give your details directly
            </button>
          </Link>
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
        ) : (
          <div>
            {/* All profiles sorted by match score */}
            <div className="grid md:grid-cols-2 gap-6">
              {results.map((person) => {
                const masked = person.name?.slice(0, 3) + "***";
                const gender = person.gender?.toLowerCase();

                return (
                  <div
                    key={person.id}
                    className="bg-gray-50 rounded-2xl p-6 flex justify-between"
                  >
                    <div className="flex-1">
                      {/* Match Type Label */}
                      {person.matchType && person.matchType !== "Other" && (
                        <div className="text-xs font-semibold text-blue-600 mb-2">
                          {person.matchType}
                        </div>
                      )}
                      
                      {/* Name and Gender */}
                      <div className="font-semibold mb-2 flex items-center gap-2">
                        {masked}
                        {gender && (
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            gender === "female" 
                              ? "bg-pink-100 text-pink-700" 
                              : gender === "male" 
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-600"
                          }`}>
                            {gender.charAt(0).toUpperCase() + gender.slice(1)}
                          </span>
                        )}
                      </div>
                      
                      {/* Route */}
                      <div className="text-sm text-gray-500 mb-2">
                        <span className="font-medium max-w-[180px] truncate inline-block">
                          {shortLocation(person.from)} → {shortLocation(person.to)}
                        </span>
                      </div>
                      
                      {/* Vehicle Info */}
                      {person.has_vehicle === "Yes" && (
                        <div className="text-xs text-gray-600 mb-1">
                          {person.vehicle_type?.toLowerCase() === "bike" ? "🏍️" : "🚗"} {person.vehicle_type || "Vehicle"} {person.seats && `(${person.seats} seats)`}
                        </div>
                      )}
                      
                      {/* Timings */}
                      <div className="text-xs text-gray-600 mb-1">
                        {person.morning_time && `🌅 ${person.morning_time}`}
                        {person.evening_connect === "Yes" && person.evening_time && ` 🌆 ${person.evening_time}`}
                      </div>
                      
                      {/* Travel Days */}
                      {person.travel_days && (
                        <div className="text-xs text-gray-600 mb-1">
                          🗓 Travel: {formatTravelDays(person.travel_days)}
                        </div>
                      )}
                      
                      {/* Message */}
                      {person.message && (
                        <div className="text-xs text-gray-500 mt-2 italic">
                          "{person.message}"
                        </div>
                      )}
                    </div>

                    <Link href={`/connect/${person.id}`}>
                      <button className="bg-[#2F5EEA] text-white px-4 py-2 rounded-full hover:bg-[#1E3FAE] transition ml-4">
                        Connect
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>
            
            {results.length === 0 && (
              <p className="text-center py-10 text-gray-500">
                No matches nearby
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
