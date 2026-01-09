import { FaWhatsapp, FaInstagram, FaPhoneAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-[#2f54b3] text-white z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">

          {/* Phone */}
          <a
            href="tel:+919494823941"
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 hover:text-white/80 transition"
            aria-label="Call LinQ"
          >
            <FaPhoneAlt className="text-lg sm:text-base" />
            <span className="font-medium">+91 9494823941</span>
          </a>

          <Divider />

          {/* Instagram */}
          <a
            href="https://www.instagram.com/gotogetherrides"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 hover:text-white/80 transition"
            aria-label="Instagram"
          >
            <FaInstagram className="text-lg" />
            <span className="hidden sm:inline">Instagram</span>
          </a>

          <Divider />

          {/* WhatsApp */}
          <a
            href="https://wa.me/919494823941"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 hover:text-white/80 transition"
            aria-label="WhatsApp"
          >
            <FaWhatsapp className="text-lg" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          <Divider />

          {/* Join Now */}
          <a
            href="#join"
            className="font-semibold px-3 py-1 rounded-md bg-white text-[#2f54b3] hover:bg-white/90 transition"
          >
            Join Now
          </a>

          <Divider />

          {/* Sankranti Form */}
          <a
            href="https://forms.gle/FGmHDfHM8sW3bPVW8"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:text-white/80 transition"
          >
            Sankranti Form
          </a>

        </div>
      </div>
    </footer>
  );
}

/* Divider Component */
function Divider() {
  return <span className="hidden sm:inline h-5 w-px bg-white/30" />;
}
