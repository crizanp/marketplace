import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME;

export default async function handler(req, res) {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("upvoteDownvote");

    if (req.method === "POST") {
        const { contractAddress, walletAddress, vote } = req.body;

        if (!contractAddress || !walletAddress || !["upvote", "downvote"].includes(vote)) {
            return res.status(400).json({ message: "Invalid data." });
        }

        try {
            // Find the record for the contract address
            let record = await collection.findOne({ contractAddress });

            if (!record) {
                // If no record exists, create a new one
                record = {
                    contractAddress,
                    upvoteCount: 0,
                    downvoteCount: 0,
                    walletAddresses: {},
                };
                await collection.insertOne(record);
            }

            const existingVote = record.walletAddresses[walletAddress];

            if (existingVote === vote) {
                return res.status(400).json({ message: "You have already cast this vote." });
            }

            // Update counts
            let upvoteCount = record.upvoteCount;
            let downvoteCount = record.downvoteCount;

            if (vote === "upvote") {
                upvoteCount += 1;
                if (existingVote === "downvote") {
                    downvoteCount -= 1;
                }
            } else if (vote === "downvote") {
                downvoteCount += 1;
                if (existingVote === "upvote") {
                    upvoteCount -= 1;
                }
            }

            // Update the record
            await collection.updateOne(
                { contractAddress },
                {
                    $set: {
                        upvoteCount,
                        downvoteCount,
                        [`walletAddresses.${walletAddress}`]: vote,
                    },
                }
            );

            return res.status(200).json({ message: "Vote recorded.", upvoteCount, downvoteCount });
        } catch (error) {
            console.error("Error recording vote:", error);
            res.status(500).json({ message: "Internal server error." });
        } finally {
            client.close();
        }
    } else if (req.method === "GET") {
        const { contractAddress } = req.query;

        if (!contractAddress) {
            return res.status(400).json({ message: "Contract address is required." });
        }

        try {
            const record = await collection.findOne({ contractAddress });

            if (!record) {
                return res.status(404).json({ message: "No votes found for this contract." });
            }

            return res.status(200).json({
                upvoteCount: record.upvoteCount,
                downvoteCount: record.downvoteCount,
            });
        } catch (error) {
            console.error("Error fetching votes:", error);
            res.status(500).json({ message: "Internal server error." });
        } finally {
            client.close();
        }
    } else {
        res.status(405).json({ message: "Method not allowed." });
    }
}
