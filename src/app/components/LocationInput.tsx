"use client";

import { useState } from "react";

interface Props {
  placeholder: string;
  onSelect: (coords: { lat: number; lon: number }) => void;
}

export default function LocationInput({ placeholder, onSelect }: Props) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  async function searchLocation(text: string) {
    setValue(text);

    if (text.length < 2) {
      setSuggestions([]);
      return;
    }

    // Hyderabad focus + India only
    const viewbox = "78.2311,17.6033,78.5911,17.2161";

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${text}&format=json&countrycodes=in&limit=6&viewbox=${viewbox}&bounded=0`
    );

    let data = await res.json();

    // Push Hyderabad results first
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
        onChange={(e) => searchLocation(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#2F5EEA]"
      />

      {suggestions.length > 0 && (
        <div className="absolute bg-white border rounded-xl mt-1 w-full z-50 max-h-60 overflow-y-auto">
          {suggestions.map((s: any, i: number) => (
            <div
              key={i}
              onClick={() => {
                setValue(s.display_name);
                onSelect({ lat: Number(s.lat), lon: Number(s.lon) });
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
