import { FaRegCopy, FaCheck } from "react-icons/fa";

const TokenInfo = ({ data, copied, copyToClipboard, truncateAddress }) => {
  // Handle missing data gracefully
  const marketCap = data?.marketCap ? `$${data.marketCap}` : "N/A";
  const liquidity = data?.liquidity?.usd ? `$${data.liquidity.usd}` : "N/A";
  const chainId = data?.chainId || "N/A";
  const volume24h = data?.volume?.h24 ? `$${data.volume.h24}` : "N/A";
  const contractAddress = data?.contractAddress || "N/A";

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-white mb-4">Token Info</h2>
      <ul className="space-y-4">
        <li className="flex justify-between items-center border-b border-gray-600 pb-2">
          <span className="text-gray-400">Market Cap:</span>
          <span className="text-gray-200">{marketCap}</span>
        </li>
        <li className="flex justify-between items-center border-b border-gray-600 pb-2">
          <span className="text-gray-400">Liquidity:</span>
          <span className="text-gray-200">{liquidity}</span>
        </li>
        <li className="flex justify-between items-center border-b border-gray-600 pb-2">
          <span className="text-gray-400">Chain:</span>
          <span className="text-gray-200">{chainId}</span>
        </li>
        <li className="flex justify-between items-center border-b border-gray-600 pb-2">
          <span className="text-gray-400">24 Hour Volume:</span>
          <span className="text-gray-200">{volume24h}</span>
        </li>
        <li className="flex justify-between items-center border-b border-gray-600 pb-2">
          <span className="text-gray-400">Contract Address:</span>
          <span className="flex items-center gap-2">
            <span className="text-gray-200">{truncateAddress(contractAddress)}</span>
            {contractAddress !== "N/A" && (
              <button
                onClick={copyToClipboard}
                className="text-green-400 hover:text-green-300 focus:outline-none"
              >
                {copied ? <FaCheck /> : <FaRegCopy />}
              </button>
            )}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default TokenInfo;
