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

  const [fromCoords, setFromCoords] = useState<{ lat: number; lng: number }>();
  const [toCoords, setToCoords] = useState<{ lat: number; lng: number }>();

  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [results, setResults] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const resultsRef = useRef<HTMLDivElement>(null);

  // ================= FETCH DATA =================
  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch("/api/listings");
        const data = await res.json();
        setAllListings(data);
        setResults(data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }

    fetchListings();
  }, []);

  // ================= LOCATION SEARCH (OSM) =================
  async function searchLocation(value: string, type: "from" | "to") {
    if (value.length < 2) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${value}&format=json&addressdetails=1`
    );
    const data = await res.json();

    if (type === "from") setFromSuggestions(data);
    else setToSuggestions(data);
  }

  function selectLocation(item: any, type: "from" | "to") {
    const coords = {
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    };

    if (type === "from") {
      setFrom(item.display_name);
      setFromCoords(coords);
      setFromSuggestions([]);
    } else {
      setTo(item.display_name);
      setToCoords(coords);
      setToSuggestions([]);
    }
  }

  // ================= DISTANCE CALC =================
  function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // ================= SEARCH =================
  function handleSearch() {
    let filtered = allListings;

    if (fromCoords && toCoords) {
      filtered = allListings.filter((item) => {
        if (!item.from_lat || !item.from_lng) return false;

        const dist = getDistance(
          fromCoords.lat,
          fromCoords.lng,
          item.from_lat,
          item.from_lng
        );

        return dist < 5; // 5km match radius
      });
    } else {
      const f = from.toLowerCase();
      const t = to.toLowerCase();

      filtered = allListings.filter(
        (item) =>
          item.from?.toLowerCase().includes(f) &&
          item.to?.toLowerCase().includes(t)
      );
    }

    setResults(filtered);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  // ================= UI =================
  return (
    <section
      id="search"
      className="bg-gray-50 rounded-3xl p-6 md:p-10 mt-24 scroll-mt-32"
    >
      {/* SEARCH BOX */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">Search by route</h3>

        <div className="flex flex-col md:flex-row gap-4 relative">

          {/* FROM */}
          <div className="w-full md:w-1/3 relative">
            <input
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                searchLocation(e.target.value, "from");
              }}
              placeholder="From location"
              className="w-full px-4 py-3 border rounded-xl"
            />

            {fromSuggestions.length > 0 && (
              <div className="absolute bg-white border w-full z-20 max-h-60 overflow-y-auto">
                {fromSuggestions.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => selectLocation(item, "from")}
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                  >
                    {item.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TO */}
          <div className="w-full md:w-1/3 relative">
            <input
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                searchLocation(e.target.value, "to");
              }}
              placeholder="To location"
              className="w-full px-4 py-3 border rounded-xl"
            />

            {toSuggestions.length > 0 && (
              <div className="absolute bg-white border w-full z-20 max-h-60 overflow-y-auto">
                {toSuggestions.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => selectLocation(item, "to")}
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                  >
                    {item.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleSearch}
            className="bg-[#2F5EEA] text-white px-6 py-3 rounded-xl"
          >
            Search
          </button>
        </div>
      </div>

      {/* RESULTS */}
      <div
        ref={resultsRef}
        className="bg-white rounded-2xl p-4 max-h-[500px] overflow-y-auto"
      >
        {loading ? (
          <p className="text-center py-10">Loading…</p>
        ) : results.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {results.map((person) => {
              const maskedName = person.name?.slice(0, 3) + "***";

              return (
                <div
                  key={person.id}
                  className="bg-gray-50 rounded-2xl p-6 flex justify-between"
                >
                  <div>
                    <div className="font-semibold">{maskedName}</div>
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
          <p className="text-center py-10">No matches found</p>
        )}
      </div>
    </section>
  );
}
