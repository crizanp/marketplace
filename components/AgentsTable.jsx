import React, { useState, useEffect } from "react";
import HomepageTableSkeleton from "./Skeleton/HomepageTable"; // Import Skeleton Component
import Link from "next/link"; // Import Next.js Link for navigation

// Mapping of chain names to their respective logo URLs
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
        // Fetch top 10 agents
        const response = await fetch("/api/getdata?query=top10");
        if (!response.ok) throw new Error("Failed to fetch agents");

        const data = await response.json();

        // Fetch Gekko AI data from DexScreener
        const gekkoResponse = await fetch(
          "https://api.dexscreener.io/latest/dex/tokens/G4YyirkFcHU4Xn6jJ5GyTLv291n3Sxtv8vzJnBM2pump"
        );
        if (!gekkoResponse.ok) throw new Error("Failed to fetch Gekko AI data");

        const gekkoData = await gekkoResponse.json();
        const gekkoMarketData = gekkoData.pairs[0] || {};

        // Define the pinned token
        const pinnedToken = {
          contractAddress: "G4YyirkFcHU4Xn6jJ5GyTLv291n3Sxtv8vzJnBM2pump",
          name: "Gekko AI",
          ticker: "GEKKO",
          chain: "Solana",
          logo: "https://aigekko.vercel.app/D.png", // Replace with actual logo URL
          marketCap: gekkoMarketData.fdv || 1000000, // Use FDV or fallback
          price: gekkoMarketData.priceUsd || "0.12345", // Use price or fallback
          volume24h: gekkoMarketData.volume?.h24 || 0, // Use volume or fallback
          priceChange24h: gekkoMarketData.priceChange?.h24 || 0, // Use price change or fallback
          submittedAt: "3000-01-01", // Custom listed time
        };

        // Ensure pinned token is not duplicated
        const filteredAgents = data.filter(
          (agent) => agent.contractAddress !== pinnedToken.contractAddress
        );

        // Add the pinned token to the top of the list
        setAgents([pinnedToken, ...filteredAgents]);
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, []);

  // Function to format large numbers
  const formatNumber = (num) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  // Function to calculate relative time
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
    <div className="lg:px-10 lg:p-5 pb-5 bg-gray-900 text-gray-100">
      <div className="text-center mb-5">
        <h2 className="text-2xl font-bold text-green-400 pt-4">
          TOP 10 AGENTS
        </h2>
      </div>

      <div className="overflow-x-auto rounded-lg scrollbar-hide">
        <table className="w-full min-w-[900px] border-collapse bg-gray-800 text-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-700 text-green-400 text-left">
              <th className="px-4 py-3 uppercase font-medium text-center">#</th>
              <th className="px-4 py-3 uppercase font-medium">Name</th>
              <th className="px-4 py-3 uppercase font-medium text-left">
                Chain
              </th>
              <th className="px-4 py-3 uppercase font-medium text-center">
                Market Cap
              </th>
              <th className="px-4 py-3 uppercase font-medium text-center">
                24h Volume
              </th>
              <th className="px-4 py-3 uppercase font-medium text-center">
                Price
              </th>
              <th className="px-4 py-3 uppercase font-medium text-center">
                Listed Time
              </th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent, index) => (
              <tr
                key={agent.contractAddress}
                className={`border-b border-gray-700 hover:bg-gray-700 ${
                  agent.contractAddress ===
                  "G4YyirkFcHU4Xn6jJ5GyTLv291n3Sxtv8vzJnBM2pump"
                    ? ""
                    : ""
                }`}
              >
                <td className="px-4 py-3 text-center">{index + 1}</td>

                <td className="px-4 py-3 truncate max-w-xs flex items-center gap-2">
                  <img
                    src={agent.logo || "https://via.placeholder.com/50"}
                    alt="Agent Logo"
                    className="h-6 w-6 rounded-full"
                  />
                  {agent.name} ({agent.ticker})
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        chainLogos[agent.chain.toLowerCase()] ||
                        "https://via.placeholder.com/50"
                      }
                      alt="Chain Logo"
                      className="h-6 w-6 rounded-full"
                    />
                    <span className="whitespace-nowrap">{agent.chain}</span>
                  </div>
                </td>

                <td className="px-4 py-3 text-center">
                  {agent.marketCap.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>

                <td className="px-4 py-3 text-center">
                  {formatNumber(agent.volume24h)}
                </td>

                <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                  {agent.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                  {agent.priceChange24h > 0 ? (
                    <span className="text-green-500">&#9650;</span>
                  ) : agent.priceChange24h < 0 ? (
                    <span className="text-red-500">&#9660;</span>
                  ) : (
                    <span className="text-gray-500">&#8213;</span>
                  )}
                </td>

                <td className="px-4 py-3 text-center">
                  {agent.submittedAt === "3000-01-01"
                    ? "-"
                    : getRelativeTime(agent.submittedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-5">
        <Link
          href="/explorer"
          className="text-green-500 hover:underline font-medium"
        >
          See More
        </Link>
      </div>
    </div>
  );
};

export default AgentsTable;
