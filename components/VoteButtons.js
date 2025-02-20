import { useState, useEffect } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import FloatingMessage from "./FloatingMessage";

const VoteButtons = ({ contractAddress, walletAddress }) => {
    const [upvoteCount, setUpvoteCount] = useState(null);
    const [downvoteCount, setDownvoteCount] = useState(null);
    const [userVote, setUserVote] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [floatingMessage, setFloatingMessage] = useState(null);

    const showFloatingMessage = (message, type) => {
        setFloatingMessage({ message, type });
    };

    useEffect(() => {
        const fetchVotes = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/upvoteDownvote?contractAddress=${contractAddress}&walletAddress=${walletAddress}`);
                const data = await response.json();
                setUpvoteCount(data.upvoteCount || 0);
                setDownvoteCount(data.downvoteCount || 0);
                if (data.userVote) {
                    setUserVote(data.userVote);
                }
            } catch (error) {
                console.error("Error fetching votes:", error);
                showFloatingMessage("Failed to fetch votes. Please try again.", "failure");
            } finally {
                setIsLoading(false);
            }
        };

        if (walletAddress) {
            fetchVotes();
        }
    }, [contractAddress, walletAddress]);

    const castVote = async (vote) => {
        if (!walletAddress) {
            showFloatingMessage("Please connect your wallet to vote.", "warning");
            return;
        }

        if (userVote === vote) {
            showFloatingMessage("You have already cast this vote.", "warning");
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

            setUpvoteCount(data.upvoteCount);
            setDownvoteCount(data.downvoteCount);
            setUserVote(vote);
            showFloatingMessage("Your vote has been recorded!", "success");
        } catch (error) {
            console.error("Error casting vote:", error);
            showFloatingMessage("Failed to cast your vote. Please try again later.", "failure");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center gap-6 mt-4">
                <button className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md text-sm bg-gray-100 text-gray-400 cursor-wait">
                    <FaArrowUp className="text-lg" />
                    <span>Loading...</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full shadow-md text-sm bg-gray-100 text-gray-400 cursor-wait">
                    <FaArrowDown className="text-lg" />
                    <span>Loading...</span>
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center gap-6 mt-4">
            <button
                onClick={() => castVote("upvote")}
                disabled={userVote === "upvote"}
                className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md text-sm transition 
                    ${userVote === "upvote"
                        ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                        : "bg-gray-200 text-green-600 hover:bg-green-100"
                    }`}
            >
                <FaArrowUp className="text-lg" />
                <span>Bullish ({upvoteCount})</span>
            </button>

            <button
                onClick={() => castVote("downvote")}
                disabled={userVote === "downvote"}
                className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md text-sm transition 
                    ${userVote === "downvote"
                        ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                        : "bg-gray-200 text-red-600 hover:bg-red-100"
                    }`}
            >
                <FaArrowDown className="text-lg" />
                <span>Bearish ({downvoteCount})</span>
            </button>

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