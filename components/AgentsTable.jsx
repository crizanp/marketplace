import React, { useState, useEffect } from "react";
import {
  FaTwitter,
  FaFacebookF,
  FaTelegramPlane,
  FaInstagram,
} from "react-icons/fa";
import styles from "../styles/TableView.module.css";
import agentsData from "../data/agents.json"; // Assume this contains all agents data

const AgentsTable = () => {
  const [sortBy, setSortBy] = useState("");
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    // Fetch only the first 10 agents
    setAgents(agentsData.slice(0, 10));
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

  const sortedAgents = [...agents].sort(sortAgents);

  return (
    <div className={styles.tableContainer}>
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
            <th>Social Links</th>
          </tr>
        </thead>
        <tbody>
          {sortedAgents.map((agent, index) => (
            <tr key={agent.id}>
              <td>{index + 1}</td>
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
                  alt="SOL"
                  className={styles.chainLogo}
                />
                Solana
              </td>
              <td>{agent.marketCap}</td>
              <td>{agent.time}</td>
              <td>{agent.price || "Null"}</td>
              <td>{agent.replies}</td>
              <td className={styles.socialLinks}>
                <a
                  href={agent.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter className={styles.socialIcon} />
                </a>
                <a
                  href={agent.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram className={styles.socialIcon} />
                </a>
                <a
                  href={agent.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebookF className={styles.socialIcon} />
                </a>
                <a
                  href={agent.socials.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTelegramPlane className={styles.socialIcon} />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgentsTable;
