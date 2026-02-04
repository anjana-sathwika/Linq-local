import Link from "next/link";

export default function Content() {
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
        </svg>
      ),
      title: "Smart Matching",
      description: "Find commuters who match your exact route and timing — no noise, no spam."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Eco-friendly Commute",
      description: "Reduce traffic and emissions by sharing rides with people already on your route."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2" />
        </svg>
      ),
      title: "Fair Cost Sharing",
      description: "Split fuel costs transparently and commute affordably without hidden charges."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
        </svg>
      ),
      title: "Trusted Community",
      description: "Verified profiles, gender visibility, and controlled connections for safety."
    }
  ];

  return (
    <section className="relative py-10 md:py-24 px-6 md:px-12 bg-white text-gray-900 overflow-hidden">
      {/* decorative gradient */}
      <div className="pointer-events-none absolute -right-12 md:-right-24 -top-16 w-72 h-72 rounded-full bg-[#5FA9FF]/10 blur-3xl" />

      <div className="max-w-6xl mx-auto relative">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
          {/* Left content */}
          <div className="lg:w-1/2 z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-700 leading-tight mb-4">
              What is <span className="text-[#2F5EEA]">LinQ</span>?
            </h2>

            <p className="text-lg text-gray-600 mb-6">
              LinQ is a community-first commute platform that helps people
              connect, share rides, reduce costs, and travel safer together —
              every day.
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm">
                <strong className="block text-sm text-gray-800">34K+</strong>
                <span className="text-xs text-gray-500">followers</span>
              </div>
              <div className="px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm">
                <strong className="block text-sm text-gray-800">8K+</strong>
                <span className="text-xs text-gray-500">daily users</span>
              </div>
              <div className="px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm">
                <strong className="block text-sm text-gray-800">4.8★</strong>
                <span className="text-xs text-gray-500">avg rating</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 mb-8">
              {features.slice(0, 2).map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#2F5EEA] text-white">
                    {f.icon}
                  </span>
                  <div>
                    <div className="text-gray-800 font-medium">{f.title}</div>
                    <div className="text-gray-500 text-sm">{f.description}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link href="/search">
              <button className="bg-[#2F5EEA] text-white px-7 py-3 rounded-full font-semibold shadow-lg hover:bg-[#1E3FAE] transition">
                FIND A RIDE PARTNER
              </button>
            </Link>
          </div>

          {/* Right cards */}
          <div className="lg:w-1/2 w-full relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index}>
                  <div className="p-5 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#2F5EEA] text-white mb-3">
                      {feature.icon}
                    </div>
                    <h4 className="font-semibold mb-1 text-gray-900">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute -left-2 sm:-left-6 -top-6 bg-[#2F5EEA] text-white px-4 py-2 rounded-xl shadow-xl text-sm font-medium">
              Community-first mobility
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
