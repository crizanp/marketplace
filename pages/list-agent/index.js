import { useState } from "react";
import styles from "../../styles/ListAgent.module.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ListAgent = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [contractAddress, setContractAddress] = useState("");
  const [agentDetails, setAgentDetails] = useState({
    name: "",
    ticker: "",
    logoUrl: "",
    priceUsd: "",
    volume24h: "",
    marketCap: "",
    liquidity: "",
    description: "",
    twitter: "",
    telegram: "",
    website: "",
    contractAddress: "",
    chain: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showMessage, setShowMessage] = useState(false); // State to control floating message

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
          info,
        } = firstPair;

        setAgentDetails((prev) => ({
          ...prev,
          name: baseToken.name || "",
          ticker: baseToken.symbol || "",
          logoUrl: info?.imageUrl || "",
          priceUsd: priceUsd || "",
          volume24h: volume?.h24 || "",
          marketCap: marketCap || "",
          liquidity: liquidity?.usd || "",
          chain: chainId || "",
          twitter: info?.socials?.find((s) => s.type === "twitter")?.url || "",
          telegram:
            info?.socials?.find((s) => s.type === "telegram")?.url || "",
          website: info?.websites?.[0]?.url || "",
          contractAddress,
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

  const handleTabClick = () => {
    // Show the floating message when any tab is clicked
    setShowMessage(true);

    // Hide the floating message after 3 seconds
    setTimeout(() => setShowMessage(false), 3000);
  };

  return (
    <>
      <Navbar />
      <div className={styles.wrapper}>
        {/* Floating Message */}
        {showMessage && (
          <div className={styles.floatingMessage}>
            Full version will be released on Jan 1, this is just a prototype.
          </div>
        )}

        {/* Sidebar for large screens */}
        <div className={styles.sidebar}>
          <ul>
            {[
              "New Submission",
              "AI Agent Launchpad",

              "View Submission",
              "Pricing Plans",
              "Privacy Policy",
            ].map((tab) => (
              <li
                key={tab}
                onClick={handleTabClick} // Trigger floating message on click
              >
                {tab}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          <h1 className={styles.title}>📤 List Your AI Agent</h1>

          {/* Wallet Connection */}
          <div className={styles.walletSection}>
            {/* <button className={styles.walletButton} onClick={connectWallet}>
              {isWalletConnected ? "🔌 Wallet Connected" : "💼 Connect Wallet"}
            </button> */}
            {!isWalletConnected && (
              <p className={styles.warning}>
                You must connect your wallet to list an agent.
              </p>
            )}
          </div>

          {/* Contract Address Field */}
          <div className={styles.contractSection}>
            <label>
              Contract Address:
              <input
                type="text"
                placeholder="Enter contract address"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                disabled={!isWalletConnected}
              />
            </label>
            <button
              onClick={fetchAgentData}
              className={styles.fetchButton}
              disabled={!isWalletConnected || !contractAddress || isLoading}
            >
              {isLoading ? "Fetching..." : "Fetch Data"}
            </button>
          </div>

          {/* Agent Listing Form */}
          {!isSubmitted ? (
            <form onSubmit={fetchAgentData} className={styles.agentForm}>
              {/* Non-Editable Real-Time Fields */}
              <div className={styles.realTimeData}>
                {agentDetails.logoUrl && (
                  <img
                    src={agentDetails.logoUrl}
                    alt="Token Logo"
                    className={styles.tokenImage}
                  />
                )}
                <p>
                  <strong>Chain:</strong> {agentDetails.chain || "N/A"}
                </p>
                <p>
                  <strong>Price (USD):</strong> $
                  {agentDetails.priceUsd || "N/A"}
                </p>
                <p>
                  <strong>24h Volume:</strong> $
                  {agentDetails.volume24h || "N/A"}
                </p>
                <p>
                  <strong>Market Cap:</strong> $
                  {agentDetails.marketCap || "N/A"}
                </p>
                <p>
                  <strong>Liquidity:</strong> ${agentDetails.liquidity || "N/A"}
                </p>
              </div>

              {/* Editable Fields */}
              <label>
                Agent Name:
                <input
                  type="text"
                  name="name"
                  value={agentDetails.name}
                  onChange={(e) =>
                    setAgentDetails({ ...agentDetails, name: e.target.value })
                  }
                  disabled={!isWalletConnected}
                  required
                />
              </label>
              <label>
                Ticker:
                <input
                  type="text"
                  name="ticker"
                  value={agentDetails.ticker}
                  onChange={(e) =>
                    setAgentDetails({ ...agentDetails, ticker: e.target.value })
                  }
                  disabled={!isWalletConnected}
                  required
                />
              </label>
              <label>
                Logo URL:
                <input
                  type="text"
                  name="logoUrl"
                  value={agentDetails.logoUrl}
                  onChange={(e) =>
                    setAgentDetails({
                      ...agentDetails,
                      logoUrl: e.target.value,
                    })
                  }
                  disabled={!isWalletConnected}
                />
              </label>
              <label>
                Description:
                <textarea
                  name="description"
                  value={agentDetails.description}
                  onChange={(e) =>
                    setAgentDetails({
                      ...agentDetails,
                      description: e.target.value,
                    })
                  }
                  disabled={!isWalletConnected}
                  required
                />
              </label>
              <label>
                Twitter URL:
                <input
                  type="text"
                  name="twitter"
                  value={agentDetails.twitter}
                  onChange={(e) =>
                    setAgentDetails({
                      ...agentDetails,
                      twitter: e.target.value,
                    })
                  }
                  disabled={!isWalletConnected}
                />
              </label>
              <label>
                Telegram URL:
                <input
                  type="text"
                  name="telegram"
                  value={agentDetails.telegram}
                  onChange={(e) =>
                    setAgentDetails({
                      ...agentDetails,
                      telegram: e.target.value,
                    })
                  }
                  disabled={!isWalletConnected}
                />
              </label>
              <label>
                Website URL:
                <input
                  type="text"
                  name="website"
                  value={agentDetails.website}
                  onChange={(e) =>
                    setAgentDetails({
                      ...agentDetails,
                      website: e.target.value,
                    })
                  }
                  disabled={!isWalletConnected}
                />
              </label>

              <button
                type="submit"
                disabled={!isWalletConnected}
                className={styles.submitButton}
              >
                Submit
              </button>
            </form>
          ) : (
            <p className={styles.successMessage}>
              🎉 Your submission has been received and is under review!
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ListAgent;
