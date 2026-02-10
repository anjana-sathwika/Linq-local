"use client";

export default function WhyLinq() {
  return (
    <section className="w-full py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto text-center">

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          One Local Link. Real Local Connections.
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          LinQ helps you connect with trusted people around you — tutors,
          services, and local needs — without messy WhatsApp groups or spam.
        </p>

        {/* Main points */}
        <div className="grid md:grid-cols-3 gap-8 text-left">

          <div className="p-6 border rounded-2xl">
            <h3 className="font-semibold text-lg mb-2">Post Needs Instantly</h3>
            <p className="text-gray-600 text-sm">
              Parents or users can post requirements in seconds and get matched
              with relevant local people.
            </p>
          </div>

          <div className="p-6 border rounded-2xl">
            <h3 className="font-semibold text-lg mb-2">Verified Local Profiles</h3>
            <p className="text-gray-600 text-sm">
              Tutors and service providers create profiles so people nearby can
              find and trust them easily.
            </p>
          </div>

          <div className="p-6 border rounded-2xl">
            <h3 className="font-semibold text-lg mb-2">No Spam. No Noise.</h3>
            <p className="text-gray-600 text-sm">
              Unlike WhatsApp groups, LinQ keeps things clean, relevant and
              organized.
            </p>
          </div>

        </div>

        {/* Difference bar */}
        <div className="mt-16 bg-gray-50 p-8 rounded-2xl">
          <h3 className="text-xl font-semibold mb-3">
            Why not just use WhatsApp groups?
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Messages get lost. Spam increases. Trust is unclear.  
            LinQ organizes local needs into one simple system where the right
            people connect faster.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12">
          <a
            href="/connect"
            className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:opacity-90 transition"
          >
            Start Connecting Locally
          </a>
        </div>

      </div>
    </section>
  );
}
