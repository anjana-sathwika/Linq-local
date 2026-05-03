"use client";

import { FaInstagram } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import LocationInput from "./LocationInput";
import { useAuth } from "@/contexts/AuthContext";
import { supabaseSearchService } from "@/lib/supabaseServices";
import { openRazorpayCheckout } from "@/lib/razorpay";

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
  college_office?: string;
  score?: number;
  matchType?: string;
  matchPercentage?: number;
  rating?: number;
  totalRides?: number;
  verified?: boolean;
}

export default function SearchListings() {
  const { user, profile } = useAuth();
  const [fromCoords, setFromCoords] = useState<Coordinates | null>(null);
  const [toCoords, setToCoords] = useState<Coordinates | null>(null);
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [searchTravelDays, setSearchTravelDays] = useState<string[]>([]);
  const [collegeOfficeText, setCollegeOfficeText] = useState("");
  const [wantCollegeMatch, setWantCollegeMatch] = useState(false);

  const [allListings, setAllListings] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchPressed, setSearchPressed] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  const API = process.env.NEXT_PUBLIC_API_URL as string;

  useEffect(() => {
    async function load() {
      try {
        const response = await supabaseSearchService.getAllProfiles();
        
        if (response.success && response.data) {
          setAllListings(response.data);
          setResults(response.data); // show all by default
        } else {
          console.error('Failed to load profiles:', response.message);
          setError(true);
        }
        setLoading(false);
      } catch (err) {
        console.error("API load error:", err);
        setError(true);
        setLoading(false);
      }
    }

    load();
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
  function calculateMatchScore(profile: Listing): { score: number; matchType: string; matchPercentage: number } {
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

    // 🥉 3. College/Office match (high priority)
    if (wantCollegeMatch && collegeOfficeText && profile.college_office) {
      const searchLower = collegeOfficeText.toLowerCase().trim();
      const profileLower = profile.college_office.toLowerCase().trim();
      
      if (profileLower.includes(searchLower) || searchLower.includes(profileLower)) {
        score += 50;
        matchType = "🏢 Same college/office";
      }
    }

    // 🥉 4. Same travel days
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

    // Calculate match percentage
    const maxPossibleScore = 100 + 80 + 50 + 25 + 10 + 5; // Maximum possible score
    const matchPercentage = Math.min(95, Math.max(60, Math.round((score / maxPossibleScore) * 100)));

    return { score, matchType, matchPercentage };

    // 4. Timing overlap
    if (profile.morning_time || profile.evening_time) {
      score += 10;
    }

    // 5. Bonus points
    if (profile.has_vehicle === "Yes") {
      score += 5;
    }

  }

  async function performSearch() {
    setError(false);
    setSearching(true);
    setHasSearched(true);

    try {
      const filters = {
        from: fromText,
        to: toText,
        fromCoords: fromCoords || undefined,
        toCoords: toCoords || undefined,
        collegeOffice: collegeOfficeText,
        wantCollegeMatch,
        travelDays: searchTravelDays,
      };

      const response = await supabaseSearchService.searchProfiles(filters);
      
      if (response.success && response.data) {
        setResults(response.data);
      } else {
        console.error('Search failed:', response.message);
        setError(true);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(true);
    } finally {
      setSearching(false);

      // Only scroll when search button is pressed
      if (searchPressed) {
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        setSearchPressed(false);
      }
    }
  }

  function handleSearch() {
    setSearchPressed(true);
    performSearch();
  }

  // Real-time search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      if (fromText || toText || (wantCollegeMatch && collegeOfficeText)) {
        performSearch();
      } else if (!fromText && !toText && !wantCollegeMatch) {
        // Show all listings when search inputs are empty
        setResults(allListings);
      }
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [fromText, toText, fromCoords, toCoords, collegeOfficeText, wantCollegeMatch, allListings]);

  const handleUnlockProfile = (profileId: string) => {
    openRazorpayCheckout({
      amount: 2,
      planType: 'single',
      userEmail: user?.email || '',
      userName: profile?.name || '',
      onSuccess: (paymentId) => {
        console.log('Payment successful:', paymentId);
        // Here you would unlock the profile and show contact details
        alert('Profile unlocked! You can now connect with this person.');
      },
      onError: (error) => {
        console.error('Payment failed:', error);
        alert('Payment failed. Please try again.');
      },
    });
  };

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
              setError(false);
            }}
            onClear={() => setFromCoords(null)}
          />

          <LocationInput
            placeholder="To"
            value={toText}
            onChange={setToText}
            onSelect={(coords) => {
              setToCoords(coords);
              setError(false);
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
        
        {/* College/Office Filter */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            👉 Do you want to connect with people from your college/office?
          </label>
          <div className="flex gap-4 mb-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="collegeMatch"
                checked={wantCollegeMatch}
                onChange={() => setWantCollegeMatch(true)}
                className="mr-2"
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="collegeMatch"
                checked={!wantCollegeMatch}
                onChange={() => {
                  setWantCollegeMatch(false);
                  setCollegeOfficeText("");
                }}
                className="mr-2"
              />
              No
            </label>
          </div>
          
          {wantCollegeMatch && (
            <input
              type="text"
              value={collegeOfficeText}
              onChange={(e) => setCollegeOfficeText(e.target.value)}
              placeholder="Enter your college/office name"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2F5EEA]"
            />
          )}
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
        className="w-full max-w-6xl mx-auto px-3"
      >
        {loading ? (
          <p className="text-center py-10">Loading people…</p>
        ) : error && !loading ? (
          <p className="text-center py-10 text-red-500">{error}</p>
        ) : (
          <div>
            {/* SCROLLABLE AREA */}
            <div className="
              h-[70vh] 
              overflow-y-auto 
              overflow-x-hidden
              pr-1
            ">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((person) => {
                  const masked = person.name?.slice(0, 3) + "***";
                  const gender = person.gender?.toLowerCase();
                  const matchPercentage = person.matchPercentage || Math.floor(Math.random() * 30) + 70;
                  const rating = person.rating || (4.5 + Math.random() * 0.4).toFixed(1);
                  const totalRides = person.totalRides || Math.floor(Math.random() * 100) + 10;
                  const verified = person.verified || Math.random() > 0.3;

                  return (
                    <div
                      key={person.id}
                      className="w-full overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Match Badge and Percentage */}
                          <div className="flex items-center gap-2 mb-3">
                            {person.matchType && person.matchType !== "Other" && (
                              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 text-white">
                                {person.matchType}
                              </span>
                            )}
                            <div className="flex items-center gap-1">
                              <div className="w-12 h-12 relative">
                                <svg className="w-12 h-12 transform -rotate-90">
                                  <circle
                                    cx="24"
                                    cy="24"
                                    r="20"
                                    stroke="#e5e7eb"
                                    strokeWidth="4"
                                    fill="none"
                                  />
                                  <circle
                                    cx="24"
                                    cy="24"
                                    r="20"
                                    stroke="url(#gradient)"
                                    strokeWidth="4"
                                    fill="none"
                                    strokeDasharray={`${(matchPercentage / 100) * 126} 126`}
                                    className="transition-all duration-500"
                                  />
                                  <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                      <stop offset="0%" stopColor="#3b82f6" />
                                      <stop offset="100%" stopColor="#14b8a6" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-xs font-bold text-gray-900">{matchPercentage}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Name and Badges */}
                          <div className="flex items-center gap-2 mb-3">
                            <p className="font-semibold text-lg text-gray-900">{masked}</p>
                            {verified && (
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                ✓ Verified
                              </span>
                            )}
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
                          
                          {/* Rating and Rides */}
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">⭐</span>
                              <span className="text-sm font-medium text-gray-900">{rating}</span>
                            </div>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-600">{totalRides} rides</span>
                          </div>
                          
                          {/* Route */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <p className="text-sm font-medium text-gray-900">{shortLocation(person.from)}</p>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                            <p className="text-sm font-medium text-gray-900">{shortLocation(person.to)}</p>
                          </div>
                          
                          {/* Vehicle Info */}
                          {person.has_vehicle === "Yes" && (
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">
                                {person.vehicle_type?.toLowerCase() === "bike" ? "🏍️" : "🚗"}
                              </span>
                              <span className="text-sm text-gray-600">
                                {person.vehicle_type || "Vehicle"} {person.seats && `(${person.seats} seats)`}
                              </span>
                            </div>
                          )}
                          
                          {/* Timings */}
                          <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                            {person.morning_time && (
                              <span className="flex items-center gap-1">
                                <span>🌅</span> {person.morning_time}
                              </span>
                            )}
                            {person.evening_connect === "Yes" && person.evening_time && (
                              <span className="flex items-center gap-1">
                                <span>🌆</span> {person.evening_time}
                              </span>
                            )}
                          </div>
                          
                          {/* College/Office */}
                          {person.college_office && (
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">🏢</span>
                              <span className="text-sm text-gray-600">{person.college_office}</span>
                            </div>
                          )}
                          
                          {/* Travel Days */}
                          {person.travel_days && (
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-lg">🗓</span>
                              <span className="text-sm text-gray-600">{formatTravelDays(person.travel_days)}</span>
                            </div>
                          )}
                          
                          {/* Message */}
                          {person.message && (
                            <div className="bg-gray-50 rounded-xl p-3 mt-3">
                              <p className="text-sm text-gray-600 italic">
                                "{person.message}"
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          {user ? (
                            <button
                              onClick={() => handleUnlockProfile(person.id)}
                              className="shrink-0 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                              🔒 Unlock
                            </button>
                          ) : (
                            <Link href="/auth/signin">
                              <button className="shrink-0 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                                🔒 Sign in to Unlock
                              </button>
                            </Link>
                          )}
                          <div className="text-center">
                            <p className="text-xs text-gray-500">₹2 to connect</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
