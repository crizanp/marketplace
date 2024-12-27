import React, { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Import useRouter for navigation
import agentsData from "../../data/agents.json";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Explorer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [agents, setAgents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [showMessage, setShowMessage] = useState(false); // Floating message state

  const router = useRouter();

  useEffect(() => {
    setAgents(agentsData);
  }, []);

  const sortAgents = (a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "marketCap":
        return (
          parseFloat(b.marketCap.replace("$", "").replace("B", "")) -
          parseFloat(a.marketCap.replace("$", "").replace("B", ""))
        );
      case "listedTime":
        return new Date(b.listedTime) - new Date(a.listedTime);
      case "upvotes":
        return b.replies - a.replies;
      default:
        return 0;
    }
  };

  const filteredAgents = agents
    .filter((agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort(sortAgents);

  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);
  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleViewDetails = (contractaddress) => {
    if (contractaddress) {
      router.push(`/coins/${contractaddress}`);
    } else {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
  };

  const handleTrendingCardClick = (contractaddress) => {
    if (contractaddress) {
      router.push(`/coins/${contractaddress}`);
    } else {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
  };

  const trendingAgents = [...agentsData]
    .sort((a, b) => b.replies - a.replies)
    .slice(0, 8);

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
              key={agent.id}
              className="relative flex flex-col items-center bg-gray-800 rounded-lg w-20 h-20 text-center gap-2 p-2 shadow-lg shrink-0"
              onClick={() => handleTrendingCardClick(agent.contractaddress)}
            >
              <span className="absolute top-1 left-1 bg-yellow-400 text-black text-[10px] font-bold px-1 rounded">
                #{index + 1}
              </span>
              <img
                src={agent.logo}
                alt={agent.name}
                className="w-10 h-12 rounded-full"
              />
              <span className="text-xs text-green-400 ">{agent.ticker}</span>
            </div>
          ))}
        </div>


        {/* Search Bar */}
        <div className="flex justify-center items-center mb-6 px-4 gap-2">
          {/* Input Container */}
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search AI Agent..."
              className="w-full px-4 py-2 border border-green-600 rounded bg-gray-800 text-gray-300 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Clear Button */}
            {searchTerm && (
              <button
                className="absolute top-1/2 right-3 transform -translate-y-1/2"
                onClick={() => setSearchTerm("")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 hover:text-gray-100"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          {/* Search Button */}
          <button
            className="px-4 py-2 bg-green-500 text-gray-100 rounded hover:bg-green-700 focus:outline-none"
            onClick={() => {
              console.log("Search initiated:", searchTerm); // Replace with actual search logic
            }}
          >
            Search
          </button>
        </div>


        {/* Sorting Options */}
        {/* Sorting Options */}
        <div className="flex flex-row items-center gap-4 mb-6 px-4">
          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-gray-300 whitespace-nowrap">
              Sort By:
            </label>
            <select
              id="sort"
              className="w-32 px-3 py-2 border border-green-600 rounded bg-gray-800 text-gray-300 focus:outline-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Default</option>
              <option value="name">Name</option>
              <option value="marketCap">Market Cap</option>
              <option value="listedTime">Listed Time</option>
              <option value="upvotes">Upvotes</option>
            </select>
          </div>

          {/* Chain Dropdown */}
          <div className="flex items-center gap-2">
            {/* <label htmlFor="chain" className="text-gray-300 whitespace-nowrap">
              Chain:
            </label> */}
            <select
              id="chain"
              className="w-32 px-3 py-2 border border-green-600 rounded bg-gray-800 text-gray-300 focus:outline-none"
              onChange={(e) => {
                const selectedChain = e.target.value;
                if (selectedChain) {
                  setAgents(
                    agentsData.filter((agent) =>
                      agent.chain?.toLowerCase().includes(selectedChain.toLowerCase())
                    )
                  );
                } else {
                  setAgents(agentsData); // Reset to all agents if no chain is selected
                }
              }}

            >
              <option value="">All</option>
              <option value="solana">Solana</option>
              <option value="bsc">BSC</option>
              <option value="base">BASE</option>
              <option value="eth">Ethereum</option>
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
                <th className="px-4 py-3 uppercase font-medium">Listed Time</th>
                <th className="px-4 py-3 uppercase font-medium">Price</th>
                <th className="px-4 py-3 uppercase font-medium">Upvotes</th>
                <th className="px-4 py-3 uppercase font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAgents.map((agent, index) => (
                <tr
                  key={agent.id}
                  className="border-b border-gray-700 hover:bg-gray-700"
                >
                  <td className="px-4 py-3">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-3 truncate max-w-xs">
                    <img
                      src={agent.logo || "https://cryptologos.cc/logos/solana-sol-logo.png"}
                      alt="Agent Logo"
                      className="inline-block h-6 w-6 rounded-full mr-2"
                    />
                    {agent.name} ({agent.ticker})
                  </td>
                  <td className="px-4 py-3">
                    <img
                      src="https://cryptologos.cc/logos/solana-sol-logo.png"
                      alt="Chain Logo"
                      className="inline-block h-6 w-6 rounded-full mr-2"
                    />
                    Solana
                  </td>
                  <td className="px-4 py-3">{agent.marketCap}</td>
                  <td className="px-4 py-3">{agent.time}</td>
                  <td className="px-4 py-3">{agent.price || "N/A"}</td>
                  <td className="px-4 py-3">{agent.replies}</td>
                  <td className="px-4 py-3">
                    <button
                      className="px-3 py-1 border border-green-400 rounded text-green-400 hover:bg-green-400 hover:text-gray-900"
                      onClick={() => handleViewDetails(agent.contractaddress)}
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
              className={`px-3 py-1 border border-green-600 rounded hover:bg-green-00 ${currentPage === i + 1 ? "bg-green-400 text-gray-900" : ""
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
