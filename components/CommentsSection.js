import React, { useState, useEffect } from "react";
import FloatingMessage from "./FloatingMessage";

const truncateCommentAddress = (address) => {
    if (!address) return "Unknown";
    return address.slice(0, 5); // Take the first 5 characters
};

const CommentsSection = ({ contractAddress, publicKey, connected }) => {
    const [comments, setComments] = useState([]); // Store comments
    const [newComment, setNewComment] = useState(""); // New comment input
    const [isSubmitting, setIsSubmitting] = useState(false); // Submission state
    const [captchaToken, setCaptchaToken] = useState(null); // hCaptcha token

    const siteKey = "6c4cfef2-0abc-483a-a4b4-5f1897a2f2dc"; // Replace with your hCaptcha site key
    const [floatingMessage, setFloatingMessage] = useState(null);
    const showFloatingMessage = (message, type) => {
        setFloatingMessage({ message, type });
    };
    // Fetch comments from the server
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

    // Handle hCaptcha response
    const handleCaptchaResponse = (token) => {
        setCaptchaToken(token); // Save the hCaptcha token
    };

    // Add a new comment
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
                captchaToken, // Send CAPTCHA token to the backend
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
            setCaptchaToken(null); // Reset CAPTCHA
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

    // Handle comment likes
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
            alert(error.message || "An error occurred while liking the comment.");
        }
    };

    return (
        <div className="mt-4 bg-gray-800 p-4 rounded-lg shadow-md">
            {floatingMessage && (
                <FloatingMessage
                    message={floatingMessage.message}
                    type={floatingMessage.type}
                    onClose={() => setFloatingMessage(null)}
                />
            )}
            <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-1 mb-3">
                Community Comments
            </h2>
            {/* Add New Comment */}
            <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment here..."
                className="w-full h-20 p-2 bg-gray-900 text-gray-200 rounded-md border border-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none resize-none text-sm"
            />
            <div id="hcaptcha-container" className="mt-2"></div>
            <button
                onClick={addComment}
                disabled={isSubmitting || !captchaToken}
                className={`px-4 py-1 rounded-md transition-all duration-200 mt-2 text-sm shadow-sm ${isSubmitting || !captchaToken
                    ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600 hover:shadow-md"
                    }`}
            >
                {isSubmitting ? "Submitting..." : "Submit Comment"}
            </button>

            {/* Comments List */}
            <div className="mt-4">
                {comments.length > 0 ? (
                    <ul className="space-y-2">
                        {comments.map((comment) => (
                            <li
                                key={comment._id}
                                className="p-3 bg-gray-900 rounded-md border border-gray-700 hover:border-green-500 transition-all duration-200"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-gray-400">
                                        {truncateCommentAddress(comment.walletAddress)} •{" "}
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </p>
                                    <button
                                        className={`text-green-400 hover:text-green-300 text-sm ${(!publicKey || comment.walletAddress === publicKey.toString() || comment.likedBy?.includes(publicKey.toString())) ? "cursor-not-allowed opacity-50" : ""}`}
                                        onClick={() => publicKey && comment.walletAddress !== publicKey.toString() && !comment.likedBy?.includes(publicKey.toString()) && handleLike(comment._id)}
                                        disabled={!publicKey || comment.walletAddress === publicKey.toString() || comment.likedBy?.includes(publicKey.toString())}
                                    >
                                        👍 {comment.likes || 0}
                                    </button>
                                </div>

                                <p className="text-gray-200 mt-1 text-sm">{comment.comment}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 text-sm">No comments yet. Be the first to comment!</p>
                )}
            </div>
        </div>
    );
};

export default CommentsSection;
