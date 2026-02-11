"use client";

import { motion } from "framer-motion";

export default function WhyLinqPremium() {
  return (
    <section className="w-full py-28 px-6 bg-[#F7F9FF]">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6">
            Smarter Commutes.
            <span className="text-[#2F5EEA]"> Built on Community.</span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            LinQ connects people traveling the same routes — helping them share
            rides, reduce costs, and commute responsibly with trust and safety.
          </p>
        </motion.div>

        {/* STATS */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-24"
        >
          {[
            ["34,000+", "Trusted commuters"],
            ["8,000+", "Daily active users"],
            ["4.8★", "Average rating"],
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
            >
              <h3 className="text-3xl font-bold text-[#2F5EEA]">{item[0]}</h3>
              <p className="text-gray-600 mt-2">{item[1]}</p>
            </div>
          ))}
        </motion.div>

        {/* FEATURES GRID */}
        <div className="grid md:grid-cols-2 gap-10">

          {[
            {
              title: "Precision Route Matching",
              text: "Match with commuters on the exact same route and schedule.",
            },
            {
              title: "Transparent Cost Sharing",
              text: "Fair distance-based splits. No surge pricing. No hidden fees.",
            },
            {
              title: "Verified Community",
              text: "Profiles, trust scores, and reviews ensure safe rides.",
            },
            {
              title: "Eco-Conscious Travel",
              text: "Reduce congestion and carbon emissions every commute.",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100"
            >
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {card.title}
              </h3>
              <p className="text-gray-600">{card.text}</p>
            </motion.div>
          ))}
        </div>

        {/* PREMIUM BOX */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-24 bg-gradient-to-r from-[#2F5EEA] to-[#6A8DFF] rounded-3xl p-16 text-center text-white shadow-xl"
        >
          <h3 className="text-3xl font-semibold mb-4">
            Join the Smarter Commuting Movement
          </h3>

          <p className="max-w-2xl mx-auto mb-8 opacity-90">
            Thousands of commuters are already sharing rides, saving money, and
            building trusted travel communities.
          </p>

          <a
            href="/#search"
            className="bg-white text-[#2F5EEA] px-8 py-4 rounded-full font-semibold hover:scale-105 transition inline-block"
          >
            Find a Ride Partner
          </a>
        </motion.div>

      </div>
    </section>
  );
}
