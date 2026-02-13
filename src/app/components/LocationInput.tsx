"use client";

import { useState } from "react";

interface Props {
  value: string;
  setValue: (v: string) => void;
  setCoords: (c: any) => void;
  placeholder: string;
}

export default function LocationInput({
  value,
  setValue,
  setCoords,
  placeholder,
}: Props) {
  const [suggestions, setSuggestions] = useState<any[]>([]);

  async function searchLocation(v: string) {
    if (v.length < 2) return;

    const viewbox = "78.2311,17.6033,78.5911,17.2161"; // Hyderabad

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(v)}&format=json&countrycodes=in&limit=5&viewbox=${viewbox}&bounded=0`
    );

    let data = await res.json();

    data = data.sort((a: any, b: any) => {
      const aHyd = a.display_name.toLowerCase().includes("hyderabad") ? 0 : 1;
      const bHyd = b.display_name.toLowerCase().includes("hyderabad") ? 0 : 1;
      return aHyd - bHyd;
    });

    setSuggestions(data);
  }

  return (
    <div className="relative w-full md:w-1/3">
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          searchLocation(e.target.value);
        }}
        placeholder={placeholder}
        className="w-full px-4 py-3 border rounded-xl"
      />

      {suggestions.length > 0 && (
        <div className="absolute bg-white border rounded-xl mt-1 w-full z-50 max-h-60 overflow-y-auto">
          {suggestions.map((s: any, i: number) => (
            <div
              key={i}
              onClick={() => {
                setValue(s.display_name);
                setCoords({ lat: s.lat, lon: s.lon });
                setSuggestions([]);
              }}
              className="p-3 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {s.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
