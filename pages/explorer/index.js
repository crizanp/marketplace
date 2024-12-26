import React, { useState, useEffect } from "react";
import styles from "../../styles/Explorer.module.css";
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

  const handleViewDetails = () => {
    setShowMessage(true); // Show the floating message when the button is clicked

    // Hide the message after 3 seconds
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  const handleTrendingCardClick = () => {
    setShowMessage(true); // Show the floating message when a trending card is clicked

    // Hide the message after 3 seconds
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  const trendingAgents = [...agentsData]
    .sort((a, b) => b.replies - a.replies)
    .slice(0, 8);

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        {/* Floating Message */}
        {showMessage && (
          <div className={styles.floatingMessage}>
            Full version will be released on Jan 1, this is just a prototype.
          </div>
        )}

        {/* Trending Agents Section */}
        <div className={styles.trendingSection}>
          {trendingAgents.map((agent, index) => (
            <div
              key={agent.id}
              className={styles.trendingCard}
              onClick={handleTrendingCardClick} // Add onClick handler to show message
            >
              <span className={styles.rank}>#{index + 1}</span>
              <img
                src={agent.logo}
                alt={agent.name}
                className={styles.trendingLogo}
              />
              <span className={styles.ticker}>{agent.ticker}</span>
            </div>
          ))}
        </div>

        {/* Search AI Agent */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search AI Agent..."
            className={styles.searchField}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Sorting Options */}
        <div className={styles.topBar}>
          <div className={styles.sortDropdown}>
            <label htmlFor="sort">Sort By:</label>
            <select
              id="sort"
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
        </div>

        {/* Agents Table */}
        <div className={styles.agentsTableContainer}>
          <table className={styles.agentsTable}>
            <thead>
              <tr>
                <th>#</th>
                <th style={{ textAlign: "left" }}>Name</th>
                <th>Chain</th>
                <th>Market Cap</th>
                <th>Listed Time</th>
                <th>Price</th>
                <th>Upvotes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAgents.map((agent, index) => (
                <tr key={agent.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td style={{ textAlign: "left" }}>
                    <img
                      src={
                        agent.logo ||
                        "https://cryptologos.cc/logos/solana-sol-logo.png"
                      }
                      alt="Agent Logo"
                      className={styles.chainLogo}
                    />
                    {agent.name} ({agent.ticker})
                  </td>
                  <td>
                    <img
                      src="https://cryptologos.cc/logos/solana-sol-logo.png"
                      alt="Chain Logo"
                      className={styles.chainLogo}
                    />
                    Solana
                  </td>
                  <td>{agent.marketCap}</td>
                  <td>{agent.time}</td>
                  <td>{agent.price || "N/A"}</td>
                  <td>{agent.replies}</td>
                  <td>
                    <button
                      className={styles.viewButton}
                      onClick={handleViewDetails} // Trigger message on button click
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
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`${styles.pageButton} ${
                currentPage === i + 1 ? styles.activePage : ""
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
