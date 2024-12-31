import React, { useState } from "react";

const IframeSection = ({ chainId, contractAddress }) => {
  const [iframeLoaded, setIframeLoaded] = useState(false); // Track iframe loading state

  // Check for missing chainId or pairAddress
  if (!chainId || !contractAddress) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-800 rounded-lg">
        <p className="text-gray-400 text-lg">
          Unable to load chart: Missing data.
        </p>
      </div>
    );
  }

  const iframeURL = `https://www.geckoterminal.com/${chainId}/pools/${contractAddress}?embed=1&info=0&swaps=0&grayscale=1&light_chart=0`;

  return (
    <div className="p-4">
      {/* Animated Loading Spinner */}
      {!iframeLoaded && (
        <div className="flex justify-center items-center h-96 bg-gray-800 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {/* Iframe */}
      <iframe
        className={`w-full h-96 rounded-lg ${
          iframeLoaded ? "block" : "hidden"
        }`}
        title="GeckoTerminal Embed"
        src={iframeURL}
        frameBorder="0"
        allowFullScreen
        onLoad={() => setIframeLoaded(true)} // Set iframeLoaded to true once it loads
      ></iframe>
    </div>
  );
};

export default IframeSection;
