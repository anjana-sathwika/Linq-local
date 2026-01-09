import { FaWhatsapp, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur border-t border-gray-200 py-3 px-4 md:px-8 text-xs sm:text-sm text-gray-600 z-40">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Social icons */}
        <div className="flex items-center gap-4">
          <a
            href="https://whatsapp.com/channel/0029VbAqx8E4SpkCdVRxhf2E"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-green-600 hover:text-green-700 transition"
            aria-label="WhatsApp"
          >
            <FaWhatsapp className="text-lg" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          <a
            href="https://www.instagram.com/gotogetherrides?igsh=azg0aGp3YnAzZTYy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-pink-500 hover:text-pink-600 transition"
            aria-label="Instagram"
          >
            <FaInstagram className="text-lg" />
            <span className="hidden sm:inline">Instagram</span>
          </a>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <a
            href="https://forms.gle/EK6ScmSd65bBH2X5A"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#2F5EEA] hover:text-[#1E3FAE] transition"
          >
            Join for free
          </a>
          <span className="hidden sm:inline text-gray-300">|</span>
          <a
            href="https://forms.gle/FGmHDfHM8sW3bPVW8"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#D97706] hover:text-[#B45309] transition"
          >
            Sankranti travel form
          </a>
        </div>
      </div>
    </footer>
  );
}
