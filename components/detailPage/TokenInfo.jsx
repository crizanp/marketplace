import React from "react";
import { FaRegCopy, FaCheck, FaExternalLinkAlt } from "react-icons/fa";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";

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

const getSwapLink = (chain, contractAddress) => {
  const chainLower = chain.toLowerCase();
  switch (chainLower) {
    case 'solana':
      return `https://raydium.io/swap/?inputMint=sol&outputMint=${contractAddress}`;
    case 'base':
      return `https://baseswap.fi/swap?outputMint=${contractAddress}`;
    case 'bsc':
      return `https://pancakeswap.finance/swap?outputMint=${contractAddress}`;
    case 'ethereum':
      return `https://app.uniswap.org/#/swap?outputMint=${contractAddress}`;
    case 'polygon':
      return `https://quickswap.exchange/#/swap?outputMint=${contractAddress}`;
    case 'arbitrum':
      return `https://app.camelot.exchange/?outputMint=${contractAddress}`;
    default:
      return null;
  }
};

const TokenInfo = ({ data, copied, copyToClipboard, truncateAddress }) => {
  const marketCap = data?.marketCap ? `$${data.marketCap}` : "N/A";
  const liquidity = data?.liquidity ? `$${data.liquidity}` : "N/A";
  const volume24h = data?.volume24h ? `$${data.volume24h}` : "N/A";
  const contractAddress = data?.contractAddress || "N/A";
  const chain = data?.chain || "N/A";
  const tokenName = data?.name || "Token";
  const tokenSymbol = data?.ticker || "TKN";
  
  const chainLogo = chainLogos[chain.toLowerCase()] || null;
  const swapLink = getSwapLink(chain, contractAddress);
  
  return (
    <div className="mt-6">
      {/* Swap Button */}
      <div className="mb-6">
        {swapLink ? (
          <a 
            href={swapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg shadow-md transition-all duration-300 font-medium
              bg-gradient-to-r from-green-300 to-green-400 text-gray-700 hover:from-green-600 hover:to-green-500"
          >
            <HiOutlineSwitchHorizontal className="text-xl animate-pulse" />
            <span>Swap on {chain.charAt(0).toUpperCase() + chain.slice(1).toLowerCase()}</span>
            <FaExternalLinkAlt className="text-sm ml-1" />
            <img 
              src={data?.logo || chainLogo || "/default-token-icon.png"} 
              alt={`${tokenName} logo`} 
              className="w-6 h-6 rounded-full ml-1"
            />
          </a>
        ) : (
          <button 
            disabled
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg shadow-md transition-all duration-300 font-medium
              bg-gray-300 text-gray-500 cursor-not-allowed"
          >
            <HiOutlineSwitchHorizontal className="text-xl" />
            <span>Swap not available on this chain</span>
            <img 
              src={data?.logo || chainLogo || "/default-token-icon.png"} 
              alt={`${tokenName} logo`} 
              className="w-6 h-6 rounded-full ml-1"
            />
          </button>
        )}
      </div>
      
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Token Info</h2>
      
      <ul className="space-y-4">
        <li className="flex justify-between items-center border-b border-gray-200 pb-3">
          <span className="text-gray-600">Market Cap:</span>
          <span className="text-gray-800 font-medium">{marketCap}</span>
        </li>
        <li className="flex justify-between items-center border-b border-gray-200 pb-3">
          <span className="text-gray-600">Liquidity:</span>
          <span className="text-gray-800 font-medium">{liquidity}</span>
        </li>
        <li className="flex justify-between items-center border-b border-gray-200 pb-3">
          <span className="text-gray-600">24 Hour Volume:</span>
          <span className="text-gray-800 font-medium">{volume24h}</span>
        </li>
        <li className="flex justify-between items-center border-b border-gray-200 pb-3">
          <span className="text-gray-600">Contract Address:</span>
          <span className="flex items-center gap-2">
            <span className="text-gray-800 font-medium">
              {truncateAddress(contractAddress)}
            </span>
            {contractAddress !== "N/A" && (
              <button
                onClick={copyToClipboard}
                className="text-green-600 hover:text-green-500 focus:outline-none"
                aria-label={copied ? "Copied" : "Copy to clipboard"}
              >
                {copied ? <FaCheck /> : <FaRegCopy />}
              </button>
            )}
          </span>
        </li>
        <li className="flex justify-between items-center border-b border-gray-200 pb-3">
          <span className="text-gray-600">Chain:</span>
          <span className="flex items-center gap-2">
            {chainLogo ? (
              <>
                <img
                  src={chainLogo}
                  alt={`${chain} logo`}
                  className="w-6 h-6"
                />
                <span className="text-gray-800 font-medium">
                  {chain.charAt(0).toUpperCase() + chain.slice(1).toLowerCase()}
                </span>
              </>
            ) : (
              <span className="text-gray-800 font-medium">
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