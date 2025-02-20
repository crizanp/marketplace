import { MongoClient } from "mongodb";
const uri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME;

export default async function handler(req, res) {
    const client = new MongoClient(uri);
   
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("upvoteDownvote");

        if (req.method === "POST") {
            const { contractAddress, walletAddress, vote } = req.body;
            
            if (!contractAddress || !walletAddress || !["upvote", "downvote"].includes(vote)) {
                return res.status(400).json({ message: "Invalid data." });
            }

            // Find the record for the contract address
            let record = await collection.findOne({ contractAddress });
            
            if (!record) {
                // Initialize a new record with proper structure
                record = {
                    contractAddress,
                    upvoteCount: 0,
                    downvoteCount: 0,
                    walletAddresses: {},
                };
                await collection.insertOne(record);
            } else if (!record.walletAddresses) {
                // Ensure walletAddresses exists on existing records
                record.walletAddresses = {};
            }

            const existingVote = record.walletAddresses[walletAddress];
            
            if (existingVote === vote) {
                return res.status(400).json({ message: "You have already cast this vote." });
            }

            // Update counts
            let upvoteCount = record.upvoteCount || 0;
            let downvoteCount = record.downvoteCount || 0;

            // Logic for handling votes
            if (existingVote) {
                // User is changing their vote
                if (existingVote === "upvote") {
                    upvoteCount = Math.max(0, upvoteCount - 1);
                } else if (existingVote === "downvote") {
                    downvoteCount = Math.max(0, downvoteCount - 1);
                }
            }

            // Add new vote
            if (vote === "upvote") {
                upvoteCount += 1;
            } else if (vote === "downvote") {
                downvoteCount += 1;
            }

            // Update the record with all necessary fields
            await collection.updateOne(
                { contractAddress },
                {
                    $set: {
                        upvoteCount,
                        downvoteCount,
                        [`walletAddresses.${walletAddress}`]: vote,
                    },
                },
                { upsert: true }
            );

            return res.status(200).json({
                message: "Vote recorded.",
                upvoteCount,
                downvoteCount
            });
        } else if (req.method === "GET") {
            const { contractAddress } = req.query;
            
            if (!contractAddress) {
                return res.status(400).json({ message: "Contract address is required." });
            }

            const record = await collection.findOne({ contractAddress });
            
            if (!record) {
                return res.status(200).json({
                    upvoteCount: 0,
                    downvoteCount: 0
                });
            }

            return res.status(200).json({
                upvoteCount: record.upvoteCount || 0,
                downvoteCount: record.downvoteCount || 0
            });
        }

        return res.status(405).json({ message: "Method not allowed." });
    } catch (error) {
        console.error("Error in upvote/downvote handler:", error);
        return res.status(500).json({ message: "Internal server error." });
    } finally {
        await client.close();
    }
}