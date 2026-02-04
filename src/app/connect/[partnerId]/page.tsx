"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ConnectPage() {
  const { partnerId } = useParams();
  const router = useRouter();

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
    morning_time: "",
    evening_connect: "",
    evening_time: "",
    message: ""
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    const payload = {
      ...form,
      status: "active",
      created_at: new Date().toISOString()
    };

    await fetch("https://sheetdb.io/api/v1/y6sm0l77x4p3n", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: payload })
    });

    const whatsappMessage = encodeURIComponent(
      `Hi LinQ 👋\n\nI want to connect with Partner ID: ${partnerId}\n\nMy details are submitted on the website.\nPlease guide me further.`
    );

    window.location.href = `https://wa.me/9494823941?text=${whatsappMessage}`;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 md:px-12 pt-28 pb-20">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          Share your details
        </h1>
        <p className="text-gray-500 mb-6">
          We’ll connect you with the right partner securely.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Full Name" onChange={handleChange} className="input" />
          <input name="email" placeholder="Email" onChange={handleChange} className="input" />
          <input name="phone" placeholder="Phone" onChange={handleChange} className="input" />
          <select name="gender" onChange={handleChange} className="input">
            <option value="">Gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>

          <select name="has_vehicle" onChange={handleChange} className="input">
            <option value="">Do you have a vehicle?</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>

          <select name="vehicle_type" onChange={handleChange} className="input">
            <option value="">Vehicle Type</option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
          </select>

          <input name="seats" placeholder="Seats needed / available" onChange={handleChange} className="input" />
          <input name="from" placeholder="From" onChange={handleChange} className="input" />
          <input name="to" placeholder="To" onChange={handleChange} className="input" />
          <input name="morning_time" placeholder="Morning time" onChange={handleChange} className="input" />

          <select name="evening_connect" onChange={handleChange} className="input">
            <option value="">Connect in evening?</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>

          <input name="evening_time" placeholder="Evening time" onChange={handleChange} className="input" />
        </div>

        <textarea
          name="message"
          placeholder="Message for partner"
          onChange={handleChange}
          className="input mt-4 h-24"
        />

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-[#2F5EEA] text-white py-3 rounded-xl font-semibold hover:bg-[#1E3FAE] transition"
        >
          Submit & Continue on WhatsApp
        </button>
      </div>
    </main>
  );
}
