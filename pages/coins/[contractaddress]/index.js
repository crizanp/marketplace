import AgentShowcase from "@/components/detailPage/AgentShowcase";
import Breadcrumb from "@/components/detailPage/Breadcrumb";
import IframeSection from "@/components/detailPage/IframeSection";
import Social from "@/components/detailPage/Social";
import TokenInfo from "@/components/detailPage/TokenInfo";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import DetailPageSkeleton from "@/components/Skeleton/DetailPageSkeleton";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaRegCopy, FaCheck } from "react-icons/fa";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Import icons
import { useWallet } from "@solana/wallet-adapter-react";
import Head from 'next/head';

import {
  FaTelegram,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaGithub,
  FaReddit,
  FaGlobe,
  FaLinkedin,
  FaYoutube,
  FaDiscord,
  FaMedium,
  FaPinterest,
  FaSnapchat,
} from "react-icons/fa";
import CommentsSection from "@/components/CommentsSection";
import VoteButtons from "@/components/VoteButtons";
const TokenDetail = () => {
  const router = useRouter();
  const { contractaddress } = router.query;

  const [dexData, setDexData] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [activeTab, setActiveTab] = useState("Info");
  const [chainId, setChainId] = useState("");
  const [copied, setCopied] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [replyToComment, setReplyToComment] = useState(null);
  const [replyContent, setReplyContent] = useState(""); // For storing the reply content

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { connected, publicKey } = useWallet(); // Wallet hooks
  const contractAddress = { contractaddress }; // Replace with dynamic contract address
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!contractaddress) return;

        // Fetch data from your API
        const apiResponse = await fetch(`/api/getdata?contractAddress=${contractaddress}`);
        if (!apiResponse.ok) {
          throw new Error("Failed to fetch token data from your API.");
        }
        const apiData = await apiResponse.json();

        setDexData((prev) => ({
          ...prev,
          ...apiData,
        }));

        // Fetch data from DexScreener API
        const dexResponse = await fetch(`https://api.dexscreener.io/latest/dex/tokens/${contractaddress}`);
        if (!dexResponse.ok) {
          throw new Error("Failed to fetch token data from DexScreener.");
        }
        const dexData = await dexResponse.json();
        const tokenData = dexData.pairs[0];

        const priceChange24h = tokenData.priceChange?.h24 ? parseFloat(tokenData.priceChange.h24) : null;
        const chainId = tokenData.chainId || null;
        const website = tokenData.info?.websites?.[0]?.url || "https://aigekko.fun";

        setDexData((prev) => ({
          ...prev,
          priceChange24h,
          chainId,
          website,
        }));
        setChainId(chainId);

        const commentsResponse = await fetch(`/api/comments?contractAddress=${contractaddress}`);
        if (!commentsResponse.ok) {
          throw new Error("Failed to fetch comments.");
        }
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };


    fetchData();
  }, [contractaddress]);

  const transformedChainId =
    chainId?.toLowerCase() === "sui" ? "sui-network" : chainId;
  chainId?.toLowerCase() === "Bsc" ? "bsc" : chainId;

  const handleVote = (type) => {
    if (type === "upvote") {
      setUpvotes(upvotes + 1);
    } else {
      setDownvotes(downvotes + 1);
    }
  };
  const dummyDescription =
    "This token is a decentralized finance (DeFi) asset designed for innovative financial applications. With robust market dynamics and a strong community backing, it offers unique features like staking, liquidity provision, and governance participation. The project aims to bring transparency and efficiency to the blockchain space. Its use cases span across various domains such as payments, rewards, and decentralized trading. By integrating smart contract technology, this token ensures secure, trustless, and fast transactions. It represents a new era of digital assets, redefining how blockchain-based tokens operate within the ecosystem.";


  const copyToClipboard = () => {
    if (contractaddress) {
      navigator.clipboard.writeText(contractaddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    }
  };

  const truncateAddress = (address) => {
    if (!address) return "N/A";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!dexData) {
    return (
      <DetailPageSkeleton />
    );
  }
  const socialLinks = {
    twitter: dexData.social?.twitter || "",
    telegram: dexData.social?.telegram || "",
    instagram: dexData.social?.instagram || "",
    facebook: dexData.social?.facebook || "",
    github: dexData.social?.github || "",
    reddit: dexData.social?.reddit || "",
    linkedin: dexData.social?.linkedin || "",
    youtube: dexData.social?.youtube || "",
    discord: dexData.social?.discord || "",
    medium: dexData.social?.medium || "",
    pinterest: dexData.social?.pinterest || "",
    snapchat: dexData.social?.snapchat || "",
    website: dexData.website || ""
  };

  const agents = dexData.utility?.map((utility) => {
    // Map social types to icons
    const socialIcons = {
      twitter: <FaTwitter />,
      facebook: <FaFacebook />,
      instagram: <FaInstagram />,
      github: <FaGithub />,
      linkedin: <FaLinkedin />,
      youtube: <FaYoutube />,
      reddit: <FaReddit />,
      discord: <FaDiscord />,
      medium: <FaMedium />,
      pinterest: <FaPinterest />,
      snapchat: <FaSnapchat />,
      telegram: <FaTelegram />,
    };

    // Default to globe icon if type is not matched
    const icon = socialIcons[utility.socialType?.toLowerCase()] || <FaGlobe />;

    return {
      name: utility.name,
      description: utility.shortDesc,
      icon,
      link: utility.link?.startsWith("http") ? utility.link : `https://${utility.link}`, // Sanitize link
    };
  });
  return (
    <>
      <Head>
        <title>{dexData.name} ({dexData.ticker}) - Market Details | Gekko AI</title>
        <meta name="description" content={`${dexData.name} (${dexData.ticker}) is a DeFi token on ${dexData.chain}. Current price: $${dexData.price}. Market cap: ${dexData.marketCap}. Learn more on Gekko AI.`} />
        <meta name="keywords" content={`crypto, token, ${dexData.name}, ${dexData.ticker}, ${dexData.chain}, DeFi, ${dexData.baseToken?.name}`} />
        <meta property="og:title" content={`${dexData.name} (${dexData.ticker}) - Market Details | Gekko AI`} />
        <meta property="og:description" content={`Explore ${dexData.name} (${dexData.ticker}), a ${dexData.chain}-based token. Price: $${dexData.price}, Market Cap: ${dexData.marketCap}, Volume: ${dexData.volume24h}.`} />
        <meta property="og:image" content={dexData.logo || "/gekkobanner.jpg"} />
        <meta property="og:url" content={`https://www.aigekko.fun/token/${dexData.contractAddress}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${dexData.name} (${dexData.ticker}) - Market Details | Gekko AI`} />
        <meta name="twitter:description" content={`Explore ${dexData.name} (${dexData.ticker}) with current price $${dexData.price} and market cap ${dexData.marketCap}.`} />
        <meta name="twitter:image" content={dexData.logo || "/gekkobanner.jpg"} />
        <link rel="canonical" href={`https://www.aigekko.fun/token/${dexData.contractAddress}`} />
      </Head>
      <Navbar />
      <div className="min-h-screen bg-white text-gray-900 font-professional">
        {/* Desktop Layout */}
        <div className="bg-green-50 p-2 text-gray-900">
          <Breadcrumb
            paths={[
              { name: "Trade", link: "/" },
              { name: "Explorer", link: "/explorer" },
              { name: dexData.name, ticker: dexData.ticker },
            ]}
          />
        </div>

        <div className="hidden lg:flex p-4 gap-8">
          {/* Left Section */}

        
          {/* Right Section */}
          <div className="w-2/3">
            <IframeSection chainId={transformedChainId} contractAddress={dexData.contractAddress} />


            <AgentShowcase agents={agents} />

            <CommentsSection
              contractAddress={contractaddress}
              truncateAddress={truncateAddress}
              publicKey={publicKey}
              connected={connected}
            />


          </div>
          <div className="bg-green-50 p-6 rounded-lg w-1/3">
            <div className="flex items-center justify-between mt-4">
              {/* Logo and Name */}
              <div className="flex items-center gap-4">
                <img
                  src={dexData.logo || "/default-logo.png"}
                  alt={dexData.baseToken?.name || "Token Logo"}
                  className="w-16 h-16 rounded-full border-2 border-green-400"
                />
                <div>
                  <h1 className="text-2xl font-bold uppercase text-gray-900">
                    {dexData.name || "Token Name"}
                  </h1>
                  <span className="text-sm bg-green-400 text-white px-2 py-1 rounded-md">
                    {dexData.ticker || "Token Symbol"}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="text-2xl text-green-600">
                  ${dexData.price || "N/A"}
                </p>
                <p className={dexData.priceChange24h < 0 ? "text-red-500" : "text-green-500"}>
                  {dexData.priceChange24h !== null ? `${dexData.priceChange24h}%` : "N/A"}
                </p>
              </div>
            </div>

            {/* Upvote and Downvote Section */}
            <VoteButtons contractAddress={contractaddress} walletAddress={publicKey?.toString()} />


            {/* Description Section */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700">
                {showFullDescription
                  ? dexData.description || "No description provided."
                  : (dexData.description || "No description provided.")
                    .split(" ")
                    .slice(0, 20)
                    .join(" ")}
                {!showFullDescription &&
                  dexData.description &&
                  dexData.description.split(" ").length > 20 &&
                  "..."}
              </p>
              {dexData.description && dexData.description.split(" ").length > 20 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-green-600 hover:text-green-500 mt-2 flex items-center gap-2"
                >
                  {showFullDescription ? (
                    <>
                      See Less <FaChevronUp />
                    </>
                  ) : (
                    <>
                      See More <FaChevronDown />
                    </>
                  )}
                </button>
              )}
            </div>


            <TokenInfo
  data={{
    marketCap: dexData.marketCap,
    liquidity: dexData.liquidity,
    volume24h: dexData.volume24h,
    contractAddress: dexData.contractAddress,
    chain: dexData.chain,
    ticker: dexData.ticker, // Add ticker here
    name: dexData.name,     // Add name here
    logo: dexData.logo      // Optional: add logo if you want to display it
  }}
  copied={copied}
  copyToClipboard={copyToClipboard}
  truncateAddress={truncateAddress}
/>

            {/* Social Info Section */}
            <Social links={socialLinks} />
          </div>
        </div>

        {/* Mobile Layout with Tabs */}
        <div className="lg:hidden">
          <IframeSection chainId={transformedChainId} contractAddress={dexData.contractAddress} />

          <AgentShowcase agents={agents} />

          <div className="flex justify-around bg-green-600 text-white py-3 text-lg font-semibold">
            <button
              onClick={() => setActiveTab("Info")}
              className={activeTab === "Info" ? "border-b-2 border-white" : ""}
            >
              Info
            </button>
            <button
              onClick={() => setActiveTab("Replies")}
              className={
                activeTab === "Replies" ? "border-b-2 border-white" : ""
              }
            >
              Replies
            </button>
          </div>

          {activeTab === "Info" && (
            <div className="p-4">
              <div className="flex items-center justify-between mt-4">
                {/* Logo and Name */}
                <div className="flex items-center gap-4">
                  <img
                    src={dexData.logo || "/default-logo.png"}
                    alt={dexData.baseToken?.name || "Token Logo"}
                    className="w-16 h-16 rounded-full border-2 border-green-400"
                  />
                  <div>
                    <h1 className="text-2xl font-bold uppercase">
                      {dexData.name || "Token Name"}
                    </h1>
                    <span className="text-sm bg-green-400 text-white px-2 py-1 rounded-md">
                      {dexData.ticker}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-2xl text-green-600">
                    ${dexData.price || "N/A"}
                  </p>
                  <p className={dexData.priceChange24h < 0 ? "text-red-500" : "text-green-500"}>
                    {dexData.priceChange24h !== null ? `${dexData.priceChange24h}%` : "N/A"}
                  </p>
                </div>
              </div>

              <VoteButtons contractAddress={contractaddress} walletAddress={publicKey?.toString()} />

              {/* Description Section */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700">
                  {showFullDescription
                    ? dexData.description || "No description provided."
                    : (dexData.description || "No description provided.")
                      .split(" ")
                      .slice(0, 20)
                      .join(" ")}
                  {!showFullDescription &&
                    dexData.description &&
                    dexData.description.split(" ").length > 20 &&
                    "..."}
                </p>
                {dexData.description && dexData.description.split(" ").length > 20 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-green-600 hover:text-green-500 mt-2 flex items-center gap-2"
                  >
                    {showFullDescription ? (
                      <>
                        See Less <FaChevronUp />
                      </>
                    ) : (
                      <>
                        See More <FaChevronDown />
                      </>
                    )}
                  </button>
                )}
              </div>
              <TokenInfo
  data={{
    marketCap: dexData.marketCap,
    liquidity: dexData.liquidity,
    volume24h: dexData.volume24h,
    contractAddress: dexData.contractAddress,
    chain: dexData.chain,
    ticker: dexData.ticker, // Add ticker here
    name: dexData.name,     // Add name here
    logo: dexData.logo      // Optional: add logo if you want to display it
  }}
  copied={copied}
  copyToClipboard={copyToClipboard}
  truncateAddress={truncateAddress}
/>

              <Social links={socialLinks} />
            </div>
          )}

          {activeTab === "Replies" && (
            <CommentsSection
              contractAddress={contractaddress}
              truncateAddress={truncateAddress}
              publicKey={publicKey}
              connected={connected}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TokenDetail;