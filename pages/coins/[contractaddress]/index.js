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


  useEffect(() => {
    if (contractaddress) {
      // Fetch data from your own API
      fetch(`/api/getdata?contractAddress=${contractaddress}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch token data from your API.");
          }
          return response.json();
        })
        .then((data) => {
          setDexData((prev) => ({
            ...prev,
            ...data, // Merge data from your API
          }));

          // Fetch additional data from DexScreener API
          return fetch(`https://api.dexscreener.io/latest/dex/tokens/${contractaddress}`);
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch token data from DexScreener.");
          }
          return response.json();
        })
        .then((dexData) => {
          const tokenData = dexData.pairs[0];

          const priceChange24h = tokenData.priceChange?.h24
            ? parseFloat(tokenData.priceChange.h24)
            : null;

          const chainId = tokenData.chainId || null;
          const website = tokenData.info.websites?.[0]?.url || "N/A"; // Extract the primary website URL

          setDexData((prev) => ({
            ...prev,
            priceChange24h,
            chainId,
            website, // Add the website
          }));
          setChainId(chainId); // Also update the local state
        })
        .catch((error) => console.error("Error fetching token data:", error));
    }
  }, [contractaddress]);
  const transformedChainId =
    chainId?.toLowerCase() === "sui" ? "sui-network" : chainId;

  const handleVote = (type) => {
    if (type === "upvote") {
      setUpvotes(upvotes + 1);
    } else {
      setDownvotes(downvotes + 1);
    }
  };
  const dummyDescription =
    "This token is a decentralized finance (DeFi) asset designed for innovative financial applications. With robust market dynamics and a strong community backing, it offers unique features like staking, liquidity provision, and governance participation. The project aims to bring transparency and efficiency to the blockchain space. Its use cases span across various domains such as payments, rewards, and decentralized trading. By integrating smart contract technology, this token ensures secure, trustless, and fast transactions. It represents a new era of digital assets, redefining how blockchain-based tokens operate within the ecosystem.";

  const addComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment("");
    }
  };

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
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white font-professional">
        {/* Desktop Layout */}
        <div className="bg-gray-800 p-2 text-white">
          <Breadcrumb
            paths={[
              { name: "Marketplace", link: "/" },
              { name: "Explorer", link: "/explorer" },
              { name: dexData?.baseToken?.name || "Token Name" },
            ]}
          />
        </div>

        <div className="hidden lg:flex p-4 gap-8">
          {/* Left Section */}

          <div className="bg-gray-800 p-6 rounded-lg w-1/3">
            <div className="flex items-center justify-between mt-4">
              {/* Logo and Name */}
              <div className="flex items-center gap-4">
                <img
                  src={dexData.logo || "/default-logo.png"}
                  alt={dexData.baseToken?.name || "Token Logo"}
                  className="w-16 h-16 rounded-full border-2 border-green-400"
                />
                <div>
                  <h1 className="text-2xl font-bold uppercase text-white">
                    {dexData.name || "Token Name"}
                  </h1>
                  <span className="text-sm bg-green-400 text-black px-2 py-1 rounded-md">
                    {dexData.ticker || "Token Symbol"}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="text-2xl text-green-400">
                  ${dexData.price || "N/A"}
                </p>
                <p className={dexData.priceChange24h < 0 ? "text-red-500" : "text-green-500"}>
                  {dexData.priceChange24h !== null ? `${dexData.priceChange24h}%` : "N/A"}
                </p>
              </div>
            </div>

            {/* Upvote and Downvote Section */}
            <div className="mt-4 flex justify-center items-center gap-4">
              <button
                onClick={() => handleVote("upvote")}
                className="bg-green-500 text-black px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Upvote ({upvotes})
              </button>
              <button
                onClick={() => handleVote("downvote")}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Downvote ({downvotes})
              </button>
            </div>

            {/* Description Section */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
              <p className="text-gray-200">
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
                  className="text-green-400 hover:text-green-300 mt-2 flex items-center gap-2"
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
                chain: dexData.chain, // Add chain field here
              }}
              copied={copied}
              copyToClipboard={copyToClipboard}
              truncateAddress={truncateAddress}
            />

            {/* Social Info Section */}
            <Social links={socialLinks} />
          </div>
          {/* Right Section */}
          <div className="w-2/3">
            <IframeSection chainId={transformedChainId} contractAddress={dexData.contractAddress} />


            <AgentShowcase agents={agents} />

            <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-2 mb-4">
                Community Replies
              </h2>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your reply here..."
                className="w-full h-24 p-3 bg-gray-900 text-gray-200 rounded-lg mt-2 border border-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
              />
              <button
                onClick={addComment}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 mt-4 shadow-md hover:shadow-lg"
              >
                Submit Reply
              </button>
              <div className="mt-6">
                {comments.length > 0 ? (
                  <ul className="space-y-4">
                    {comments.map((comment, index) => (
                      <li
                        key={index}
                        className="p-4 bg-gray-900 rounded-md border border-gray-700 hover:border-green-500 transition-all duration-300"
                      >
                        <p className="text-gray-200">{comment}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No replies yet. Be the first to comment!</p>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Layout with Tabs */}
        <div className="lg:hidden">
          <IframeSection chainId={transformedChainId} contractAddress={dexData.contractAddress} />

          <AgentShowcase agents={agents} />

          <div className="flex justify-around bg-green-600 text-black py-3 text-lg font-semibold">
            <button
              onClick={() => setActiveTab("Info")}
              className={activeTab === "Info" ? "border-b-2 border-black" : ""}
            >
              Info
            </button>
            <button
              onClick={() => setActiveTab("Replies")}
              className={
                activeTab === "Replies" ? "border-b-2 border-black" : ""
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
                    <span className="text-sm bg-green-400 text-black px-2 py-1 rounded-md">
                      {dexData.ticker}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-2xl text-green-400">
                    ${dexData.price || "N/A"}
                  </p>
                  <p className={dexData.priceChange24h < 0 ? "text-red-500" : "text-green-500"}>
                    {dexData.priceChange24h !== null ? `${dexData.priceChange24h}%` : "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-center items-center gap-4">
                <button
                  onClick={() => handleVote("upvote")}
                  className="bg-green-500 text-black px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Upvote ({upvotes})
                </button>
                <button
                  onClick={() => handleVote("downvote")}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Downvote ({downvotes})
                </button>
              </div>
              {/* Description Section */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
                <p className="text-gray-200">
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
                    className="text-green-400 hover:text-green-300 mt-2 flex items-center gap-2"
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
                  chain: dexData.chain, // Add chain field here
                }}
                copied={copied}
                copyToClipboard={copyToClipboard}
                truncateAddress={truncateAddress}
              />

              <Social links={socialLinks} />
            </div>
          )}

          {activeTab === "Replies" && (
            <div className="p-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your reply here..."
                className="w-full h-24 p-2 bg-gray-800 text-white rounded-lg"
              />
              <button
                onClick={addComment}
                className="bg-green-500 text-black px-4 py-2 rounded-lg hover:bg-green-600 mt-2"
              >
                Submit
              </button>
              <ul className="space-y-2 mt-4">
                {comments.map((comment, index) => (
                  <li key={index} className="p-2 bg-gray-700 rounded-md">
                    {comment}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TokenDetail;
