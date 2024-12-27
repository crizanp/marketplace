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
  FaTiktok,
} from "react-icons/fa"; // Import additional icons
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white font-professional">
        {/* Desktop Layout */}
        <div className="bg-gray-800 p-2 text-white">
          <nav className="text-sm flex justify-between lg:justify-center">
            {/* Breadcrumb Navigation */}
            <span className="lg:text-center">
              <Link href="/" passHref>
                <span className="text-gray-400 hover:text-green-400 cursor-pointer">
                  Marketplace
                </span>
              </Link>
              <span className="mx-2 text-gray-500">/</span>
              <Link href="/explorer" passHref>
                <span className="text-gray-400 hover:text-green-400 cursor-pointer">
                  Explorer
                </span>
              </Link>
              <span className="mx-2 text-gray-500">/</span>
              <span className="text-green-400 font-bold">
                {dexData?.baseToken?.name || "Token Name"}
              </span>
            </span>
          </nav>
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

            {/* Token Info Section */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Token Info
              </h2>
              <ul className="space-y-4">
                <li className="flex justify-between items-center border-b border-gray-600 pb-2">
                  <span className="text-gray-400">Market Cap:</span>
                  <span className="text-gray-200">
                    ${dexData.marketCap || "N/A"}
                  </span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-600 pb-2">
                  <span className="text-gray-400">Liquidity:</span>
                  <span className="text-gray-200">
                    ${dexData.liquidity?.usd || "N/A"}
                  </span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-600 pb-2">
                  <span className="text-gray-400">Chain:</span>
                  <span className="text-gray-200">
                    {dexData.chainId || "N/A"}
                  </span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-600 pb-2">
                  <span className="text-gray-400">24 Hour Volume:</span>
                  <span className="text-gray-200">
                    ${dexData.volume?.h24 || "N/A"}
                  </span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-600 pb-2">
                  <span className="text-gray-400">Contract Address:</span>
                  <span className="flex items-center gap-2">
                    <span className="text-gray-200">
                      {truncateAddress(contractaddress)}
                    </span>
                    <button
                      onClick={copyToClipboard}
                      className="text-green-400 hover:text-green-300 focus:outline-none"
                    >
                      {copied ? <FaCheck /> : <FaRegCopy />}
                    </button>
                  </span>
                </li>
              </ul>
            </div>

            {/* Social Info Section */}

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Social Info
              </h2>
              <div className="flex gap-4 flex-wrap">
                {/* Website */}
                <a
                  href={dexData?.info?.website || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400"
                >
                  <FaGlobe size={24} />
                </a>

                {/* Telegram */}
                <a
                  href={dexData?.info?.telegram || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400"
                >
                  <FaTelegram size={24} />
                </a>

                {/* Twitter */}
                <a
                  href={dexData?.info?.twitter || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400"
                >
                  <FaTwitter size={24} />
                </a>

                {/* Instagram */}
                <a
                  href={dexData?.info?.instagram || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400"
                >
                  <FaInstagram size={24} />
                </a>

                {/* Facebook */}
                <a
                  href={dexData?.info?.facebook || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400"
                >
                  <FaFacebook size={24} />
                </a>

                {/* GitHub */}
                <a
                  href={dexData?.info?.github || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400"
                >
                  <FaGithub size={24} />
                </a>

                {/* Reddit */}
                <a
                  href={dexData?.info?.reddit || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400"
                >
                  <FaReddit size={24} />
                </a>

                {/* LinkedIn */}
                <a
                  href={dexData?.info?.linkedin || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400"
                >
                  <FaLinkedin size={24} />
                </a>

                {/* YouTube */}
                <a
                  href={dexData?.info?.youtube || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400"
                >
                  <FaYoutube size={24} />
                </a>

                {/* Discord */}
                <a
                  href={dexData?.info?.discord || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400"
                >
                  <FaDiscord size={24} />
                </a>

                {/* Medium */}
                <a
                  href={dexData?.info?.medium || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400"
                >
                  <FaMedium size={24} />
                </a>

                {/* Pinterest */}
                <a
                  href={dexData?.info?.pinterest || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400"
                >
                  <FaPinterest size={24} />
                </a>

                {/* Snapchat */}
                <a
                  href={dexData?.info?.snapchat || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400"
                >
                  <FaTiktok size={24} />
                </a>
              </div>
            </div>
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
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Token Info
                </h2>
                <ul className="space-y-4">
                  <li className="flex justify-between items-center border-b border-gray-600 pb-2">
                    <span className="text-gray-400">Market Cap:</span>
                    <span className="text-gray-200">
                      ${dexData.marketCap || "N/A"}
                    </span>
                  </li>
                  <li className="flex justify-between items-center border-b border-gray-600 pb-2">
                    <span className="text-gray-400">Liquidity:</span>
                    <span className="text-gray-200">
                      ${dexData.liquidity?.usd || "N/A"}
                    </span>
                  </li>
                  <li className="flex justify-between items-center border-b border-gray-600 pb-2">
                    <span className="text-gray-400">Chain:</span>
                    <span className="text-gray-200">
                      {dexData.chainId || "N/A"}
                    </span>
                  </li>
                  <li className="flex justify-between items-center border-b border-gray-600 pb-2">
                    <span className="text-gray-400">24 Hour Volume:</span>
                    <span className="text-gray-200">
                      ${dexData.volume?.h24 || "N/A"}
                    </span>
                  </li>
                  <li className="flex justify-between items-center border-b border-gray-600 pb-2">
                    <span className="text-gray-400">Contract Address:</span>
                    <span className="flex items-center gap-2">
                      <span className="text-gray-200">
                        {truncateAddress(contractaddress)}
                      </span>
                      <button
                        onClick={copyToClipboard}
                        className="text-green-400 hover:text-green-300 focus:outline-none"
                      >
                        {copied ? <FaCheck /> : <FaRegCopy />}
                      </button>
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Social Info
                </h2>
                <div className="flex gap-4 flex-wrap">
                  {/* Website */}
                  <a
                    href={dexData?.info?.website || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-green-400"
                  >
                    <FaGlobe size={24} />
                  </a>

                  {/* Telegram */}
                  <a
                    href={dexData?.info?.telegram || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-green-400"
                  >
                    <FaTelegram size={24} />
                  </a>

                  {/* Twitter */}
                  <a
                    href={dexData?.info?.twitter || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-green-400"
                  >
                    <FaTwitter size={24} />
                  </a>

                  {/* Instagram */}
                  <a
                    href={dexData?.info?.instagram || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-green-400"
                  >
                    <FaInstagram size={24} />
                  </a>

                  {/* Facebook */}
                  <a
                    href={dexData?.info?.facebook || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-green-400"
                  >
                    <FaFacebook size={24} />
                  </a>

                  {/* GitHub */}
                  <a
                    href={dexData?.info?.github || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-green-400"
                  >
                    <FaGithub size={24} />
                  </a>

                  {/* Reddit */}
                  <a
                    href={dexData?.info?.reddit || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-green-400"
                  >
                    <FaReddit size={24} />
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={dexData?.info?.linkedin || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-green-400"
                  >
                    <FaLinkedin size={24} />
                  </a>

                  {/* YouTube */}
                  <a
                    href={dexData?.info?.youtube || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-green-400"
                  >
                    <FaYoutube size={24} />
                  </a>

                  {/* Discord */}
                  <a
                    href={dexData?.info?.discord || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-green-400"
                  >
                    <FaDiscord size={24} />
                  </a>

                  {/* Medium */}
                  <a
                    href={dexData?.info?.medium || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-green-400"
                  >
                    <FaMedium size={24} />
                  </a>

                  {/* Pinterest */}
                  <a
                    href={dexData?.info?.pinterest || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-green-400"
                  >
                    <FaPinterest size={24} />
                  </a>

                  {/* Snapchat */}
                  <a
                    href={dexData?.info?.snapchat || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-green-400"
                  >
                    <FaTiktok size={24} />
                  </a>
                </div>
              </div>
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
