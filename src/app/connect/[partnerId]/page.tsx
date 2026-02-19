"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface FormData {
  name: string;
  email: string;
  phone: string;
  gender: string;
  has_vehicle: string;
  vehicle_type: string;
  seats: string;
  from: string;
  to: string;
  time: string;
  willing_return: string;
  return_time: string;
  message_to_partner: string;
  travel_frequency: string;
  travel_days: string[];
}

export default function ConnectPage() {
  const { partnerId } = useParams();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    gender: "",
    has_vehicle: "",
    vehicle_type: "",
    seats: "",
    from: "",
    to: "",
    time: "",
    willing_return: "",
    return_time: "",
    message_to_partner: "",
    travel_frequency: "",
    travel_days: [],
  });

  function handleChange(e: any) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function geocodeAddress(address: string) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await res.json();
      if (data?.length) {
        return {
          lat: data[0].lat,
          lng: data[0].lon,
        };
      }
    } catch {}
    return { lat: "", lng: "" };
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);

    try {
      const fromCoords = await geocodeAddress(form.from);
      const toCoords = await geocodeAddress(form.to);

      // ⭐⭐⭐ IMPORTANT FIX HERE ⭐⭐⭐
      const submissionData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        gender: form.gender,
        has_vehicle: form.has_vehicle,
        vehicle_type: form.vehicle_type,
        seats: form.seats,
        from: form.from,
        to: form.to,
        morning_time: form.time,
        evening_connect: form.willing_return,
        evening_time: form.return_time,
        message: form.message_to_partner,
        status: "active",
        created_at: new Date().toISOString(),
        from_lat: fromCoords.lat,
        from_lng: fromCoords.lng,
        to_lat: toCoords.lat,
        to_lng: toCoords.lng,
      };

      await fetch(process.env.NEXT_PUBLIC_SHEETDB_URL as string, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: submissionData }),
      });

      alert("Submitted successfully!");
      window.location.href = "/#search";
    } catch (err) {
      setError("Failed to submit");
    }

    setSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 md:px-12 pt-28 pb-20">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-sm text-gray-600">← Back</Link>

        <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
          <h1 className="text-2xl font-bold mb-6">Share Your Details</h1>

          {error && <p className="text-red-500">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input name="name" placeholder="Name" onChange={handleChange} className="border p-3 w-full"/>
            <input name="email" placeholder="Email" onChange={handleChange} className="border p-3 w-full"/>
            <input name="phone" placeholder="Phone" onChange={handleChange} className="border p-3 w-full"/>

            <input name="from" placeholder="From" onChange={handleChange} className="border p-3 w-full"/>
            <input name="to" placeholder="To" onChange={handleChange} className="border p-3 w-full"/>

            <input type="time" name="time" onChange={handleChange} className="border p-3 w-full"/>

            <textarea name="message_to_partner" placeholder="Message" onChange={handleChange} className="border p-3 w-full"/>

            <button className="bg-blue-600 text-white px-6 py-3 rounded">
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
