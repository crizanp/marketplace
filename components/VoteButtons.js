import { useState, useEffect } from "react";
import { FaArrowUp, FaSkullCrossbones } from "react-icons/fa"; // Import necessary icons
import FloatingMessage from "./FloatingMessage"; // Import FloatingMessage component

const VoteButtons = ({ contractAddress, walletAddress }) => {
    const [upvoteCount, setUpvoteCount] = useState(0);
    const [downvoteCount, setDownvoteCount] = useState(0);
    const [userVote, setUserVote] = useState(null);
    const [floatingMessage, setFloatingMessage] = useState(null);

    const showFloatingMessage = (message, type) => {
        setFloatingMessage({ message, type });
    };

    useEffect(() => {
        const fetchVotes = async () => {
            try {
                const response = await fetch(`/api/upvoteDownvote?contractAddress=${contractAddress}`);
                const data = await response.json();
                setUpvoteCount(data.upvoteCount || 0);
                setDownvoteCount(data.downvoteCount || 0);
            } catch (error) {
                console.error("Error fetching votes:", error);
                showFloatingMessage("Failed to fetch votes. Please try again.", "failure");
            }
        };

        fetchVotes();
    }, [contractAddress]);

    const castVote = async (vote) => {
        if (!walletAddress) {
            showFloatingMessage("Please connect your wallet to vote.", "warning");
            return;
        }

        try {
            const response = await fetch("/api/upvoteDownvote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contractAddress, walletAddress, vote }),
            });

            const data = await response.json();
            if (!response.ok) {
                showFloatingMessage(data.message || "An error occurred while voting.", "failure");
                return;
            }

            // Update local state
            setUpvoteCount(data.upvoteCount);
            setDownvoteCount(data.downvoteCount);
            setUserVote(vote);
            showFloatingMessage("Your vote has been recorded!", "success");
        } catch (error) {
            console.error("Error casting vote:", error);
            showFloatingMessage("Failed to cast your vote. Please try again later.", "failure");
        }
    };

    return (
        <div className="flex items-center justify-center gap-6 mt-4">
            {/* Bullish Button */}
            <button
                onClick={() => castVote("upvote")}
                disabled={userVote === "upvote"}
                className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md text-sm transition ${userVote === "upvote"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-green-600 hover:bg-green-100"
                    }`}
            >
                <FaArrowUp className="text-lg" />
                <span>Bullish ({upvoteCount})</span>
            </button>

            {/* Bearish Button */}
            <button
                onClick={() => castVote("downvote")}
                disabled={userVote === "downvote"}
                className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md text-sm transition ${userVote === "downvote"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-red-600 hover:bg-red-100"
                    }`}
            >
                <FaSkullCrossbones className="text-lg" />
                <span>Bearish ({downvoteCount})</span>
            </button>

            {/* Render FloatingMessage */}
            {floatingMessage && (
                <FloatingMessage
                    message={floatingMessage.message}
                    type={floatingMessage.type}
                    onClose={() => setFloatingMessage(null)}
                />
            )}
        </div>
    );
};

export default VoteButtons;
