import React, { useState, useEffect } from "react";
import HomepageTableSkeleton from "./Skeleton/HomepageTable";
import Link from "next/link";

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

const AgentsTable = () => {
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoading(true);

      try {
        const response = await fetch("/api/getdata?query=top10");
        if (!response.ok) throw new Error("Failed to fetch agents");
        
        const data = await response.json();
        setAgents(data);
      } catch (error) {
        console.error("Error fetching agents:", error);
        setAgents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const formatNumber = (num) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const submitted = new Date(date);
    const diff = now - submitted;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
    return `${years} year${years > 1 ? "s" : ""} ago`;
  };

  if (isLoading) {
    return <HomepageTableSkeleton />;
  }

  return (
    <div className="lg:px-10 lg:p-5 pb-5 bg-gradient-to-r from-white to-[#f0f7f4] border-t border-green-500 text-gray-800">
      <div className="text-center mb-5">
        <h2 className="text-2xl font-bold text-[rgb(25 146 88)] pt-4">
          Featured AGENTS
        </h2>
      </div>

      <div className="overflow-x-auto rounded-lg scrollbar-hide shadow-lg">
        <table className="w-full min-w-[900px] border-collapse bg-white text-gray-700 text-sm">
          <thead>
            <tr className="border-b border-[#e6f3ed] text-[#00cc6a]">
              <th className="px-4 py-3 uppercase font-medium text-center">#</th>
              <th className="px-4 py-3 uppercase font-medium">Name</th>
              <th className="px-4 py-3 uppercase font-medium text-left">Chain</th>
              <th className="px-4 py-3 uppercase font-medium text-center">Market Cap</th>
              <th className="px-4 py-3 uppercase font-medium text-center">24h Volume</th>
              <th className="px-4 py-3 uppercase font-medium text-center">Price</th>
              <th className="px-4 py-3 uppercase font-medium text-center">Listed Time</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent, index) => (
              <tr
                key={agent.contractAddress}
                className="border-b border-[#e6f3ed] hover:bg-[#f0f7f4] transition-colors duration-200"
              >
                <td className="px-4 py-3 text-center">{index + 1}</td>
                <td className="px-4 py-3 truncate max-w-xs flex items-center gap-2">
                  <img
                    src={agent.logo || "https://via.placeholder.com/50"}
                    alt="Agent Logo"
                    className="h-6 w-6 rounded-full"
                  />
                  <span className="font-medium">{agent.name}</span>
                  <span className="text-gray-500">({agent.ticker})</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={chainLogos[agent.chain.toLowerCase()] || "https://via.placeholder.com/50"}
                      alt="Chain Logo"
                      className="h-6 w-6 rounded-full"
                    />
                    <span className="whitespace-nowrap">{agent.chain}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center font-medium">
                  {agent.marketCap.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>
                <td className="px-4 py-3 text-center">
                  {formatNumber(agent.volume24h)}
                </td>
                <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                  <span className="font-medium">
                    {agent.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </span>
                  {agent.priceChange24h > 0 ? (
                    <span className="text-[#00cc6a]">▲</span>
                  ) : agent.priceChange24h < 0 ? (
                    <span className="text-red-500">▼</span>
                  ) : (
                    <span className="text-gray-400">―</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center text-gray-500">
                  {getRelativeTime(agent.submittedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-5">
        <Link 
          href="/explorer" 
          className="text-[#00cc6a] hover:text-[#00a857] font-medium transition-colors duration-200 inline-flex items-center gap-2"
        >
          See More
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default AgentsTable;