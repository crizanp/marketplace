import { MongoClient } from "mongodb";
import fetch from "node-fetch"; // Import node-fetch for external API calls

// Replace with your MongoDB URI and Database Name
const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME;

let cachedClient = null;

// Connect to MongoDB
async function connectToDatabase() {
    if (cachedClient) return cachedClient;
    console.log("Connecting to MongoDB...");
    const client = await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
    cachedClient = client;
    return client;
}

// Fetch DexScreener data for additional fields
async function fetchDexData(contractAddress) {
    try {
        const response = await fetch(
            `https://api.dexscreener.com/latest/dex/tokens/${contractAddress}`
        );
        const data = await response.json();

        if (data?.pairs?.length > 0) {
            const pair = data.pairs[0];
            return {
                marketCap: pair.marketCap || null,
                volume24h: pair.volume?.h24 || 0,
                liquidity: pair.liquidity?.usd || 0,
                price: pair.priceUsd || null,
                logo: pair.info?.imageUrl || "https://via.placeholder.com/50",
            };
        }

        console.warn(`No data available for contract: ${contractAddress}`);
        return {
            marketCap: null,
            volume24h: 0,
            liquidity: 0,
            price: null,
            logo: "https://via.placeholder.com/50",
        };
    } catch (error) {
        console.error(`Error fetching Dex data for ${contractAddress}:`, error);
        return {
            marketCap: null,
            volume24h: 0,
            liquidity: 0,
            price: null,
            logo: "https://via.placeholder.com/50",
        };
    }
}

export default async function handler(req, res) {
    try {
        console.log(`[${req.method}] Request received on /api/filter`);

        if (req.method !== "GET") {
            return res.status(405).json({ message: "Method not allowed" });
        }

        const { page = 1, search = "", sortBy = "listedTime", chain = "" } = req.query;

        const client = await connectToDatabase();
        const db = client.db(DATABASE_NAME);

        const pageSize = 10; // Number of items per page
        const skip = (page - 1) * pageSize;

        // Base filter
        let filter = { status: "approved" };

        // Search filter
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { ticker: { $regex: search, $options: "i" } },
            ];
        }

        // Chain filter
        if (chain) {
            filter.chain = { $regex: `^${chain}$`, $options: "i" }; // Case-insensitive regex
        }
        // Fetch and filter all matching agents
        const agents = await db.collection("agents").find(filter).toArray();

        // Enrich agents with DexScreener data
        const enrichedAgents = await Promise.all(
            agents.map(async (agent) => {
                const dexData = await fetchDexData(agent.contractAddress);
                return {
                    ...agent,
                    marketCap: dexData.marketCap || agent.marketCap || 0,
                    volume24h: dexData.volume24h || 0,
                    liquidity: dexData.liquidity || 0,
                    price: dexData.price || "N/A",
                    logo: dexData.logo || "https://via.placeholder.com/50",
                };
            })
        );

        // Sort the enriched agents
        const sortOptions = {
            listedTime: (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt),
            name: (a, b) => a.name.localeCompare(b.name),
            marketCap: (a, b) => b.marketCap - a.marketCap,
            upvotes: (a, b) => (b.upvotes || 0) - (a.upvotes || 0),
        };
        const sortFunction = sortOptions[sortBy] || sortOptions.listedTime;

        const sortedAgents = enrichedAgents.sort(sortFunction);

        // Paginate the sorted results
        const paginatedAgents = sortedAgents.slice(skip, skip + pageSize);

        const totalAgents = sortedAgents.length;
        const totalPages = Math.ceil(totalAgents / pageSize);

        return res.status(200).json({
            data: paginatedAgents,
            pagination: {
                currentPage: parseInt(page, 10),
                totalPages,
                pageSize,
                totalAgents,
            },
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ message: "Error fetching data." });
    }
}
