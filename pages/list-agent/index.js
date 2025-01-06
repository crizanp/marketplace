import { useState, useEffect } from "react"; // Include useEffect here
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIAgentLaunchpad from "@/components/AIAgentLaunchpad";
import PrivacyPolicy from "@/components/PrivacyPolicy";
import Cookies from 'js-cookie';
import { useWallet } from "@solana/wallet-adapter-react";
import AgentEditor from "@/components/AgentEditor";
import { useRouter } from "next/router";

import Head from "next/head";

const ListAgent = () => {
  const { connected, publicKey } = useWallet();
  const [floatingMessage, setFloatingMessage] = useState(null);
  const showFloatingMessage = (message, type) => {
    setFloatingMessage({ message, type });
  };
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


  const fetchAgentData = async () => {
    if (!contractAddress) {
      showFloatingMessage("Please enter a contract address.", "warning");
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
        showFloatingMessage(
          `No data found for the provided contract address.`,
          "failure"
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showFloatingMessage(
        `Failed to fetch data. Please try again.`,
        "failure"
      );
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

  const router = useRouter(); // Initialize useRouter
  useEffect(() => {
    const tab = router.query.tab;

    if (tab === "launch-agent") {
      setActiveTab("AI Agent Launchpad");
    } else if (tab === "new-submission") {
      setActiveTab("New Submission");
    }
  }, [router.query]); // Observe query changes

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    // Navigate to appropriate route when a tab is clicked
    if (tab === "New Submission") {
      router.push("/list-agent");
    } else if (tab === "AI Agent Launchpad") {
      router.push("/list-agent?tab=launch-agent");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!connected) {
      showFloatingMessage(
        `You must connect your wallet before submitting.`,
        "warning"
      );
      return;
    }

    try {
      // Ensure the wallet address is available
      if (!publicKey) {
        showFloatingMessage(
          `Wallet address is not available`,
          "failure"
        );
        return;
      }

      // Add contractAddress to agentDetails
      const updatedAgentDetails = {
        ...agentDetails,
        contractAddress, // Add contract address
      };

      // Include wallet address in submission
      const submissionData = {
        agentDetails: updatedAgentDetails,
        walletAddress: publicKey.toString(), // Add the wallet address
      };

      const response = await fetch("/api/submit-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit agent");
      }

      const result = await response.json();
      console.log("Submission result:", result);

      setIsSubmitted(true);
      showFloatingMessage(
        `🎉 Your submission has been received!`,
        "success"
      );
    } catch (error) {
      console.error("Error submitting agent:", error);
      showFloatingMessage(
        `Failed to submit. Please try again.`,
        "failure"
      );
    }
  };



  return (
    <>
      <Head>
        <title>List Your AI Agent - Gekko AI Marketplace</title>
        <meta
          name="description"
          content="List your AI agent on the Gekko AI marketplace. Showcase your project to a global audience and join the future of AI innovation on the Solana blockchain."
        />
        <meta
          name="keywords"
          content="AI agent marketplace, AI launchpad, Gekko AI, list AI agents, Solana blockchain, blockchain innovation, crypto AI agents"
        />
        <meta
          property="og:title"
          content="List Your AI Agent - Gekko AI Marketplace"
        />
        <meta
          property="og:description"
          content="Showcase your AI agent on the Gekko AI marketplace and gain exposure to a global audience. Join the forefront of AI innovation."
        />
        <meta
          property="og:image"
          content="/gekkobanner.jpg"
        />
        <meta property="og:url" content="https://www.aigekko.fun/list-agent" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="List Your AI Agent - Gekko AI Marketplace"
        />
        <meta
          name="twitter:description"
          content="List and showcase your AI agents on the Gekko AI marketplace. Empower the future of AI on Solana."
        />
        <meta
          name="twitter:image"
          content="/gekkobanner.jpg"
        />
        <link
          rel="canonical"
          href="https://www.aigekko.fun/list-agent"
        />
      </Head>
      <Navbar />
      <div className="flex flex-col ">
        <div className="bg-gray-800 text-white">
          {/* Tab Menu */}
          <div className="bg-gray-800 text-white sticky top-0 z-50 border-b-2 border-green-600">
            <ul className="w-full flex justify-start md:justify-center overflow-x-auto no-scrollbar space-x-4 p-2">
              {[
                "New Submission",
                "AI Agent Launchpad",
                "View Submission",
                // "Pricing Plans",
                // "Privacy Policy",
              ].map((tab) => (
                <li
                  key={tab}
                  className={`px-4 py-1 rounded-lg cursor-pointer whitespace-nowrap ${activeTab === tab ? "bg-green-600" : "hover:bg-gray-700"
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


            {activeTab === "New Submission" && (
              <>
                {!connected ? (
                  <div className="flex items-center justify-center h-screen bg-gray-900">
                    <div className="text-center">
                      <img
                        src="https://icons.veryicon.com/png/o/emoticon/emoticon-1/sad-44.png"
                        alt="Sad Face"
                        className="w-40 h-40 mx-auto mb-4"
                      />
                      <p className="text-2xl text-red-500 font-bold mb-4">
                        Wallet Not Connected
                      </p>
                      <p className="text-white text-lg">
                        Please connect your wallet to view your submission agents.
                      </p>
                    </div>
                  </div>

                ) : !isSubmitted ? (
                  <>
                    <div className="lg:p-10">
                      <section className="relative bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-center py-10 overflow-hidden ">
                        <div className="absolute inset-0 animate-pulse opacity-40">
                          <div className="w-[800px] h-[800px] bg-green-700 blur-[150px] rounded-full absolute -top-40 -left-40"></div>
                          <div className="w-[500px] h-[500px] bg-green-600 blur-[100px] rounded-full absolute top-10 right-10"></div>
                        </div>
                        <h1 className="relative text-4xl md:text-6xl font-extrabold text-white z-10">
                          🚀 List Your AI Agent
                        </h1>
                        <p className="relative mt-4 text-lg md:text-xl text-gray-200 z-10">
                          Empowering the future of AI innovation. Showcase your innovative project to the whole world
                        </p>

                      </section></div>
                    <form
                      className="w-full max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg"
                      onSubmit={handleSubmit}
                    >



                      {/* Fetch Data from Contract Address */}
                      <div className="mb-6">
                        <label className="block mb-2">Contract Address:</label>
                        <input
                          type="text"
                          className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600"
                          placeholder="Enter contract address"
                          value={contractAddress}
                          onChange={(e) => setContractAddress(e.target.value)}
                          disabled={!connected}
                        />
                        <button
                          type="button"
                          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 disabled:bg-gray-700 transition-transform transform disabled:scale-100 hover:scale-105"
                          onClick={fetchAgentData}
                          disabled={!connected || isLoading || !contractAddress}
                        >
                          {isLoading ? "Fetching..." : "Fetch Data"}
                        </button>
                      </div>

                      {/* General Information */}
                      <h2 className="text-2xl font-bold py-5 text-green-400">General Information</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name Field */}
                        <div className="space-y-2">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-300"
                          >
                            Name
                          </label>
                          <input
                            id="name"
                            type="text"
                            className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
                            value={agentDetails.name}
                            onChange={(e) =>
                              setAgentDetails({ ...agentDetails, name: e.target.value })
                            }
                            placeholder="Enter the agent's name"
                            required
                          />
                        </div>

                        {/* Ticker Field */}
                        <div className="space-y-2">
                          <label
                            htmlFor="ticker"
                            className="block text-sm font-medium text-gray-300"
                          >
                            Ticker
                          </label>
                          <input
                            id="ticker"
                            type="text"
                            className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
                            value={agentDetails.ticker}
                            onChange={(e) =>
                              setAgentDetails({ ...agentDetails, ticker: e.target.value })
                            }
                            placeholder="Enter the ticker (e.g., BTC)"
                            required
                          />
                        </div>

                        {/* Description Field */}
                        <div className="col-span-1 md:col-span-2 space-y-2">
                          <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-300"
                          >
                            Description
                          </label>
                          <textarea
                            id="description"
                            className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
                            value={agentDetails.description}
                            onChange={(e) =>
                              setAgentDetails({ ...agentDetails, description: e.target.value })
                            }
                            placeholder="Write a brief description of the agent..."
                            required
                          />
                        </div>

                        {/* Type Field */}
                        <div className="space-y-2">
                          <label
                            htmlFor="type"
                            className="block text-sm font-medium text-gray-300"
                          >
                            Type
                          </label>
                          <select
                            id="type"
                            className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
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
                        </div>

                        {/* Chain Field */}
                        <div className="space-y-2">
                          <label
                            htmlFor="chain"
                            className="block text-sm font-medium text-gray-300"
                          >
                            Chain
                          </label>
                          <input
                            id="chain"
                            type="text"
                            className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
                            value={agentDetails.chain}
                            onChange={(e) =>
                              setAgentDetails({ ...agentDetails, chain: e.target.value })
                            }
                            placeholder="Enter the blockchain (e.g., Ethereum)"
                          />
                        </div>
                      </div>

                      {/* Social Information */}
                      <h2 className="text-xl font-bold py-5 text-green-400">Social Information</h2>
                      <button
                        type="button"
                        onClick={() => setIsSocialDropdownOpen(!isSocialDropdownOpen)}
                        className="w-full bg-gradient-to-r from-green-600 to-green-400 text-white px-4 py-2 rounded-lg hover:opacity-90 transition duration-300 shadow-lg"
                      >
                        {isSocialDropdownOpen ? "Hide Social Information" : "Show Social Information"}
                      </button>

                      {isSocialDropdownOpen && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                          {Object.keys(agentDetails.social).map((platform) => (
                            <div key={platform} className="space-y-2">
                              <label
                                htmlFor={platform}
                                className="block text-sm font-medium text-gray-300 capitalize"
                              >
                                {platform} URL:
                              </label>
                              <input
                                type="text"
                                id={platform}
                                className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
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
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Agent Utility */}
                      <h2 className="text-xl font-bold py-5">Agent Utility</h2>
                      {agentDetails.utility.map((utility, index) => (
                        <div
                          key={index}
                          className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
                        >
                          <h3 className="text-lg font-bold text-green-400">
                            Utility {index + 1}
                          </h3>

                          {/* Utility Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Utility Name
                            </label>
                            <input
                              type="text"
                              className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
                              value={utility.name}
                              onChange={(e) =>
                                handleUtilityChange(index, "name", e.target.value)
                              }
                            />
                          </div>

                          {/* Short Description */}
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Short Description (20 words)
                            </label>
                            <textarea
                              className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
                              value={utility.shortDesc}
                              onChange={(e) =>
                                handleUtilityChange(index, "shortDesc", e.target.value)
                              }
                              maxLength="100"
                              placeholder="Provide a concise description..."
                            />
                          </div>

                          {/* Social Type */}
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Social Type
                            </label>
                            <select
                              className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
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
                          </div>

                          {/* Link */}
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Link
                            </label>
                            <input
                              type="text"
                              className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
                              value={utility.link}
                              onChange={(e) =>
                                handleUtilityChange(index, "link", e.target.value)
                              }
                              placeholder="Enter the link for this utility..."
                            />
                          </div>

                          {/* Remove Utility Button */}
                          {agentDetails.utility.length > 1 && (
                            <button
                              type="button"
                              className="block w-full text-red-500 font-medium text-sm hover:underline mt-4"
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
                  </>
                ) : (
                  <p className="text-center text-green-400 h-screen font-bold py-6">
                    🎉 Your submission has been received and it will be reviewed throughly by the team before listing in GEKKO AI marketplace
                  </p>
                )}
              </>
            )}
            {activeTab === "AI Agent Launchpad" && (
              <>
                <AIAgentLaunchpad />
              </>

            )}
            {activeTab === "View Submission" && (
              <>

                <AgentEditor walletAddress={publicKey} />
              </>

            )}
            {activeTab === "Privacy Policy" && (
              <>
                <PrivacyPolicy />
              </>

            )}
            {activeTab === "Pricing Plans" && (
              <>
                <div className="h-screen" />
              </>

            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ListAgent;
