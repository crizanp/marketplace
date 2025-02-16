import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExplorerSkeleton from "@/components/Skeleton/ExplorerSkeleton";
import { FaSearch } from "react-icons/fa";
import Head from "next/head";

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
  const [sortBy, setSortBy] = useState("listedTime");
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trendingAgents, setTrendingAgents] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedChain, setSelectedChain] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(false);

  const router = useRouter();
  const itemsPerPage = 10;

  // Replace this entire fetchAgents function
  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        search: searchTerm,
        sortBy,
        chain: selectedChain,
      });

      const response = await fetch(`/api/filter?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch agents.");

      const data = await response.json();

      // Assign random upvotes to each agent
      const agentsWithRandomUpvotes = data.data.map((agent) => ({
        ...agent,
        upvotes: Math.floor(Math.random() * (9999 - 100) + 100),
      }));

      setAgents(agentsWithRandomUpvotes);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching agents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";

    const formattedPrice = parseFloat(price).toFixed(5); // Ensures 5 decimal places
    const decimalPart = formattedPrice.split(".")[1]; // Gets the decimal part

    if (decimalPart === "00000") {
      // If all zeroes, show 0.0
      return "$0.0";
    } else {
      // Count leading zeroes in the decimal part
      const leadingZeroCount = decimalPart.match(/^0+/)?.[0]?.length || 0;
      return leadingZeroCount > 0
        ? `$0.${"0".repeat(leadingZeroCount)}${decimalPart.slice(leadingZeroCount)}`
        : `$${formattedPrice}`; // No leading zeroes, display the full formatted price
    }
  };

  useEffect(() => {
    if (searchTrigger || currentPage || sortBy || selectedChain) {
      fetchAgents();
      setSearchTrigger(false); // Reset the trigger after fetching
    }
  }, [searchTrigger, currentPage, sortBy, selectedChain]);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleViewDetails = (contractAddress) => {
    if (contractAddress) router.push(`/coins/${contractAddress}`);
  };

  const handleChainFilter = (chain) => {
    setSelectedChain(chain);
    setCurrentPage(1); // Reset to the first page on filter change
  };
  
  // Fetch Trending Tokens
  useEffect(() => {
    const fetchTrendingTokens = async () => {
      try {
        const response = await fetch("/api/getdata?query=trending");
        if (!response.ok) {
          throw new Error("Failed to fetch trending tokens");
        }
        const data = await response.json();
        setTrendingAgents(data);
      } catch (error) {
        console.error("Error fetching trending tokens:", error);
      }
    };

    fetchTrendingTokens();
  }, []);
  
  if (isLoading) return <ExplorerSkeleton />;

  return (
    <>
      <Head>
        <title>GekkoAI Explorer - Discover AI Agents and Blockchain Solutions</title>
        <meta
          name="description"
          content="Explore GekkoAI's marketplace and launchpad for AI agents. Discover, list, and integrate innovative blockchain solutions with ease."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="GekkoAI, AI Agents, Blockchain, Solana, Marketplace, Launchpad, Decentralized Solutions" />
        <meta name="author" content="GekkoAI Team" />

        {/* Open Graph / Social Media Metadata */}
        <meta property="og:title" content="GekkoAI Explorer - Discover AI Agents and Blockchain Solutions" />
        <meta
          property="og:description"
          content="Dive into GekkoAI's ecosystem and uncover cutting-edge AI solutions tailored for the blockchain. Your gateway to innovation starts here!"
        />
        <meta property="og:image" content="/gekkobanner.jpg" />
        <meta property="og:url" content="https://aigekko.fun/explorer" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Metadata */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="GekkoAI Explorer - Discover AI Agents and Blockchain Solutions" />
        <meta
          name="twitter:description"
          content="Explore GekkoAI's marketplace and launchpad for AI agents. Discover, list, and integrate innovative blockchain solutions with ease."
        />
        <meta name="twitter:image" content="https://aigekko.fun/gekkobanner.jpg" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <div className="lg:px-10 p-0 bg-gradient-to-r from-white to-[#f0f7f4] text-gray-800 overflow-x-hidden">
        {/* Trending Agents Scrollbar */}
        <div className="flex gap-4 my-5 py-2 mx-4 overflow-x-auto scrollbar-hide sm:justify-center">
          {trendingAgents.map((agent, index) => (
            <div
              key={agent.contractAddress}
              className="relative flex flex-col items-center bg-white rounded-lg w-20 h-20 text-center gap-2 p-2 shadow-md shrink-0 cursor-pointer hover:bg-[#f0f7f4] border border-[#e6f3ed]"
              onClick={() => handleViewDetails(agent.contractAddress)}
            >
              <span className="absolute top-1 left-1 bg-[#FFC107] text-gray-800 text-[10px] font-bold px-1 rounded">
                #{index + 1}
              </span>
              <img
                src={agent.logo || "https://via.placeholder.com/50"}
                alt={agent.name}
                className="w-10 h-12 rounded-full"
              />
              <span className="text-xs text-[#00cc6a]">{agent.ticker}</span>
            </div>
          ))}
        </div>
        
        {/* Search Bar */}
        <div className="flex justify-center items-center my-6 px-4 gap-2">
          <input
            type="text"
            placeholder="Search AI Agent..."
            className="w-full max-w-md px-4 py-2 border border-[#00cc6a] rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00cc6a] transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="p-2 bg-[#00cc6a] text-white rounded hover:bg-[#00a857] transition-colors duration-200"
            onClick={() => {
              setCurrentPage(1); // Reset to the first page
              fetchAgents(); // Trigger the search function
            }}
          >
            <FaSearch /> {/* Search Icon from react-icons */}
          </button>
        </div>

        {/* Sorting and Chain Filtering */}
        <div className="flex flex-row items-center gap-4 mb-6 px-4">
          {/* Sort By Filter */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="sort"
              className="text-gray-700 hidden sm:inline-block"
            >
              Sort By:
            </label>

            <select
              id="sort"
              className="w-22 sm:w-32 px-3 py-2 rounded bg-white text-gray-700 border border-[#00cc6a] focus:outline-none focus:ring-2 focus:ring-[#00cc6a] transition-all duration-200"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="listedTime">Listed Time</option>
              <option value="name">Name</option>
              <option value="marketCap">Market Cap</option>
              <option value="upvotes">Upvotes</option>
            </select>
          </div>

          {/* Chain Filter */}
          <div className="flex items-center gap-2">
            <select
              id="chain"
              className="w-22 sm:w-32 px-3 py-2 border border-[#00cc6a] rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00cc6a] transition-all duration-200"
              value={selectedChain}
              onChange={(e) => handleChainFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="base">Base</option>
              <option value="polygon">Polygon</option>
              <option value="bsc">BSC</option>
              <option value="ethereum">Ethereum</option>
              <option value="solana">Solana</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {(selectedChain || sortBy !== "listedTime") && (
            <button
              className="text-red-500 hover:text-red-700 transition-colors duration-200"
              onClick={() => {
                setSortBy("listedTime"); // Reset Sort By to default
                handleChainFilter(""); // Reset Chain to default
                setCurrentPage(1); // Reset pagination
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Agents Table */}
        <div className="overflow-x-auto rounded-lg scrollbar-hide shadow-lg">
          <table className="w-full min-w-[900px] border-collapse bg-white text-gray-700 text-sm">
            <thead>
              <tr className="border-b border-[#e6f3ed] text-[#00cc6a]">
                <th className="px-4 py-3 uppercase font-medium">#</th>
                <th className="px-4 py-3 uppercase font-medium">Name</th>
                <th className="px-4 py-3 uppercase font-medium">Ticker</th>
                <th className="px-4 py-3 uppercase font-medium">Chain</th>
                <th className="px-4 py-3 uppercase font-medium">Market Cap</th>
                <th className="px-4 py-3 uppercase font-medium">Listed On</th>
                <th className="px-4 py-3 uppercase font-medium">Price</th>
                <th className="px-4 py-3 uppercase font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent, index) => (
                <tr
                  key={agent.contractAddress}
                  className="border-b border-[#e6f3ed] hover:bg-[#f0f7f4] transition-colors duration-200"
                >
                  <td className="px-4 py-3 text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-3 truncate max-w-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={agent.logo || "https://via.placeholder.com/50"}
                        alt="Agent Logo"
                        className="h-6 w-6 rounded-full"
                      />
                      <span className="font-medium">{agent.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{agent.ticker}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={chainLogos[agent.chain?.toLowerCase()] || "https://via.placeholder.com/50"}
                        alt="Chain Logo"
                        className="h-6 w-6 rounded-full"
                      />
                      <span className="whitespace-nowrap">
                        {agent.chain
                          ? agent.chain.charAt(0).toUpperCase() + agent.chain.slice(1)
                          : "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-medium">
                    {agent.marketCap
                      ? agent.marketCap.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-500">
                    {getRelativeTime(agent.submittedAt)}
                  </td>
                  <td className="px-4 py-3 text-center font-medium">
                    {agent.price || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className="px-3 py-1 rounded border border-[#00cc6a] text-[#00cc6a] hover:bg-[#00cc6a] hover:text-white transition-colors duration-200"
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
              className={`px-3 py-1 border rounded transition-colors duration-200 ${
                currentPage === i + 1
                  ? "bg-[#00cc6a] text-white border-[#00cc6a]"
                  : "border-[#00cc6a] text-[#00cc6a] hover:bg-[#e6f3ed]"
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