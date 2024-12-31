import { useState, useEffect } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const VoteButtons = ({ contractAddress, walletAddress }) => {
    const [upvoteCount, setUpvoteCount] = useState(0);
    const [downvoteCount, setDownvoteCount] = useState(0);
    const [userVote, setUserVote] = useState(null);

    useEffect(() => {
        const fetchVotes = async () => {
            const response = await fetch(`/api/upvoteDownvote?contractAddress=${contractAddress}`);
            const data = await response.json();
            setUpvoteCount(data.upvoteCount || 0);
            setDownvoteCount(data.downvoteCount || 0);
        };

        fetchVotes();
    }, [contractAddress]);

    const castVote = async (vote) => {
        if (!walletAddress) {
            alert("Please connect your wallet to vote.");
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
                alert(data.message);
                return;
            }

            // Update local state
            setUpvoteCount(data.upvoteCount);
            setDownvoteCount(data.downvoteCount);
            setUserVote(vote);
        } catch (error) {
            console.error("Error casting vote:", error);
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
                <FaArrowDown className="text-lg" />
                <span>Bearish ({downvoteCount})</span>
            </button>
        </div>
    );
};

export default VoteButtons;
