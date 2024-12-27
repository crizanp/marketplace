import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

const CustomWalletModal = ({ isOpen, onClose }) => {
  const wallet = useWallet();

  const connectPhantom = async () => {
    try {
      const phantomWallet = new PhantomWalletAdapter();
      await phantomWallet.connect();
      console.log(`Wallet connected: ${phantomWallet.publicKey}`);
      onClose(); // Close modal after connecting
    } catch (error) {
      console.error("Error connecting Phantom wallet:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Connect a Wallet</h2>
        <button
          onClick={connectPhantom}
          className="bg-purple-600 w-full py-2 rounded-lg hover:bg-purple-500 transition"
        >
          Connect Phantom Wallet
        </button>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-600 py-2 rounded-lg hover:bg-red-500 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CustomWalletModal;
