import React from "react";
import { FaRegCopy, FaCheck } from "react-icons/fa";

// Chain Logos Mapping
const chainLogos = {
  polygon: "https://dd.dexscreener.com/ds-data/chains/polygon.png",
  arbitrum: "https://dd.dexscreener.com/ds-data/chains/arbitrum.png",
  hyperliquid: "https://dd.dexscreener.com/ds-data/chains/hyperliquid.png",
  ton: "https://dd.dexscreener.com/ds-data/chains/ton.png",
  pulsechain: "https://dd.dexscreener.com/ds-data/chains/pulsechain.png",
  sui: "https://dd.dexscreener.com/ds-data/chains/sui.png",
  bsc: "https://dd.dexscreener.com/ds-data/chains/bsc.png",
  base: "https://dd.dexscreener.com/ds-data/chains/base.png",
  ethereum: "https://dd.dexscreener.com/ds-data/chains/ethereum.png",
  solana: "https://dd.dexscreener.com/ds-data/chains/solana.png",
};

const TokenInfo = ({ data, copied, copyToClipboard, truncateAddress }) => {
  // Handle missing data gracefully
  const marketCap = data?.marketCap ? `$${data.marketCap}` : "N/A";
  const liquidity = data?.liquidity ? `$${data.liquidity}` : "N/A";
  const volume24h = data?.volume24h ? `$${data.volume24h}` : "N/A";
  const contractAddress = data?.contractAddress || "N/A";
  const chain = data?.chain || "N/A";

  // Get Chain Logo or Fallback to Chain Name
  const chainLogo = chainLogos[chain.toLowerCase()] || null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-white mb-4">Token Info</h2>
      <ul className="space-y-4">
        <li className="flex justify-between items-center border-b border-gray-600 pb-2">
          <span className="text-gray-400">Market Cap:</span>
          <span className="text-gray-200">{marketCap}</span>
        </li>
        <li className="flex justify-between items-center border-b border-gray-600 pb-2">
          <span className="text-gray-400">Liquidity:</span>
          <span className="text-gray-200">{liquidity}</span>
        </li>
        <li className="flex justify-between items-center border-b border-gray-600 pb-2">
          <span className="text-gray-400">24 Hour Volume:</span>
          <span className="text-gray-200">{volume24h}</span>
        </li>
        <li className="flex justify-between items-center border-b border-gray-600 pb-2">
          <span className="text-gray-400">Contract Address:</span>
          <span className="flex items-center gap-2">
            <span className="text-gray-200">
              {truncateAddress(contractAddress)}
            </span>
            {contractAddress !== "N/A" && (
              <button
                onClick={copyToClipboard}
                className="text-green-400 hover:text-green-300 focus:outline-none"
              >
                {copied ? <FaCheck /> : <FaRegCopy />}
              </button>
            )}
          </span>
        </li>
        <li className="flex justify-between items-center border-b border-gray-600 pb-2">
          <span className="text-gray-400">Chain:</span>
          <span className="flex items-center gap-2">
            {chainLogo ? (
              <>
              <img
                src={chainLogo}
                alt={`${chain} logo`}
                className="w-6 h-6"
              /><span className="text-gray-200">
              {chain.charAt(0).toUpperCase() + chain.slice(1).toLowerCase()}
            </span>
            </>
            ) : (
              <span className="text-gray-200">
  {chain.charAt(0).toUpperCase() + chain.slice(1).toLowerCase()}
</span>

            )}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default TokenInfo;
