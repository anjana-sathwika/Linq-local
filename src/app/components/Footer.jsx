import { FaWhatsapp, FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative bg-[#EEF3FF] pt-20 overflow-hidden mt-24">

      {/* TOP CONTENT */}
      <div className="max-w-7xl mx-auto px-6 pb-32">

        <div className="grid md:grid-cols-4 gap-12">

          {/* LEFT BIG TEXT */}
          <div className="md:col-span-1">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#2F5EEA] leading-tight">
              Ride <br /> together. <br /> Save more.
            </h2>

            <p className="text-gray-600 mt-4">
              Telangana’s trusted ride sharing community.
            </p>

            <div className="flex gap-3 mt-6">
              <a href="#search">
                <button className="bg-[#2F5EEA] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1E3FAE]">
                  Find Ride
                </button>
              </a>

              <a href="/connect/new">
                <button className="bg-white border border-[#2F5EEA] text-[#2F5EEA] px-6 py-3 rounded-full font-semibold">
                  Post Ride
                </button>
              </a>
            </div>
          </div>

          {/* COLUMN 1 */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">For riders</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Find a ride</li>
              <li>Post your route</li>
              <li>Safety</li>
              <li>Community</li>
            </ul>
          </div>

          {/* COLUMN 2 */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Company</h4>
            <ul className="space-y-2 text-gray-600">
              <li>About</li>
              <li>Careers</li>
              <li>Contact</li>
              <li>Privacy</li>
            </ul>
          </div>

          {/* COLUMN 3 */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Connect</h4>

            <div className="flex gap-4 mt-3 text-xl">

              <a
                href="https://whatsapp.com/channel/0029VbAqx8E4SpkCdVRxhf2E"
                target="_blank"
                className="text-green-500"
              >
                <FaWhatsapp />
              </a>

              <a
                href="https://www.linkedin.com/company/gotogetherrides/"
                target="_blank"
                className="text-blue-700"
              >
                <FaLinkedin />
              </a>

              <a
                href="https://www.instagram.com/gotogetherrides"
                target="_blank"
                className="text-pink-500"
              >
                <FaInstagram />
              </a>

              <a
                href="https://x.com/GoTogetherRides"
                target="_blank"
                className="text-blue-400"
              >
                <FaTwitter />
              </a>
            </div>

            <p className="text-gray-500 mt-4 text-sm">
              Follow us for daily ride updates
            </p>
          </div>
        </div>
      </div>

      {/* ILLUSTRATION */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none">
        <img
          src="/footer-ride.png"
          className="w-full object-cover"
        />
      </div>

      {/* BOTTOM BAR */}
      <div className="bg-[#2F5EEA] text-white text-center py-4 text-sm relative z-10">
        © 2025 Go Together Rides • Built for Telangana commuters
      </div>

    </footer>
  );
}
