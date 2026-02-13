"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ConnectPage() {
  const { partnerId } = useParams();

  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    has_vehicle: "",
    vehicle_type: "",
    seats: "",
    from: "",
    to: "",
    from_lat: "",
    from_lng: "",
    to_lat: "",
    to_lng: "",
    morning_time: "",
    evening_connect: "",
    evening_time: "",
    message: ""
  });

  const [fromSuggestions, setFromSuggestions] = useState<any[]>([]);
  const [toSuggestions, setToSuggestions] = useState<any[]>([]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // 🔍 LOCATION SEARCH (INDIA + HYDERABAD BIAS)
  async function searchLocation(value: string, type: "from" | "to") {
    if (value.length < 2) return;

    const viewbox = "78.2311,17.6033,78.5911,17.2161"; // Hyderabad box

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${value}&format=json&countrycodes=in&limit=6&viewbox=${viewbox}`
    );

    let data = await res.json();

    data = data.sort((a: any, b: any) => {
      const aHyd = a.display_name.toLowerCase().includes("hyderabad") ? 0 : 1;
      const bHyd = b.display_name.toLowerCase().includes("hyderabad") ? 0 : 1;
      return aHyd - bHyd;
    });

    if (type === "from") setFromSuggestions(data);
    else setToSuggestions(data);
  }

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);

    const payload = {
      ...form,
      status: "active",
      created_at: new Date().toISOString()
    };

    try {
      await fetch("https://sheetdb.io/api/v1/y6sm0l77x4p3n", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload })
      });

      const whatsappMessage = encodeURIComponent(
        `Hi LinQ 👋\n\nI want to connect with Partner ID: ${partnerId}\n\nMy details submitted on website.`
      );

      window.location.href = `https://wa.me/9494823941?text=${whatsappMessage}`;
    } catch {
      alert("Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 md:px-12 pt-28 pb-20">
      <div className="max-w-3xl mx-auto">

        <Link href="/" className="text-sm text-gray-600">
          ← Back
        </Link>

        <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
          <h1 className="text-2xl font-bold mb-4">Share your details</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input name="name" placeholder="Full Name" onChange={handleChange} className="input" />
            <input name="phone" placeholder="Phone" onChange={handleChange} className="input" />

            {/* FROM */}
            <div className="relative">
              <input
                name="from"
                placeholder="From"
                value={form.from}
                onChange={(e) => {
                  handleChange(e);
                  searchLocation(e.target.value, "from");
                }}
                className="input"
              />

              {fromSuggestions.length > 0 && (
                <div className="absolute bg-white border rounded-xl mt-1 w-full z-50 max-h-60 overflow-y-auto">
                  {fromSuggestions.map((s: any, i: number) => (
                    <div
                      key={i}
                      onClick={() => {
                        setForm({
                          ...form,
                          from: s.display_name,
                          from_lat: s.lat,
                          from_lng: s.lon
                        });
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
            <div className="relative">
              <input
                name="to"
                placeholder="To"
                value={form.to}
                onChange={(e) => {
                  handleChange(e);
                  searchLocation(e.target.value, "to");
                }}
                className="input"
              />

              {toSuggestions.length > 0 && (
                <div className="absolute bg-white border rounded-xl mt-1 w-full z-50 max-h-60 overflow-y-auto">
                  {toSuggestions.map((s: any, i: number) => (
                    <div
                      key={i}
                      onClick={() => {
                        setForm({
                          ...form,
                          to: s.display_name,
                          to_lat: s.lat,
                          to_lng: s.lon
                        });
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

            <input name="morning_time" placeholder="Morning time" onChange={handleChange} className="input" />

          </div>

          <textarea
            name="message"
            placeholder="Message"
            onChange={handleChange}
            className="input mt-4 h-24"
          />

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-6 w-full bg-[#2F5EEA] text-white py-3 rounded-xl font-semibold"
          >
            {submitting ? "Submitting..." : "Submit & Continue on WhatsApp"}
          </button>
        </div>
      </div>
    </main>
  );
}
