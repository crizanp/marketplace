import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaCoins, FaTelegram, FaTwitter, FaReddit } from "react-icons/fa";
import styles from "../../../styles/DetailPage.module.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TokenDetail = () => {
  const router = useRouter();
  const { contractaddress } = router.query;

  const [dexData, setDexData] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);

  const [chainId, setChainId] = useState("");

  useEffect(() => {
    if (contractaddress) {
      fetch(`https://api.dexscreener.com/latest/dex/tokens/${contractaddress}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.pairs && data.pairs.length > 0) {
            const tokenData = data.pairs[0];
            setDexData(tokenData);
            setChainId(tokenData.chainId); // Set the chainId here
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

  const addComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment("");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractaddress);
  };

  if (!dexData) {
    return (
      <div className={styles.error}>
        <h1>Loading...</h1>
        <p>Fetching data for contract: {contractaddress}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.left}>
          {/* Token Information */}
          <div className={styles.topSection}>
            <img
              src={dexData.info?.imageUrl || "/default-logo.png"}
              alt={dexData.baseToken?.name || "Token Logo"}
              className={styles.logo}
            />
            <div>
              <h1 className={styles.tokenName}>
                {dexData.baseToken?.name || "Token Name"}
              </h1>
              <span className={styles.rank}>{dexData.baseToken?.symbol}</span>
            </div>
            <div className={styles.priceSection}>
              <h2 className={styles.price}>${dexData.priceUsd || "N/A"}</h2>
              <span
                className={`${styles.priceChange} ${
                  dexData.priceChange?.h24 < 0
                    ? styles.negative
                    : styles.positive
                }`}
              >
                {dexData.priceChange?.h24
                  ? `${dexData.priceChange.h24}%`
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* Upvote/Downvote Section */}
          <div className={styles.voteSection}>
            <button
              onClick={() => handleVote("upvote")}
              className={styles.upvoteBtn}
            >
              👍 Upvote ({upvotes})
            </button>
            <button
              onClick={() => handleVote("downvote")}
              className={styles.downvoteBtn}
            >
              👎 Downvote ({downvotes})
            </button>
          </div>

          {/* Token Data Section */}
          <h2 className={styles.sectionTitle}>Token Data</h2>
          <div className={styles.metrics}>
            <p>
              <span className={styles.label}>Market Cap:</span>
              <span className={styles.value}>
                ${dexData.marketCap || "N/A"}
              </span>
            </p>
            <p>
              <span className={styles.label}>Fully Diluted Valuation:</span>
              <span className={styles.value}>${dexData.fdv || "N/A"}</span>
            </p>
            <p>
              <span className={styles.label}>24 Hour Trading Vol:</span>
              <span className={styles.value}>
                ${dexData.volume?.h24 || "N/A"}
              </span>
            </p>
            <p>
              <span className={styles.label}>Liquidity:</span>
              <span className={styles.value}>
                ${dexData.liquidity?.usd || "N/A"}
              </span>
            </p>
          </div>

          {/* More Info Section */}
          <h2 className={styles.sectionTitle}>More Info</h2>
          <div className={styles.metrics}>
            <p>
              <span className={styles.label}>Contract Address:</span>
              <span className={styles.value}>
                {contractaddress.slice(0, 6)}...{contractaddress.slice(-4)}
                <button onClick={copyToClipboard} className={styles.copyIcon}>
                  📋
                </button>
              </span>
            </p>
            <p>
              <span className={styles.label}>Website:</span>
              <span className={styles.value}>
                <a
                  href={dexData.info?.websites?.[0] || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Visit
                </a>
              </span>
            </p>
            <p>
              <span className={styles.label}>Listed by:</span>
              <span className={styles.value}>
                <FaCoins /> CMC | <FaCoins /> CG
              </span>
            </p>
          </div>

          {/* Chain Data Section */}
          <h2 className={styles.sectionTitle}>Chain Data</h2>
          <div className={styles.metrics}>
            <p>
              <span className={styles.label}>Chain:</span>
              <span className={styles.value}>{dexData.chain || "N/A"}</span>
            </p>
            <p>
              <span className={styles.label}>Explorer:</span>
              <span className={styles.value}>
                <a
                  href={`https://explorer.solana.com/address/${contractaddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  View on Explorer
                </a>
              </span>
            </p>
          </div>

          {/* Social Icons Section */}
          <div className={styles.socials}>
            <span className={styles.socialsLabel}>Socials:</span>
            <div className={styles.socialIcons}>
              <a
                href="https://t.me/example"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
              >
                <FaTelegram />
              </a>
              <a
                href="https://twitter.com/example"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="https://reddit.com/example"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Reddit"
              >
                <FaReddit />
              </a>
            </div>
          </div>
        </div>

        {/* Chart and Replies Section */}
        <div className={styles.right}>
          <iframe
            className={styles.chartIframe}
            title="GeckoTerminal Embed"
            src={`https://www.geckoterminal.com/${chainId}/pools/${dexData.pairAddress}?embed=1&info=0&swaps=0&grayscale=1&light_chart=0`}
            frameBorder="0"
            allowFullScreen
          ></iframe>

          <div className={styles.replies}>
            <h2>Community Replies</h2>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your reply here..."
              className={styles.replyBox}
            />
            <button onClick={addComment} className={styles.submitReply}>
              Submit
            </button>
            <ul className={styles.replyList}>
              {comments.map((comment, index) => (
                <li key={index}>{comment}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TokenDetail;
