import Link from "next/link";
import Image from "next/image";
import {
  FaTwitter,
  FaTelegram,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { AiOutlineHome, AiOutlineFileText } from "react-icons/ai";
import { FiList, FiLock, FiBookOpen } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-white to-[#f0f7f4] text-gray-700 border-t border-green-500 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {/* Logo and About Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/D.png"
              alt="Bull AI Logo"
              width={50}
              height={50}
            />
            <h2 className="text-xl font-semibold text-[#2c7852]">&lt;BullAI/&gt;</h2>
          </div>
          <p className="text-sm leading-relaxed text-gray-600">
            BullAI is your go-to platform for AI agents and a launchpad for
            innovation. Easily explore, list, and integrate powerful AI
            solutions to transform your blockchain projects
          </p>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 gap-6">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-medium text-[#27ae60] mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-2 text-gray-600 hover:text-[#00cc6a] transition-colors duration-200"
                >
                  <AiOutlineHome /> Home
                </Link>
              </li>
              <li>
                <Link
                  href="/explorer"
                  className="flex items-center gap-2 text-gray-600 hover:text-[#00cc6a] transition-colors duration-200"
                >
                  <FiBookOpen /> Explorer
                </Link>
              </li>
              <li>
                <Link
                  href="/list-agent"
                  className="flex items-center gap-2 text-gray-600 hover:text-[#00cc6a] transition-colors duration-200"
                >
                  <FiList /> Launch Token
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="flex items-center gap-2 text-gray-600 hover:text-[#00cc6a] transition-colors duration-200"
                >
                  <FiList /> About
                </Link>
              </li>
              <li>
                <Link
                  href="https://gekkoais-organization.gitbook.io/aigekko.fun-or-usdgekko-ai-marketplace/"
                  className="flex items-center gap-2 text-gray-600 hover:text-[#00cc6a] transition-colors duration-200"
                >
                  <AiOutlineFileText /> Docs
                </Link>
              </li>
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="text-lg font-medium text-[#27ae60] mb-3">
              More Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="https://photon-sol.tinyastro.io/en/lp/B3jpVAXHDmb3PTaFvL4SHhTP6D23qdTLFBEjeTzY24AP?handle=115937696e4eec89665d0c"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#00cc6a] transition-colors duration-200"
                >
                  Photon
                </Link>
              </li>
              <li>
                <Link
                  href="https://dexscreener.com/solana/b3jpvaxhdmb3ptafvl4shhtp6d23qdtlfbejetzy24ap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#00cc6a] transition-colors duration-200"
                >
                  Dexscreener
                </Link>
              </li>
              <li>
                <Link
                  href="https://cryptews.com/solana-meets-ai-why-gekko-ai-is-the-platform-to-watch-in-2025-204329.html"
                  className="text-gray-600 hover:text-[#00cc6a] transition-colors duration-200"
                >
                  Article
                </Link>
              </li>
              <li>
                <Link 
                  href="" 
                  className="text-gray-600 hover:text-[#00cc6a] transition-colors duration-200"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media and Contact */}
        <div>
          <h3 className="text-lg font-medium text-[#27ae60] mb-3">
            Stay Connected
          </h3>
          <div className="flex gap-4 text-lg mb-4">
            <Link
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-[#00cc6a] transition-colors duration-200"
            >
              <FaTwitter />
            </Link>
            <Link
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-[#00cc6a] transition-colors duration-200"
            >
              <FaTelegram />
            </Link>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Contact us at:{" "}
            <Link
              href="mailto:support@aigekko.fun"
              className="text-[#00cc6a] hover:underline"
            >
              support@aigekko.fun
            </Link>
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-200 mt-8 pt-4 text-center text-sm text-gray-500">
        © 2025 BullAI. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;