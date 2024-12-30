import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME;

let cachedClient = null;

async function connectToDatabase() {
    if (cachedClient) return cachedClient;
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    cachedClient = client;
    return client;
}

export default async function handler(req, res) {
    try {
        const client = await connectToDatabase();
        const db = client.db(DATABASE_NAME);

        if (req.method === "GET") {
            const { contractAddress } = req.query;

            if (!contractAddress) {
                return res.status(400).json({ message: "Contract address is required." });
            }

            console.log("Fetching comments for contractAddress:", contractAddress);

            const comments = await db
                .collection("comments")
                .find({ contractAddress })
                .sort({ createdAt: -1 })
                .toArray();

            return res.status(200).json(comments);
        }

        if (req.method === "POST") {
            const { contractAddress, walletAddress, comment } = req.body;

            if (!contractAddress || !walletAddress || !comment) {
                return res.status(400).json({ message: "Invalid comment data." });
            }

            const newComment = {
                contractAddress,
                walletAddress,
                comment,
                createdAt: new Date(),
                likes: 0,
                likedBy: [], // Initialize as empty array
            };

            try {
                const result = await db.collection("comments").insertOne(newComment);
                newComment._id = result.insertedId;
                return res.status(201).json({ message: "Comment added.", comment: newComment });
            } catch (error) {
                console.error("Error adding comment:", error);
                return res.status(500).json({ message: "Failed to add comment." });
            }
        }

        if (req.method === "PUT") {
            const { commentId, walletAddress } = req.body;

            console.log("Received like request:", { commentId, walletAddress }); // Detailed logging

            if (!commentId || !walletAddress) {
                console.error("Invalid request parameters");
                return res.status(400).json({ message: "Invalid request. Comment ID and wallet address are required." });
            }

            try {
                const comment = await db.collection("comments").findOne({ _id: new ObjectId(commentId) });

                if (!comment) {
                    console.error("Comment not found:", commentId);
                    return res.status(404).json({ message: "Comment not found." });
                }

                // Ensure likedBy exists
                const likedBy = comment.likedBy || [];

                // Check for duplicate likes
                if (likedBy.includes(walletAddress)) {
                    console.warn("Duplicate like attempt:", walletAddress);
                    return res.status(400).json({ message: "User has already liked this comment." });
                }

                const result = await db.collection("comments").updateOne(
                    { _id: new ObjectId(commentId) },
                    {
                        $inc: { likes: 1 },
                        $push: { likedBy: walletAddress }
                    }
                );

                if (result.matchedCount === 0) {
                    console.error("No document matched the update criteria");
                    return res.status(404).json({ message: "Comment not found or could not be updated." });
                }

                // Fetch the updated comment to return
                const updatedComment = await db.collection("comments").findOne({ _id: new ObjectId(commentId) });

                return res.status(200).json({
                    message: "Like added.",
                    comment: updatedComment
                });

            } catch (error) {
                console.error("Detailed error updating comment:", error);
                res.status(500).json({
                    message: "Failed to update like.",
                    error: error.message
                });
            }
        }

        res.status(405).json({ message: "Method not allowed." });
    } catch (error) {
        console.error("Error handling comments:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}
