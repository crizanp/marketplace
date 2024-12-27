import React, { useState, useEffect } from "react";
import {
  FaTwitter,
  FaFacebookF,
  FaTelegramPlane,
  FaInstagram,
} from "react-icons/fa";
import agentsData from "../data/agents.json";

const AgentsTable = () => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    // Sort agents by market cap in descending order and select the top 10
    const sortedAgents = agentsData
      .sort(
        (a, b) =>
          parseFloat(b.marketCap.replace("$", "").replace("B", "")) -
          parseFloat(a.marketCap.replace("$", "").replace("B", ""))
      )
      .slice(0, 10);
    setAgents(sortedAgents);
  }, []);

  return (
    <div className="lg:px-10 lg:p-5 pb-5 bg-gray-900 text-gray-100">
      {/* Agents Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full min-w-[900px] border-collapse bg-gray-800 text-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-700 text-green-400 text-left">
              <th className="px-4 py-3 uppercase font-medium text-center">#</th>
              <th className="px-4 py-3 uppercase font-medium">Name</th>
              <th className="px-4 py-3 uppercase font-medium text-center">
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
                key={agent.id}
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
                  <div className="flex items-center justify-center gap-2">
                    <img
                      src="https://cryptologos.cc/logos/solana-sol-logo.png"
                      alt="Chain Logo"
                      className="h-6 w-6 rounded-full"
                    />
                    <span className="whitespace-nowrap">Solana</span>
                  </div>
                </td>

                {/* Market Cap */}
                <td className="px-4 py-3 text-center">{agent.marketCap}</td>

                {/* Listed Time */}
                <td className="px-4 py-3 text-center">{agent.time}</td>

                {/* Price */}
                <td className="px-4 py-3 text-center">{agent.price || "N/A"}</td>

                {/* Upvotes */}
                <td className="px-4 py-3 text-center">{agent.replies}</td>

                {/* Social Links */}
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentsTable;
