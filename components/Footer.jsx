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
    <footer className="bg-gray-900 text-white border-t border-green-500 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {/* Logo and About Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="https://aigekko.vercel.app/D.png"
              alt="Gekko AI Logo"
              width={50}
              height={50}
            />
            <h2 className="text-xl font-semibold">&lt;GekkoAI/&gt;</h2>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            GekkoAI is your one-stop marketplace for AI agents. Explore, list,
            and integrate advanced AI solutions seamlessly.
          </p>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 gap-6">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-medium text-green-400 mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-2 hover:text-green-400"
                >
                  <AiOutlineHome /> Home
                </Link>
              </li>
              <li>
                <Link
                  href="/explorer"
                  className="flex items-center gap-2 hover:text-green-400"
                >
                  <FiBookOpen /> Explorer
                </Link>
              </li>
              <li>
                <Link
                  href="/list-agent"
                  className="flex items-center gap-2 hover:text-green-400"
                >
                  <FiList /> Launch Token
                </Link>
              </li>
              <li>
                <Link
                  href="https://gekkoais-organization.gitbook.io/aigekko.fun-or-usdgekko-ai-marketplace/"
                  className="flex items-center gap-2 hover:text-green-400"
                >
                  <AiOutlineFileText /> Docs
                </Link>
              </li>
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="text-lg font-medium text-green-400 mb-3">
              More Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="https://photon-sol.tinyastro.io/en/lp/B3jpVAXHDmb3PTaFvL4SHhTP6D23qdTLFBEjeTzY24AP?handle=115937696e4eec89665d0c"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400"
                >
                  Photon
                </Link>
              </li>
              <li>
                <Link
                  href="https://dexscreener.com/solana/b3jpvaxhdmb3ptafvl4shhtp6d23qdtlfbejetzy24ap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400"
                >
                  Dexscreener
                </Link>
              </li>
              <li>
                <Link
                  href="https://cryptews.com/solana-meets-ai-why-gekko-ai-is-the-platform-to-watch-in-2025-204329.html"
                  className="hover:text-green-400"
                >
                  Article
                </Link>
              </li>
              <li>
                <Link href="" className="hover:text-green-400">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media and Contact */}
        <div>
          <h3 className="text-lg font-medium text-green-400 mb-3">
            Stay Connected
          </h3>
          <div className="flex gap-4 text-lg mb-4">
            <Link
              href="https://x.com/gekkoai_agent"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400"
            >
              <FaTwitter />
            </Link>
            <Link
              href="https://t.me/gekkoai_agent"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400"
            >
              <FaTelegram />
            </Link>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Contact us at:{" "}
            <Link
              href="mailto:support@aigekko.fun"
              className="text-green-400 hover:underline"
            >
              support@aigekko.fun
            </Link>
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-500 mt-8 pt-4 text-center text-sm text-gray-500">
        © 2025 GekkoAI. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
