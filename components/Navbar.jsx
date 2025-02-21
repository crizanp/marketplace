import Link from "next/link";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import { useWallet } from "@solana/wallet-adapter-react";
import { FaHome, FaCompass, FaSignOutAlt } from "react-icons/fa";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then((mod) => {
      const OriginalButton = mod.WalletMultiButton;
      return function CustomWalletMultiButton(props) {
        const [isHovered, setIsHovered] = useState(false);

        return (
          <div className="custom-wallet-wrapper">
            <OriginalButton
              {...props}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`custom-wallet-button ${isHovered ? "hovered" : ""}`}
            />

            <style jsx global>{`
              /* Base modal styles */
              .wallet-adapter-modal-wrapper {
  background: rgb(184, 241, 228) !important;
  backdrop-filter: blur(10px) !important;
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  width: 100% !important;
  min-height: min-content !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 1000 !important;
  padding: 24px !important;
}

.wallet-adapter-modal {
  position: relative !important;
  background: #ffffff !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  max-width: 400px !important;
  width: 90% !important;
  max-height: min(600px, 90vh) !important;
  padding: 24px !important;
  overflow-y: auto !important;
}
.wallet-adapter-button-start-icon {
  margin-right: 8px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.wallet-adapter-button-start-icon img {
  width: 24px !important;
  height: 24px !important;
  border-radius: 50% !important;
}

.wallet-adapter-button span {
  flex: 1 !important;
  text-align: left !important;
}

/* Add margin between wallet name and "Detected" text */
.wallet-adapter-button span:last-child {
  color: rgba(255, 255, 255, 0.8) !important;
  font-size: 0.75rem !important;
  margin-left: 8px !important; /* Added spacing */
}
.wallet-adapter-modal-button-close {
  position: absolute !important;
  top: 16px !important;
  right: 16px !important;
  background: transparent !important;
  border: none !important;
  cursor: pointer !important;
  padding: 8px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 50% !important;
  transition: background 200ms !important;
}

.wallet-adapter-modal-button-close:hover {
  background: #f5f5f5 !important;
}

.wallet-adapter-modal-button-close svg {
  width: 14px !important;
  height: 14px !important;
  fill: #666666 !important;
}

.wallet-adapter-modal-title {
  font-size: 1.25rem !important;
  font-weight: 600 !important;
  color: #333333 !important;
  margin-bottom: 16px !important;
  text-align: center !important;
  padding-right: 24px !important; /* Space for close button */
}

.wallet-adapter-modal-list {
  list-style: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

.wallet-adapter-modal-list li {
  margin-bottom: 8px !important;
}
              .wallet-adapter-button {
                width: 100% !important;
                background: #27ae60 !important;
                color: white !important;
                border: none !important;
                height: 35px !important;

                border-radius: 8px !important;
                padding: 7px 16px !important;
                font-size: 0.875rem !important;
                font-weight: 500 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: flex-start !important;
                cursor: pointer !important;
                transition: background 200ms !important;
              }

              .wallet-adapter-button:hover {
                background: #1e8449 !important;
              }

              .wallet-adapter-button-start-icon {
                margin-right: 8px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
              }

              .wallet-adapter-button-start-icon img {
                width: 24px !important;
                height: 24px !important;
                border-radius: 50% !important;
              }

              .wallet-adapter-button span {
                flex: 1 !important;
                text-align: left !important;
              }

              .wallet-adapter-button span:last-child {
                color: rgba(255, 255, 255, 0.8) !important;
                font-size: 0.75rem !important;
              }

              .wallet-adapter-modal-list-more {
                width: 100% !important;
                background: transparent !important;
                border: 1px solid #27ae60 !important;
                color: #27ae60 !important;
                border-radius: 8px !important;
                padding: 12px 16px !important;
                font-size: 0.875rem !important;
                font-weight: 500 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                transition: all 200ms !important;
                margin-top: 8px !important;
              }

              .wallet-adapter-modal-list-more:hover {
                background: #27ae60 !important;
                color: white !important;
              }

              .wallet-adapter-modal-list-more svg {
                margin-left: 8px !important;
                width: 12px !important;
                height: 12px !important;
                fill: currentColor !important;
                transition: transform 200ms !important;
              }

              .wallet-adapter-modal-list-more[aria-expanded="true"] svg {
                transform: rotate(180deg) !important;
              }

              .wallet-adapter-collapse {
                transition: height 250ms ease-out !important;
                overflow: hidden !important;
              }
            `}</style>
          </div>
        );
      };
    }),
  { ssr: false }
);

const Navbar = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { connected, disconnect } = useWallet();

  useEffect(() => {
    const walletAddress = Cookies.get("walletAddress");
    if (walletAddress) {
      setIsSignedIn(true);
    }
  }, []);

  const handleSignOut = () => {
    disconnect();
    Cookies.remove("walletAddress");
    setIsSignedIn(false);
  };

  const NavigationLinks = () => (
    <>
      <Link href="/" className="nav-link group">
        <div className="flex items-center gap-2">
          <FaHome className="text-[#27ae60] group-hover:text-[#1e8449] text-sm" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-[#1e8449]">Home</span>
        </div>
      </Link>
      <Link href="/explorer" className="nav-link group">
        <div className="flex items-center gap-2">
          <FaCompass className="text-[#27ae60] group-hover:text-[#1e8449] text-sm" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-[#1e8449]">Explorer</span>
        </div>
      </Link>
    </>
  );

  return (
    <nav className="bg-white border-b border-[#27ae60]/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="h-12 flex items-center justify-between border-b border-[#27ae60]/10">
            <div className="flex-shrink-0">
              <img src="/D.png" alt="Logo" className="h-8 w-auto" />
            </div>
            <div>
              {connected ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#27ae60] text-white rounded-md hover:bg-[#1e8449] transition-colors"
                >
                  <FaSignOutAlt className="text-sm" />
                  <span className="text-sm">Disconnect</span>
                </button>
              ) : (
                <WalletMultiButton />
              )}
            </div>
          </div>
          <div className="h-10 flex items-center justify-center">
            <div className="flex items-center gap-6">
              <NavigationLinks />
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex h-14 items-center justify-between">
          <div className="flex items-center gap-8">
            <img src="/D.png" alt="Logo" className="h-10 w-auto" />
            
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-6">
              <NavigationLinks />
            </div>
          </div>
          <div>
            {connected ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#27ae60] text-white rounded-md hover:bg-[#1e8449] transition-colors"
              >
                <FaSignOutAlt className="text-sm" />
                <span className="text-sm">Disconnect</span>
              </button>
            ) : (
              <WalletMultiButton />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;