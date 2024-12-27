import React from "react";

const AgentShowcase = ({ agents }) => {
  return (
    <div className="my-3">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide p-2">
        {agents.map((agent, index) => (
          <div
            key={index}
            className="bg-gray-800 p-4 rounded-lg flex items-center gap-4 min-w-[250px] shadow-lg"
          >
            <div className="text-green-400 text-4xl">{agent.icon}</div>
            <div>
              <h3 className="text-lg font-bold text-white">{agent.name}</h3>
              <p className="text-gray-400 text-sm">{agent.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentShowcase;
