import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-6 md:px-2 bg-white pt-8 md:pt-24">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,233,255,0.06),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(0,230,118,0.06),transparent_40%)] pointer-events-none"></div>

      <div className="z-10 text-center flex flex-col items-center">
        {/* Eyebrow */}
        <p className="text-sm sm:text-base font-semibold tracking-wide text-[#2F5EEA] uppercase mb-3">
          Stop Riding Alone.
        </p>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold max-w-xl sm:max-w-3xl leading-tight text-gray-900 text-center mx-auto">
          Find Your Daily Ride Partner <br />
          <span className="text-[#2F5EEA]">in Telangana</span>
        </h1>

        {/* Subtext */}
        <p className="mt-4 sm:mt-6 text-gray-600 max-w-md sm:max-w-2xl mx-auto text-base sm:text-lg">
          Split fuel. Beat traffic. Meet trusted commuters like you.
          <br className="hidden sm:block" />
          Already{" "}
          <span className="text-[#2F5EEA] font-semibold">
            35,000+ people
          </span>{" "}
          are riding smarter every day.
        </p>

        {/* CTAs */}
        <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Primary CTA */}
          <Link href="/search" className="w-full sm:w-auto">
            <button className="w-full bg-[#2F5EEA] text-white font-semibold px-10 py-4 rounded-full hover:bg-[#1E3FAE] transition text-base sm:text-lg shadow-md hover:shadow-lg">
              Match My Ride 🚀
            </button>
          </Link>

          {/* Secondary CTA */}
          <Link href="/post-ride" className="w-full sm:w-auto">
            <button className="w-full border-2 border-[#2F5EEA] text-[#2F5EEA] font-semibold px-10 py-4 rounded-full hover:bg-[#2F5EEA] hover:text-white transition text-base sm:text-lg">
              Offer a Ride
            </button>
          </Link>
        </div>

        {/* Trust line */}
        <p className="mt-4 text-sm sm:text-md text-gray-500 max-w-xs sm:max-w-full mx-auto px-2">
          Free to join • Verified users • No commission • No app needed
        </p>
      </div>
    </section>
  );
}
