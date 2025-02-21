import { useState, useEffect } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { FaWallet, FaSignOutAlt } from "react-icons/fa";

const WalletButton = () => {
  const { connected, disconnect, publicKey } = useWallet();
  const [isHovered, setIsHovered] = useState(false);
  const [shortAddress, setShortAddress] = useState('');

  useEffect(() => {
    if (publicKey) {
      const address = publicKey.toString();
      setShortAddress(`${address.slice(0, 4)}...${address.slice(-4)}`);
    }
  }, [publicKey]);

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <div className="relative">
      {connected ? (
        <button
          onClick={handleDisconnect}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="wallet-button-connected group"
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 transition-opacity duration-200">
              {isHovered ? (
                <>
                  <FaSignOutAlt className="text-sm transition-colors" />
                  <span className="text-sm font-medium">Disconnect</span>
                </>
              ) : (
                <>
                  <FaWallet className="text-sm" />
                  <span className="text-sm font-medium">{shortAddress}</span>
                </>
              )}
            </div>
          </div>
        </button>
      ) : (
        <button className="wallet-button-connect">
          <FaWallet className="text-sm" />
          <span className="text-sm font-medium">Connect Wallet</span>
        </button>
      )}

      <style jsx>{`
        .wallet-button-connected {
          display: flex;
          align-items: center;
          padding: 0.5rem 1rem;
          background-color: white;
          border: 1.5px solid #27ae60;
          color: #27ae60;
          border-radius: 0.5rem;
          font-weight: 500;
          transition: all 200ms ease;
          min-width: 160px;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .wallet-button-connected:hover {
          background-color: #dc2626;
          border-color: #dc2626;
          color: white;
        }

        .wallet-button-connect {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background-color: #27ae60;
          border: 1.5px solid #27ae60;
          color: white;
          border-radius: 0.5rem;
          font-weight: 500;
          transition: all 200ms ease;
          min-width: 160px;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(39, 174, 96, 0.1);
        }

        .wallet-button-connect:hover {
          background-color: #219653;
          border-color: #219653;
          box-shadow: 0 4px 6px rgba(39, 174, 96, 0.15);
          transform: translateY(-1px);
        }

        .wallet-button-connected:focus,
        .wallet-button-connect:focus {
          outline: none;
          ring: 2px;
          ring-offset: 2px;
          ring-color: #27ae60;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default WalletButton;