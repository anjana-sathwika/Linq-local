"use client";

export default function WhyLinq() {
  return (
    <section className="w-full py-28 px-6 bg-[#F7F9FF]">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6 leading-tight">
            Smarter Commutes.
            <span className="text-[#2F5EEA]"> Built on Community.</span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            LinQ connects commuters traveling along the same routes — helping
            them share rides, reduce costs, and commute responsibly with trust,
            safety, and simplicity.
          </p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {[
            ["34,000+", "Trusted commuters"],
            ["8,000+", "Active daily users"],
            ["4.8★", "Average satisfaction"],
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-10 text-center shadow-md hover:shadow-xl transition duration-300"
            >
              <h3 className="text-3xl font-bold text-[#2F5EEA]">{item[0]}</h3>
              <p className="text-gray-600 mt-2">{item[1]}</p>
            </div>
          ))}
        </div>

        {/* FEATURES */}
        <div className="grid md:grid-cols-2 gap-10">

          {[
            {
              title: "Precision Route Matching",
              text: "Match with commuters who travel your exact route and schedule.",
            },
            {
              title: "Transparent Cost Sharing",
              text: "Fair distance-based splits with zero surge pricing or hidden fees.",
            },
            {
              title: "Verified Community",
              text: "Profiles, trust scores, and reviews ensure safe shared rides.",
            },
            {
              title: "Eco-Conscious Travel",
              text: "Reduce congestion and carbon emissions on every commute.",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white p-10 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300 border border-gray-100"
            >
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {card.title}
              </h3>
              <p className="text-gray-600">{card.text}</p>
            </div>
          ))}
        </div>

        {/* PREMIUM CTA */}
        <div className="mt-24 bg-gradient-to-r from-[#2F5EEA] to-[#6A8DFF] rounded-3xl p-16 text-center text-white shadow-xl">
          <h3 className="text-3xl font-semibold mb-4">
            Join the Smarter Commuting Movement
          </h3>

          <p className="max-w-2xl mx-auto mb-8 opacity-90">
            Thousands of commuters are already sharing rides, saving money, and
            building trusted travel communities through LinQ.
          </p>

          <a
            href="/#search"
            className="bg-white text-[#2F5EEA] px-8 py-4 rounded-full font-semibold hover:scale-105 transition inline-block"
          >
            Find a Ride Partner
          </a>
        </div>

      </div>
    </section>
  );
}
