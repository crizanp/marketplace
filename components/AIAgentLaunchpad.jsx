import React from "react";

const AIAgentLaunchpad = () => {
  return (
    <div className="bg-gray-900 text-gray-100 lg:p-10">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-center py-10 overflow-hidden">
        <div className="absolute inset-0 animate-pulse opacity-40">
          <div className="w-[100%]  bg-green-700 blur-[150px] rounded-full absolute -top-40 -left-40"></div>
          <div className="w-[100%]  bg-green-600 blur-[100px] rounded-full absolute top-10 right-10"></div>
        </div>
        <h1 className="relative text-4xl md:text-6xl font-extrabold text-white z-10">
          🚀 AI Agent Launchpad
        </h1>
        <p className="relative mt-4 text-lg md:text-xl text-gray-200 z-10">
          Empowering the future of AI innovation. Launchpad for the AI projects
          of tomorrow.
        </p>
        {/* <p className="relative mt-2 text-md md:text-lg text-gray-100 z-10">
          Coming <span className="font-bold text-white">Q1 2025</span>.
        </p> */}
      </section>

      {/* Use Cases Section */}
      <section className="py-16 px-6 md:px-16 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-green-400 mb-8">
          Why Choose the AI Agent Launchpad?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "For Developers",
              text: "Launch your AI projects with seamless tools and integrations. From funding to development, we’ve got you covered.",
            },
            {
              title: "For Investors",
              text: "Gain early access to innovative AI projects and invest in high-potential AI startups from day one.",
            },
            {
              title: "For Businesses",
              text: "Discover AI solutions tailored to your needs, accelerating innovation and staying ahead of the curve.",
            },
          ].map((useCase, idx) => (
            <div
              key={idx}
              className="bg-gray-800 p-6 rounded-lg shadow-lg text-center hover:scale-105 transition-transform duration-300"
            >
              <h3 className="text-xl font-bold text-green-400 mb-4">{useCase.title}</h3>
              <p>{useCase.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 md:px-16 bg-gradient-to-r from-green-700 via-green-600 to-green-500 relative">
        <div className="absolute inset-0 opacity-30">
          <div className="w-[100%] bg-green-400 blur-[120px] rounded-full absolute -top-20 left-10"></div>
          <div className="w-[100%] bg-green-300 blur-[150px] rounded-full absolute bottom-10 right-10"></div>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 relative z-10">
          Launchpad Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {[
            { title: "⚙️ Easy Integration", text: "Plug-and-play tools for efficiency and scalability." },
            { title: "🌐 Multi-Chain Support", text: "Connect with major blockchain networks securely." },
            { title: "💡 Innovation Hub", text: "Collaborate with a global community of AI pioneers." },
            { title: "📊 Funding Access", text: "Tap into funding opportunities and connect with investors." },
            { title: "🔒 Secure & Reliable", text: "Built on robust infrastructure for reliability." },
            { title: "🌟 Community Rewards", text: "Earn rewards for contributing to the AI ecosystem." },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-6 md:px-16 bg-gray-900">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-green-400 mb-8">
          Launch Timeline
        </h2>
        <div className="max-w-4xl mx-auto space-y-8">
          {[
            { quarter: "Q1", text: "Official launch of AI Agent Launchpad." },
            { quarter: "Q2", text: "Integration with 5 major blockchain networks." },
            { quarter: "Q3", text: "Community rewards program rollout." },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center text-gray-900 font-bold text-lg">
                {item.quarter}
              </div>
              <p className="text-lg">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-green-500 to-green-700 py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="w-[800px] h-[800px] bg-green-600 blur-[150px] rounded-full absolute top-10 left-10"></div>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">
          Ready to Shape the Future of AI?
        </h2>
        <p className="text-gray-200 mb-8 relative z-10">
          Join our community and be the first to know when the AI Agent Launchpad goes live.
        </p>
        <button className="px-6 py-3 bg-gray-900 text-green-400 border-2 border-green-400 rounded-lg text-lg font-bold hover:bg-green-400 hover:text-gray-900 transition duration-300 relative z-10">
          Join the Waitlist
        </button>
      </section>
    </div>
  );
};

export default AIAgentLaunchpad;
