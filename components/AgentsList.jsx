import React, { useState } from 'react';
import AgentCard from './AgentCard';
import agentsData from '../data/agents.json';
import styles from '../styles/AgentCard.module.css';

const AgentsList = () => {
  const [sortBy, setSortBy] = useState('creationTime');

  const sortAgents = (a, b) => {
    switch (sortBy) {
      case 'creationTime':
        return new Date(b.time) - new Date(a.time);
      case 'replies':
        return b.replies - a.replies;
      case 'marketCap':
        return b.marketCap - a.marketCap;
      case 'social':
        return (b.socialActivity || 0) - (a.socialActivity || 0);
      default:
        return 0;
    }
  };

  const sortedAgents = [...agentsData].sort(sortAgents);

  return (
    <div className={styles.agentsContainer}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        {/* Sort Dropdown */}
        <div className={styles.sortDropdown}>
          <label htmlFor="sort">Sort By:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="creationTime">Creation Time</option>
            <option value="replies">Replies</option>
            <option value="marketCap">Market Cap</option>
            <option value="social">Social Activity</option>
          </select>
        </div>

        {/* Title */}
        <div className={styles.title}>🌟 Featured AI Agents</div>
      </div>

      {/* Agents Grid */}
      <div className={styles.agentsGrid}>
        {sortedAgents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {/* See More Button */}
      <div className={styles.seeMore}>
        <button>🔍 See More</button>
      </div>
    </div>
  );
};

export default AgentsList;
