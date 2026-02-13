"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

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
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [fromSuggestions, setFromSuggestions] = useState<any[]>([]);
  const [toSuggestions, setToSuggestions] = useState<any[]>([]);

  const [fromCoords, setFromCoords] = useState<any>(null);
  const [toCoords, setToCoords] = useState<any>(null);

  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [results, setResults] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const resultsRef = useRef<HTMLDivElement>(null);

  // 🟢 LOAD PEOPLE FROM GOOGLE SHEET
  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_SHEETDB_URL!);
        const data = await res.json();
        setAllListings(data);
        setResults(data);
        setLoading(false);
      } catch {
        console.log("Sheet load failed");
      }
    }

    fetchListings();
  }, []);

  // 🔍 LOCATION SEARCH (INDIA + HYDERABAD PRIORITY)
  async function searchLocation(value: string, type: "from" | "to") {
    if (value.length < 2) return;

    try {
      const viewbox = "78.2311,17.6033,78.5911,17.2161";

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(value)}&` +
          `format=json&` +
          `countrycodes=in&` +
          `limit=6&` +
          `viewbox=${viewbox}&` +
          `bounded=0`
      );

      let data = await res.json();

      // move Hyderabad results to top
      data = data.sort((a: any, b: any) => {
        const aHyd = a.display_name.toLowerCase().includes("hyderabad")
          ? 0
          : 1;
        const bHyd = b.display_name.toLowerCase().includes("hyderabad")
          ? 0
          : 1;
        return aHyd - bHyd;
      });

      if (type === "from") setFromSuggestions(data);
      else setToSuggestions(data);
    } catch {
      console.log("location search error");
    }
  }

  // 📏 DISTANCE CALC
  function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // 🔎 SEARCH BUTTON
  function handleSearch() {
    if (!fromCoords || !toCoords) {
      alert("Please select locations from suggestions");
      return;
    }

    const filtered = allListings.filter((item) => {
      if (!item.from_lat || !item.to_lat) return true;

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

      return d1 < 5 && d2 < 5;
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
      <div className="bg-[#2F5EEA]/10 border border-[#2F5EEA]/20 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            ✨ Share your details — we’ll match you shortly
          </h2>
          <p className="text-sm text-gray-600">
            No searching needed. We’ll find the right ride.
          </p>
        </div>

        <Link href="/connect/new">
          <button className="bg-[#2F5EEA] text-white px-6 py-3 rounded-full font-semibold">
            Give my details
          </button>
        </Link>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">Search by route</h3>

        <div className="flex flex-col md:flex-row gap-4">
          {/* FROM */}
          <div className="relative w-full md:w-1/3">
            <input
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                searchLocation(e.target.value, "from");
              }}
              placeholder="From"
              className="w-full px-4 py-3 border rounded-xl"
            />

            {fromSuggestions.length > 0 && (
              <div className="absolute bg-white border rounded-xl mt-1 w-full z-50 max-h-60 overflow-y-auto">
                {fromSuggestions.map((s: any, i: number) => (
                  <div
                    key={i}
                    onClick={() => {
                      setFrom(s.display_name);
                      setFromCoords({ lat: s.lat, lon: s.lon });
                      setFromSuggestions([]);
                    }}
                    className="p-3 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {s.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TO */}
          <div className="relative w-full md:w-1/3">
            <input
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                searchLocation(e.target.value, "to");
              }}
              placeholder="To"
              className="w-full px-4 py-3 border rounded-xl"
            />

            {toSuggestions.length > 0 && (
              <div className="absolute bg-white border rounded-xl mt-1 w-full z-50 max-h-60 overflow-y-auto">
                {toSuggestions.map((s: any, i: number) => (
                  <div
                    key={i}
                    onClick={() => {
                      setTo(s.display_name);
                      setToCoords({ lat: s.lat, lon: s.lon });
                      setToSuggestions([]);
                    }}
                    className="p-3 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {s.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleSearch}
            className="bg-[#2F5EEA] text-white px-6 py-3 rounded-xl font-semibold"
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
          <p className="text-center py-10">Loading…</p>
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
                      {person.from} → {person.to}
                    </div>
                  </div>

                  <Link href={`/connect/${person.id}`}>
                    <button className="bg-[#3256B5] text-white px-4 py-2 rounded-full">
                      Connect
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center py-10 text-gray-500">
            No matches found nearby
          </p>
        )}
      </div>
    </section>
  );
}
