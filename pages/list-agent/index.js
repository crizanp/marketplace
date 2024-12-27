import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ListAgent = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [contractAddress, setContractAddress] = useState("");
  const [agentDetails, setAgentDetails] = useState({
    name: "",
    ticker: "",
    description: "",
    type: "informative",
    chain: "",
    marketCap: "",
    liquidity: "",
    volume24h: "",
    social: {
      twitter: "",
      telegram: "",
      facebook: "",
      instagram: "",
      github: "",
      reddit: "",
      linkedin: "",
      youtube: "",
      discord: "",
      medium: "",
      pinterest: "",
      tiktok: "",
    },
    utility: [
      {
        name: "",
        shortDesc: "",
        socialType: "twitter",
        link: "",
      },
    ],
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("New Submission");
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialDropdownOpen, setIsSocialDropdownOpen] = useState(false);

  const connectWallet = () => {
    setIsWalletConnected(!isWalletConnected);
  };

  const fetchAgentData = async () => {
    if (!contractAddress) {
      alert("Please enter a contract address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.dexscreener.io/latest/dex/tokens/${contractAddress}`
      );
      const data = await response.json();

      if (data && data.pairs && data.pairs.length > 0) {
        const firstPair = data.pairs[0];
        const {
          baseToken,
          priceUsd,
          volume,
          marketCap,
          liquidity,
          chainId,
        } = firstPair;

        setAgentDetails((prev) => ({
          ...prev,
          name: baseToken.name || "",
          ticker: baseToken.symbol || "",
          chain: chainId || "",
          marketCap: marketCap || "",
          liquidity: liquidity?.usd || "",
          volume24h: volume?.h24 || "",
          description: prev.description,
          type: prev.type,
        }));
      } else {
        alert("No data found for the provided contract address.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data. Please try again.");
    }
    setIsLoading(false);
  };

  const handleUtilityChange = (index, field, value) => {
    const updatedUtility = [...agentDetails.utility];
    updatedUtility[index][field] = value;
    setAgentDetails((prev) => ({
      ...prev,
      utility: updatedUtility,
    }));
  };

  const addUtilityField = () => {
    setAgentDetails((prev) => ({
      ...prev,
      utility: [
        ...prev.utility,
        { name: "", shortDesc: "", socialType: "twitter", link: "" },
      ],
    }));
  };

  const removeUtilityField = (index) => {
    const updatedUtility = [...agentDetails.utility];
    updatedUtility.splice(index, 1);
    setAgentDetails((prev) => ({
      ...prev,
      utility: updatedUtility,
    }));
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    console.log(agentDetails); // For testing, you can replace this with your form submission logic.
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row">
        {/* Sidebar for Large Screens */}
        <div className="hidden md:block md:w-1/4 bg-gray-800 text-white p-4">
          <ul className="space-y-4">
            {[
              "New Submission",
              "AI Agent Launchpad",
              "View Submission",
              "Pricing Plans",
              "Privacy Policy",
            ].map((tab) => (
              <li
                key={tab}
                className={`p-2 rounded-lg cursor-pointer ${activeTab === tab ? "bg-purple-600" : "hover:bg-gray-700"
                  }`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>
        </div>

        {/* Tab Menu for Small Screens */}
        <div className="block md:hidden bg-gray-800 text-white">
          <ul className="flex overflow-x-auto no-scrollbar space-x-4 p-4">
            {[
              "New Submission",
              "AI Agent Launchpad",
              "View Submission",
              "Pricing Plans",
              "Privacy Policy",
            ].map((tab) => (
              <li
                key={tab}
                className={`px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap ${activeTab === tab ? "bg-purple-600" : "hover:bg-gray-700"
                  }`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 py-6 px-2 bg-gray-900 text-white">
          <h1 className="text-center text-3xl font-bold text-green-400 mb-6">
            📤 List Your AI Agent
          </h1>

          {activeTab === "New Submission" && (
            <>
              {!isSubmitted ? (
                <form
                  className="w-full max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg"
                  onSubmit={handleSubmit}
                >
                  {/* Wallet Connection */}
                  <div className="text-center mb-6">
                    <button
                      className={`px-4 py-2 rounded-lg transition-transform transform ${isWalletConnected
                        ? "bg-green-500 text-black hover:scale-105"
                        : "bg-red-500 text-white hover:scale-105"
                        }`}
                      onClick={connectWallet}
                    >
                      {isWalletConnected
                        ? "🔌 Wallet Connected"
                        : "💼 Connect Wallet"}
                    </button>
                    {!isWalletConnected && (
                      <p className="mt-2 text-orange-400 text-sm">
                        You must connect your wallet to list an agent.
                      </p>
                    )}
                  </div>

                  {/* Fetch Data from Contract Address */}
                  <div className="mb-6">
                    <label className="block mb-2">Contract Address:</label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600"
                      placeholder="Enter contract address"
                      value={contractAddress}
                      onChange={(e) => setContractAddress(e.target.value)}
                      disabled={!isWalletConnected}
                    />
                    <button
                      type="button"
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 disabled:bg-gray-700 transition-transform transform disabled:scale-100 hover:scale-105"
                      onClick={fetchAgentData}
                      disabled={!isWalletConnected || isLoading || !contractAddress}
                    >
                      {isLoading ? "Fetching..." : "Fetch Data"}
                    </button>
                  </div>

                  {/* General Information */}
                  <h2 className="text-xl font-bold">General Information</h2>
                  <label>
                    Name:
                    <input
                      type="text"
                      className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600"
                      value={agentDetails.name}
                      onChange={(e) =>
                        setAgentDetails({ ...agentDetails, name: e.target.value })
                      }
                      required
                    />
                  </label>
                  <label>
                    Ticker:
                    <input
                      type="text"
                      className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600"
                      value={agentDetails.ticker}
                      onChange={(e) =>
                        setAgentDetails({ ...agentDetails, ticker: e.target.value })
                      }
                      required
                    />
                  </label>
                  <label>
                    Description:
                    <textarea
                      className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600"
                      value={agentDetails.description}
                      onChange={(e) =>
                        setAgentDetails({ ...agentDetails, description: e.target.value })
                      }
                      required
                    />
                  </label>
                  <label>
                    Type:
                    <select
                      className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600"
                      value={agentDetails.type}
                      onChange={(e) =>
                        setAgentDetails({ ...agentDetails, type: e.target.value })
                      }
                    >
                      <option value="informative">Informative</option>
                      <option value="fun">Fun</option>
                      <option value="meme">Meme</option>
                      <option value="twitter">Twitter</option>
                    </select>
                  </label>
                  <label>
                    Chain:
                    <input
                      type="text"
                      className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600"
                      value={agentDetails.chain}
                      onChange={(e) =>
                        setAgentDetails({ ...agentDetails, chain: e.target.value })
                      }
                    />
                  </label>
                  {/* Social Information */}
                  <h2 className="text-xl font-bold py-5">Social Information</h2>
                  <button
                    type="button"
                    onClick={() => setIsSocialDropdownOpen(!isSocialDropdownOpen)}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                  >
                    {isSocialDropdownOpen ? "Hide Social Information" : "Show Social Information"}
                  </button>

                  {isSocialDropdownOpen && (
                    <div className="mt-4 space-y-4">
                      {Object.keys(agentDetails.social).map((platform) => (
                        <label key={platform} className="block capitalize">
                          {platform}:
                          <input
                            type="text"
                            className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 mt-2"
                            placeholder={`Enter ${platform} URL`}
                            value={agentDetails.social[platform]}
                            onChange={(e) =>
                              setAgentDetails((prev) => ({
                                ...prev,
                                social: {
                                  ...prev.social,
                                  [platform]: e.target.value,
                                },
                              }))
                            }
                          />
                        </label>
                      ))}
                    </div>
                  )}
                  {/* Agent Utility */}
                  <h2 className="text-xl font-bold py-5">Agent Utility</h2>
                  {agentDetails.utility.map((utility, index) => (
                    <div key={index} className="space-y-2 bg-gray-700 p-4 rounded-lg">
                      <label>
                        Utility Name:
                        <input
                          type="text"
                          className="w-full bg-gray-600 text-white rounded-lg p-3 border border-gray-500"
                          value={utility.name}
                          onChange={(e) =>
                            handleUtilityChange(index, "name", e.target.value)
                          }
                        />
                      </label>
                      <label>
                        Short Description (20 words):
                        <textarea
                          className="w-full bg-gray-600 text-white rounded-lg p-3 border border-gray-500"
                          value={utility.shortDesc}
                          onChange={(e) =>
                            handleUtilityChange(index, "shortDesc", e.target.value)
                          }
                          maxLength="100"
                        />
                      </label>
                      <label>
                        Social Type:
                        <select
                          className="w-full bg-gray-600 text-white rounded-lg p-3 border border-gray-500"
                          value={utility.socialType}
                          onChange={(e) =>
                            handleUtilityChange(index, "socialType", e.target.value)
                          }
                        >
                          <option value="twitter">Twitter</option>
                          <option value="discord">Discord</option>
                          <option value="telegram">Telegram</option>
                          <option value="facebook">Facebook</option>
                          <option value="other">Other</option>
                        </select>
                      </label>
                      <label>
                        Link:
                        <input
                          type="text"
                          className="w-full bg-gray-600 text-white rounded-lg p-3 border border-gray-500"
                          value={utility.link}
                          onChange={(e) =>
                            handleUtilityChange(index, "link", e.target.value)
                          }
                        />
                      </label>
                      {agentDetails.utility.length > 1 && (
                        <button
                          type="button"
                          className="text-red-400 underline"
                          onClick={() => removeUtilityField(index)}
                        >
                          Remove Utility
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="text-blue-400 underline"
                    onClick={addUtilityField}
                  >
                    Add Another Utility
                  </button>
                  <button
                    type="submit"
                    className="w-full mt-6 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500 transition-transform transform hover:scale-105"
                  >
                    Submit
                  </button>
                </form>
              ) : (
                <p className="text-center text-green-400 font-bold">
                  🎉 Your submission has been received!
                </p>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ListAgent;
