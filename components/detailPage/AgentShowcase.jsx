import React from "react";

const AgentShowcase = ({ agents }) => {
  if (!agents || agents.length === 0) {
    return <p className="text-gray-400">No agents available</p>;
  }

  const formatDescription = (description) => {
    if (!description) return [];
    const words = description.split(" ");
    const chunks = [];
    for (let i = 0; i < words.length; i += 6) {
      chunks.push(words.slice(i, i + 6).join(" "));
    }
    return chunks;
  };

  return (
    <div className="my-3">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide p-2">
        {agents.map((agent, index) => {
          const formattedDescription = formatDescription(agent.description);

          const cardContent = (
            <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-4 shadow-lg hover:shadow-xl transition duration-300 ease-in-out hover:bg-gray-700">
              <div className="text-green-400 text-4xl">{agent.icon}</div>
              <div>
                <h3 className="text-lg font-bold text-white">{agent.name}</h3>
                <div className="text-gray-400 text-sm">
                  {formattedDescription.map((line, lineIndex) => (
                    <p key={lineIndex}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          );

          return agent.link ? (
            <a
              key={index}
              href={agent.link}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-[250px]"
            >
              {cardContent}
            </a>
          ) : (
            <div key={index} className="min-w-[250px]">
              {cardContent}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentShowcase;
