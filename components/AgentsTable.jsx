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
    // Fetch data from API
    const fetchAgents = async () => {
      try {
        const response = await fetch("/api/getdata?query=top10");
        if (!response.ok) {
          throw new Error("Failed to fetch agents");
        }
        const data = await response.json();

        // Sort by market cap in descending order and select the top 10
        const sortedAgents = data
          .sort((a, b) => b.marketCap - a.marketCap)
          .slice(0, 10);

        setAgents(sortedAgents);
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, []);

  // Function to calculate relative time
  const getRelativeTime = (date) => {
    const now = new Date();
    const submitted = new Date(date);
    const diff = now - submitted; // Difference in milliseconds

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
      {/* Centered Heading */}
      <div className="text-center mb-5">
        <h2 className="text-2xl font-bold text-green-400">TOP 10 AGENTS</h2>
      </div>

      {/* Agents Table */}
      <div className="overflow-x-auto rounded-lg scrollbar-hide">
        <table className="w-full min-w-[900px] border-collapse bg-gray-800 text-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-700 text-green-400 text-left">
              <th className="px-4 py-3 uppercase font-medium text-center">#</th>
              <th className="px-4 py-3 uppercase font-medium ">Name</th>
              <th className="px-4 py-3 uppercase font-medium text-left">
                Chain
              </th>
              <th className="px-4 py-3 uppercase font-medium text-center">
                Market Cap
              </th>
              <th className="px-4 py-3 uppercase font-medium text-center">
                Listed Time
              </th>
              <th className="px-4 py-3 uppercase font-medium text-center">
                Price
              </th>
              <th className="px-4 py-3 uppercase font-medium text-center">
                Upvotes
              </th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent, index) => (
              <tr
                key={agent._id}
                className="border-b border-gray-700 hover:bg-gray-700"
              >
                {/* Index */}
                <td className="px-4 py-3 text-center">{index + 1}</td>

                {/* Name */}
                <td className="px-4 py-3 truncate max-w-xs flex items-center gap-2">
                  <img
                    src={
                      agent.logo ||
                      "https://cryptologos.cc/logos/solana-sol-logo.png"
                    }
                    alt="Agent Logo"
                    className="h-6 w-6 rounded-full"
                  />
                  {agent.name} ({agent.ticker})
                </td>

                {/* Chain */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        chainLogos[agent.chain.toLowerCase()] ||
                        "https://cryptologos.cc/logos/solana-sol-logo.png"
                      }
                      alt="Chain Logo"
                      className="h-6 w-6 rounded-full"
                    />
                    <span className="whitespace-nowrap">{agent.chain}</span>
                  </div>
                </td>

                {/* Market Cap */}
                <td className="px-4 py-3 text-center">
                  {agent.marketCap.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>

                {/* Listed Time */}
                <td className="px-4 py-3 text-center">
                  {getRelativeTime(agent.submittedAt)}
                </td>

                {/* Price */}
                <td className="px-4 py-3 text-center">
                  {parseFloat(agent.price).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>

                {/* Upvotes */}
                <td className="px-4 py-3 text-center">
                  {/* Dummy Upvotes */}
                  {Math.floor(Math.random() * 1000)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* See More Link */}
      <div className="text-center mt-5">
        <Link href="/explorer"className="text-green-500 hover:underline font-medium">
            See More
        </Link>
      </div>
    </div>
  );
};

export default AgentsTable;
