import Link from "next/link";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import { useWallet } from "@solana/wallet-adapter-react";
import { FaHome, FaCompass, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

// Dynamically load WalletMultiButton
const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then((mod) => {
      const OriginalButton = mod.WalletMultiButton;
      return function CustomWalletMultiButton(props) {
        return <OriginalButton {...props}>Connect Wallet</OriginalButton>;
      };
    }),
  { ssr: false }
);

const Navbar = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { connected, publicKey, disconnect } = useWallet();

  useEffect(() => {
    const walletAddress = Cookies.get("walletAddress");
    if (walletAddress) {
      setIsSignedIn(true);
    }
  }, []);

  useEffect(() => {
    // Close mobile menu when clicking outside
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('nav')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleSignOut = () => {
    disconnect();
    Cookies.remove("walletAddress");
    setIsSignedIn(false);
    setIsMobileMenuOpen(false);
  };

  const NavigationLinks = () => (
    <>
      <Link 
        href="/" 
        className="flex items-center gap-2 text-gray-700 hover:text-[#0d9050] transition-colors"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <FaHome className="text-[#27ae60]" />
        <span className="font-medium">Home</span>
      </Link>
      <Link 
        href="/explorer" 
        className="flex items-center gap-2 text-gray-700 hover:text-[#0d9050] transition-colors"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <FaCompass className="text-[#27ae60]" />
        <span className="font-medium">Explorer</span>
      </Link>
    </>
  );

  const WalletButton = () => (
    <>
      {connected ? (
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 border-2 border-[#27ae60] rounded-lg text-[#27ae60] hover:bg-[#27ae60] hover:text-white transition-colors font-semibold w-full md:w-auto justify-center md:justify-start"
        >
          <FaSignOutAlt />
          <span>Disconnect Wallet</span>
        </button>
      ) : (
        <WalletMultiButton className="px-4 py-2 border-2 border-[#27ae60] rounded-lg text-[#27ae60] hover:bg-[#27ae60] hover:text-white transition-colors font-semibold bg-white w-full md:w-auto flex justify-center" />
      )}
    </>
  );

  return (
    <nav className="relative bg-white ">
      <div className="h-16 px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="h-12">
          <img
            src="/D.png"
            alt="Gekko AI Logo"
            className="h-full w-auto"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8">
          <NavigationLinks />
        </div>

        {/* Desktop Wallet Button */}
        <div className="hidden md:block">
          <WalletButton />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#27ae60] p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`absolute top-16 left-0 right-0 bg-white border-b border-[#00af5a] md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-4">
            <NavigationLinks />
          </div>
          <div className="pt-2 border-t border-gray-200">
            <WalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;