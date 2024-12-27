import AgentShowcase from "@/components/detailPage/AgentShowcase";
import Breadcrumb from "@/components/detailPage/Breadcrumb";
import Social from "@/components/detailPage/Social";
import TokenInfo from "@/components/detailPage/TokenInfo";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
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
      fetch(`https://api.dexscreener.com/latest/dex/tokens/${contractaddress}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch token data.");
          }
          return response.json();
        })
        .then((data) => {
          if (data && data.pairs && data.pairs.length > 0) {
            const tokenData = data.pairs[0];
            setDexData(tokenData);
            setChainId(tokenData.chainId);
          }
        })
        .catch((error) =>
          console.error("Error fetching DexScreener data:", error)
        );
    }
  }, [contractaddress]);

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
      <div className="flex flex-col items-center text-gray-200">
        <h1 className="text-2xl">Loading...</h1>
        <p>Fetching data for contract: {contractaddress}</p>
      </div>
    );
  }
  const socialLinks = {
    website: "https://example.com",
    telegram: "https://t.me/example",
    twitter: "https://twitter.com/example",
    instagram: "https://instagram.com/example",
    facebook: "https://facebook.com/example",
    github: "https://github.com/example",
    reddit: "https://reddit.com/r/example",
    linkedin: "https://linkedin.com/company/example",
    youtube: "https://youtube.com/c/example",
    discord: "https://discord.gg/example",
    medium: "https://medium.com/@example",
    pinterest: "https://pinterest.com/example",
    snapchat: "https://snapchat.com/add/example",
  };
  const agents = [
    {
      name: "Twitter Agent",
      description: "Stay updated with real-time tweets and notifications.",
      icon: <FaTwitter />,
    },
    {
      name: "Telegram Agent",
      description: "Join our community and receive instant updates.",
      icon: <FaTelegram />,
    },
    {
      name: "Facebook Agent",
      description: "Connect with us on Facebook for regular updates.",
      icon: <FaFacebook />,
    },
    {
      name: "Discord Agent",
      description: "Engage with us on Discord for direct support.",
      icon: <FaDiscord />,
    },
    {
      name: "Instagram Agent",
      description: "Follow us for visually engaging updates.",
      icon: <FaInstagram />,
    },
  ];



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
                  src={dexData.info?.imageUrl || "/default-logo.png"}
                  alt={dexData.baseToken?.name || "Token Logo"}
                  className="w-16 h-16 rounded-full border-2 border-green-400"
                />
                <div>
                  <h1 className="text-2xl font-bold uppercase text-white">
                    {dexData.baseToken?.name || "Token Name"}
                  </h1>
                  <span className="text-sm bg-green-400 text-black px-2 py-1 rounded-md">
                    {dexData.baseToken?.symbol}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="text-2xl text-green-400">
                  ${dexData.priceUsd || "N/A"}
                </p>
                <p
                  className={
                    dexData.priceChange?.h24 < 0
                      ? "text-red-500"
                      : "text-green-500"
                  }
                >
                  {dexData.priceChange?.h24
                    ? `${dexData.priceChange.h24}%`
                    : "N/A"}
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
              <h2 className="text-xl font-semibold text-white mb-4">
                Description
              </h2>
              <p className="text-gray-200">
                {showFullDescription
                  ? dummyDescription
                  : dummyDescription.split(" ").slice(0, 20).join(" ")}
                {!showFullDescription &&
                  dummyDescription.split(" ").length > 20 &&
                  "..."}
              </p>
              {dummyDescription.split(" ").length > 20 && (
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
              data={{ ...dexData, contractAddress: contractaddress }}
              copied={copied}
              copyToClipboard={copyToClipboard}
              truncateAddress={truncateAddress}
            />


            {/* Social Info Section */}
            <Social links={socialLinks} />
          </div>
          {/* Right Section */}
          <div className="w-2/3">
            <iframe
              className="w-full h-[400px] rounded-lg" // Increased height
              title="GeckoTerminal Embed"
              src={`https://www.geckoterminal.com/${chainId}/pools/${dexData.pairAddress}?embed=1&info=0&swaps=0&grayscale=1&light_chart=0`}
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <AgentShowcase agents={agents} />

            <div className="mt-6 bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl">Community Replies</h2>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your reply here..."
                className="w-full h-24 p-2 bg-gray-800 text-white rounded-lg mt-2"
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
          </div>
        </div>

        {/* Mobile Layout with Tabs */}
        <div className="lg:hidden">
          <div className="p-4">
            <iframe
              className="w-full h-96 rounded-lg"
              title="GeckoTerminal Embed"
              src={`https://www.geckoterminal.com/${chainId}/pools/${dexData.pairAddress}?embed=1&info=0&swaps=0&grayscale=1&light_chart=0`}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
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
                    src={dexData.info?.imageUrl || "/default-logo.png"}
                    alt={dexData.baseToken?.name || "Token Logo"}
                    className="w-16 h-16 rounded-full border-2 border-green-400"
                  />
                  <div>
                    <h1 className="text-2xl font-bold uppercase">
                      {dexData.baseToken?.name || "Token Name"}
                    </h1>
                    <span className="text-sm bg-green-400 text-black px-2 py-1 rounded-md">
                      {dexData.baseToken?.symbol}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-2xl text-green-400">
                    ${dexData.priceUsd || "N/A"}
                  </p>
                  <p
                    className={
                      dexData.priceChange?.h24 < 0
                        ? "text-red-500"
                        : "text-green-500"
                    }
                  >
                    {dexData.priceChange?.h24
                      ? `${dexData.priceChange.h24}%`
                      : "N/A"}
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
                <h2 className="text-xl font-semibold text-white mb-4">
                  Description
                </h2>
                <p className="text-gray-200">
                  {showFullDescription
                    ? dummyDescription
                    : dummyDescription.split(" ").slice(0, 20).join(" ")}
                  {!showFullDescription &&
                    dummyDescription.split(" ").length > 20 &&
                    "..."}
                </p>
                {dummyDescription.split(" ").length > 20 && (
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
                data={{ ...dexData, contractAddress: contractaddress }}
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
