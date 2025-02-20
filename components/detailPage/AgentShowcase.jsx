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
    <div className="my-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 ml-4">Project's Ecosystem</h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide p-2">
        {agents.map((agent, index) => {
          const formattedDescription = formatDescription(agent.description);

          const cardContent = (
            <div className="bg-white p-5 rounded-xl flex items-center gap-4 shadow-md hover:shadow-lg transition duration-300 ease-in-out border border-gray-100 hover:border-green-200 group">
              <div className="text-green-500 text-4xl group-hover:text-green-600 transition-colors duration-300">
                {agent.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                  {agent.name}
                </h3>
                <div className="text-gray-600 text-sm mt-1">
                  {formattedDescription.map((line, lineIndex) => (
                    <p key={lineIndex} className="leading-relaxed">
                      {line}
                    </p>
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
              className="min-w-[280px] max-w-[320px] flex-shrink-0"
              aria-label={`Visit ${agent.name}`}
            >
              {cardContent}
            </a>
          ) : (
            <div key={index} className="min-w-[280px] max-w-[320px] flex-shrink-0">
              {cardContent}
            </div>
          );
        })}
      </div>
      
      {/* Gradient fade indicators for horizontal scroll */}
      <div className="relative mt-2">
        <div className="absolute top-0 left-0 h-12 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
        <div className="absolute top-0 right-0 h-12 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default AgentShowcase;