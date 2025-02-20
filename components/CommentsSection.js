import React, { useState, useEffect } from "react";
import FloatingMessage from "./FloatingMessage";
import { FaThumbsUp, FaPaperPlane, FaUserCircle } from "react-icons/fa";

const truncateCommentAddress = (address) => {
  if (!address) return "Unknown";
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
};

const CommentsSection = ({ contractAddress, publicKey, connected }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [floatingMessage, setFloatingMessage] = useState(null);
  
  const siteKey = "6c4cfef2-0abc-483a-a4b4-5f1897a2f2dc";

  const showFloatingMessage = (message, type) => {
    setFloatingMessage({ message, type });
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?contractAddress=${contractAddress}`);
        if (!response.ok) {
          throw new Error("Failed to fetch comments.");
        }
        const commentsData = await response.json();
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (contractAddress) {
      fetchComments();
    }

    // Render hCaptcha manually
    if (window.hcaptcha) {
      window.hcaptcha.render("hcaptcha-container", {
        sitekey: siteKey,
        callback: handleCaptchaResponse,
      });
    }
  }, [contractAddress]);

  const handleCaptchaResponse = (token) => {
    setCaptchaToken(token);
  };

  const addComment = async () => {
    if (!connected || !publicKey) {
      showFloatingMessage(
        `Please connect your wallet to add a comment.`,
        "failure"
      );
      return;
    }

    if (!newComment.trim()) {
      showFloatingMessage(
        `Comment cannot be empty.`,
        "failure"
      );
      return;
    }

    if (!captchaToken) {
      showFloatingMessage(
        `Please complete the CAPTCHA verification.`,
        "failure"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const walletAddress = publicKey.toString();
      const newCommentData = {
        contractAddress,
        walletAddress,
        comment: newComment.trim(),
        createdAt: new Date().toISOString(),
        likes: 0,
        captchaToken,
      };

      const response = await fetch(`/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCommentData),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment.");
      }

      const result = await response.json();
      setComments((prev) => [result.comment, ...prev]);
      setNewComment("");
      setCaptchaToken(null);
      
      // Reset hCaptcha
      if (window.hcaptcha) {
        window.hcaptcha.reset();
      }
      
    } catch (error) {
      console.error("Error submitting comment:", error);
      showFloatingMessage(
        `Failed to add comment. Please try again.`,
        "failure"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (commentId) => {
    if (!connected || !publicKey) {
      showFloatingMessage(
        `Please connect your wallet to like a comment`,
        "failure"
      );
      return;
    }

    try {
      const response = await fetch("/api/comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commentId,
          walletAddress: publicKey.toString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to like the comment");
      }

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === data.comment._id ? data.comment : comment
        )
      );
    } catch (error) {
      console.error("Error liking comment:", error);
      showFloatingMessage(
        error.message || "An error occurred while liking the comment.",
        "failure"
      );
    }
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      {floatingMessage && (
        <FloatingMessage
          message={floatingMessage.message}
          type={floatingMessage.type}
          onClose={() => setFloatingMessage(null)}
        />
      )}
      <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-3 mb-4">
        Community Comments
      </h2>
      
      {/* Add New Comment */}
      <div className="mb-6">
        <div className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts on this token..."
            className="w-full h-24 p-4 bg-gray-50 text-gray-800 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none resize-none text-sm transition-all duration-200"
          />
          <div className="absolute bottom-3 right-3">
            <button
              onClick={addComment}
              disabled={isSubmitting || !captchaToken}
              title={!captchaToken ? "Please complete the CAPTCHA" : "Submit comment"}
              className={`p-2 rounded-full transition-all duration-200 flex items-center justify-center ${
                isSubmitting || !captchaToken
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600 hover:shadow-md"
              }`}
            >
              <FaPaperPlane className={isSubmitting ? "animate-pulse" : ""} />
            </button>
          </div>
        </div>
        <div id="hcaptcha-container" className="mt-3"></div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li
                key={comment._id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-300 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaUserCircle className="text-gray-400" />
                    <p className="text-sm font-medium text-gray-700">
                      {truncateCommentAddress(comment.walletAddress)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>
                  <button
                    className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full transition-all duration-200 ${
                      !publicKey || comment.walletAddress === publicKey.toString() || comment.likedBy?.includes(publicKey.toString())
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600"
                    }`}
                    onClick={() => 
                      publicKey && 
                      comment.walletAddress !== publicKey.toString() && 
                      !comment.likedBy?.includes(publicKey.toString()) && 
                      handleLike(comment._id)
                    }
                    disabled={
                      !publicKey || 
                      comment.walletAddress === publicKey.toString() || 
                      comment.likedBy?.includes(publicKey.toString())
                    }
                  >
                    <FaThumbsUp size={12} />
                    <span>{comment.likes || 0}</span>
                  </button>
                </div>

                <p className="text-gray-700 mt-2 text-sm leading-relaxed">
                  {comment.comment}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">No comments yet</p>
            <p className="text-sm text-gray-400">Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;