import React, { useState } from "react";

const IframeSection = ({ chainId, contractAddress }) => {
  const [iframeLoaded, setIframeLoaded] = useState(false); // Track iframe loading state

  // Check for missing chainId or pairAddress
  if (!chainId || !contractAddress) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-500 text-lg">
          Unable to load chart: Missing data.
        </p>
      </div>
    );
  }

  const iframeURL = `https://www.geckoterminal.com/${chainId}/pools/${contractAddress}?embed=1&info=0&swaps=0&grayscale=1&light_chart=1`;

  return (
    <div className="p-4 relative">
      {/* Animated Loading Spinner */}
      {!iframeLoaded && (
        <div className="flex justify-center items-center h-96 bg-gray-100 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {/* Iframe */}
      <iframe
        className={`w-full h-96 rounded-lg border-2 border-green-300 ${
          iframeLoaded ? "block" : "hidden"
        }`}
        title="GeckoTerminal Embed"
        src={iframeURL}
        frameBorder="0"
        allowFullScreen
        onLoad={() => setIframeLoaded(true)} // Set iframeLoaded to true once it loads
      ></iframe>

      {/* Hide the "Powered by GeckoTerminal" text */}
      <style>
        {`
          iframe {
            position: relative;
          }
          iframe::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 40px; /* Adjust height to cover the watermark */
            background: white; /* Match the background color */
            z-index: 10;
          }
        `}
      </style>
    </div>
  );
};

export default IframeSection;