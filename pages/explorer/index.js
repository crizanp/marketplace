import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomepageTableSkeleton from "../../components/Skeleton/HomepageTable"; // Import Skeleton Component
import ExplorerSkeleton from "@/components/Skeleton/ExplorerSkeleton";

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

// Relative Time Calculation
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

const Explorer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("listedTime"); // Default sort by listedTime
  const [agents, setAgents] = useState([]); // Original data
  const [filteredAgents, setFilteredAgents] = useState([]); // Filtered data for display
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [showMessage, setShowMessage] = useState(false); // Floating message state

  const router = useRouter();

  useEffect(() => {
    // Fetch agents data from the API
    const fetchAgents = async () => {
      try {
        const response = await fetch("/api/getdata?query=approved");
        if (!response.ok) {
          throw new Error("Failed to fetch agents");
        }
        const data = await response.json();
        setAgents(data);
        setFilteredAgents(data);
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchAgents();
  }, []);

  const sortAgents = (a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "marketCap":
        return b.marketCap - a.marketCap;
      case "listedTime":
        return new Date(b.submittedAt) - new Date(a.submittedAt); // Sort by most recently listed
      case "upvotes":
        return b.upvotes - a.upvotes;
      default:
        return 0;
    }
  };

  const displayedAgents = filteredAgents
    .filter((agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort(sortAgents);

  const totalPages = Math.ceil(displayedAgents.length / itemsPerPage);
  const paginatedAgents = displayedAgents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleViewDetails = (contractAddress) => {
    if (contractAddress) {
      router.push(`/coins/${contractAddress}`);
    } else {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
  };

  const handleChainFilter = (selectedChain) => {
    if (selectedChain) {
      setFilteredAgents(
        agents.filter((agent) =>
          agent.chain?.toLowerCase().includes(selectedChain.toLowerCase())
        )
      );
    } else {
      setFilteredAgents(agents); // Reset to all agents if "All" is selected
    }
  };

  const trendingAgents = [...agents]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 8);
  if (isLoading) {
    // Render the skeleton loader when loading
    return (
      <ExplorerSkeleton />
    );
  }

  return (
    <>
      <Navbar />
      {showMessage && (
        <div className="fixed top-0 left-0 w-full bg-green-700 text-white py-3 text-center shadow-lg z-50 animate-slideIn">
          Full version will be released on Jan 1, this is just a prototype.
        </div>
      )}
      <div className="lg:px-10 p-0 bg-gray-900 text-gray-100 overflow-x-hidden">
        {/* Trending Agents */}
        <div className="flex gap-4 my-5 py-2 mx-4 overflow-x-auto scrollbar-hide sm:justify-center">
          {trendingAgents.map((agent, index) => (
            <div
              key={agent._id}
              className="relative flex flex-col items-center bg-gray-800 rounded-lg w-20 h-20 text-center gap-2 p-2 shadow-lg shrink-0 cursor-pointer hover:bg-gray-700"
              onClick={() => handleViewDetails(agent.contractAddress)}
            >
              <span className="absolute top-1 left-1 bg-yellow-400 text-black text-[10px] font-bold px-1 rounded">
                #{index + 1}
              </span>
              <img
                src={agent.logo}
                alt={agent.name}
                className="w-10 h-12 rounded-full"
              />
              <span className="text-xs text-green-400">{agent.ticker}</span>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex justify-center items-center mb-6 px-4 gap-2">
          <input
            type="text"
            placeholder="Search AI Agent..."
            className="w-full max-w-md px-4 py-2 border border-green-600 rounded bg-gray-800 text-gray-300 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Sorting and Chain Filtering */}
        <div className="flex flex-row items-center gap-4 mb-6 px-4">
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-gray-300">
              Sort By:
            </label>
            <select
              id="sort"
              className="w-32 px-3 py-2 border border-green-600 rounded bg-gray-800 text-gray-300 focus:outline-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="listedTime">Listed Time</option>
              <option value="name">Name</option>
              <option value="marketCap">Market Cap</option>
              <option value="upvotes">Upvotes</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            {/* <label htmlFor="chain" className="text-gray-300">
              Chain:
            </label> */}
            <select
              id="chain"
              className="w-32 px-3 py-2 border border-green-600 rounded bg-gray-800 text-gray-300 focus:outline-none"
              onChange={(e) => handleChainFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="polygon">Polygon</option>
              <option value="arbitrum">Arbitrum</option>
              <option value="bsc">BSC</option>
              <option value="ethereum">Ethereum</option>
              <option value="solana">Solana</option>
            </select>
          </div>
        </div>

        {/* Agents Table */}
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full min-w-[900px] border-collapse bg-gray-800 text-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-700 text-green-400 text-left">
                <th className="px-4 py-3 uppercase font-medium">#</th>
                <th className="px-4 py-3 uppercase font-medium">Name</th>
                <th className="px-4 py-3 uppercase font-medium">Chain</th>
                <th className="px-4 py-3 uppercase font-medium">Market Cap</th>
                <th className="px-4 py-3 uppercase font-medium">Listed On</th>
                <th className="px-4 py-3 uppercase font-medium">Price</th>
                <th className="px-4 py-3 uppercase font-medium">Upvotes</th>
                <th className="px-4 py-3 uppercase font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAgents.map((agent, index) => (
                <tr
                  key={agent._id}
                  className="border-b border-gray-700 hover:bg-gray-700"
                >
                  <td className="px-4 py-3">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-3 truncate max-w-xs">
                    <img
                      src={
                        agent.logo ||
                        "https://cryptologos.cc/logos/solana-sol-logo.png"
                      }
                      alt="Agent Logo"
                      className="inline-block h-6 w-6 rounded-full mr-2"
                    />
                    {agent.name} ({agent.ticker})
                  </td>
                  <td className="px-4 py-3">
                    <img
                      src={
                        chainLogos[agent.chain?.toLowerCase()] ||
                        "https://cryptologos.cc/logos/solana-sol-logo.png"
                      }
                      alt="Chain Logo"
                      className="inline-block h-6 w-6 rounded-full mr-2"
                    />
                    {agent.chain}
                  </td>
                  <td className="px-4 py-3">
                    {agent.marketCap.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </td>
                  <td className="px-4 py-3">{getRelativeTime(agent.submittedAt)}</td>
                  <td className="px-4 py-3">
                    {agent.price
                      ? parseFloat(agent.price).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3">{agent.upvotes}</td>
                  <td className="px-4 py-3">
                    <button
                      className="px-3 py-1 border border-green-400 rounded text-green-400 hover:bg-green-400 hover:text-gray-900"
                      onClick={() => handleViewDetails(agent.contractAddress)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center my-6 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-3 py-1 border border-green-600 rounded hover:bg-green-600 ${currentPage === i + 1
                ? "bg-green-400 text-gray-900"
                : "text-gray-300"
                }`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Explorer;
