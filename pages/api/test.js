import { MongoClient } from "mongodb";
import fetch from "node-fetch"; // Import node-fetch to make external API calls

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

// Fetch DexScreener data
async function fetchDexData(contractAddress) {
    try {
        const response = await fetch(
            `https://api.dexscreener.com/latest/dex/tokens/${contractAddress}`
        );
        const data = await response.json();

        if (data?.pairs?.length > 0) {
            const pair = data.pairs[0]; // Use the first pair for scoring
            return {
                marketCap: pair.marketCap || null, // Fetch marketCap if available
                volume24h: pair.volume?.h24 || 0,
                liquidity: pair.liquidity?.usd || 0,
                price: pair.priceUsd || null, // Fetch price
                logo: pair.info?.imageUrl || null,
            };
        }

        console.warn(`No data available for contract: ${contractAddress}`);
        return { marketCap: null, volume24h: 0, liquidity: 0, price: null, logo: null };
    } catch (error) {
        console.error(`Error fetching Dex data for ${contractAddress}:`, error);
        return { marketCap: null, volume24h: 0, liquidity: 0, price: null, logo: null };
    }
}

export default async function handler(req, res) {
    try {
        console.log(`[${req.method}] Request received on /api/getdata`);

        if (req.method !== "GET") {
            console.error("Method not allowed:", req.method);
            return res.status(405).json({ message: "Method not allowed" });
        }

        const { query } = req.query;
        console.log("GET Request - Query Parameter:", query);

        const client = await connectToDatabase();
        const db = client.db(DATABASE_NAME);

        let filter = {};
        let sort = {};

        if (query === "top10") {
            // Fetch only approved agents sorted by marketCap in descending order
            filter = { status: "approved" };
            sort = { marketCap: -1 };
        } else if (query === "trending") {
            // Fetch only approved agents for trending calculation
            filter = { status: "approved" };
        } else if (query) {
            // Apply filter based on query
            filter = { status: query };
        }

        console.log("Filter applied to query:", filter);

        // Fetch agents based on filter
        const agents = await db
            .collection("agents")
            .find(filter)
            .project({
                name: 1,
                ticker: 1,
                description: 1,
                type: 1,
                chain: 1,
                marketCap: 1, // Include marketCap for fallback
                contractAddress: 1,
                social: 1,
                utility: 1,
                status: 1,
                submittedAt: 1,
            })
            .sort(sort)
            .toArray();

        console.log(`Fetched ${agents.length} agents matching the filter.`);

        if (agents.length === 0) {
            return res
                .status(404)
                .json({ message: "No agents found matching the query." });
        }

        const agentsWithDexData = await Promise.all(
            agents.map(async (agent) => {
                const dexData = await fetchDexData(agent.contractAddress);

                return {
                    name: agent.name,
                    ticker: agent.ticker,
                    description: agent.description,
                    type: agent.type,
                    chain: agent.chain,
                    social: agent.social,
                    utility: agent.utility,
                    contractAddress: agent.contractAddress,
                    marketCap: dexData.marketCap || agent.marketCap || 0, // Prioritize Dex data
                    volume24h: dexData.volume24h || 0,
                    liquidity: dexData.liquidity || 0,
                    price: dexData.price || "N/A",
                    logo: dexData.logo || "https://via.placeholder.com/50",
                    status: agent.status,
                    submittedAt: agent.submittedAt,
                };
            })
        );

        if (query === "trending") {
            // Calculate trending score and return only trending tokens
            const agentsWithScores = agentsWithDexData.map((agent) => {
                const rawScore =
                    (agent.volume24h || 0) * 2 + (agent.liquidity || 0) * 1; // Weighted scoring
                return { ...agent, rawScore };
            });

            // Find the maximum raw score for normalization
            const maxRawScore = Math.max(
                ...agentsWithScores.map((token) => token.rawScore)
            );

            // Normalize scores to a scale of 1–10
            const trendingTokens = agentsWithScores.map((token) => {
                const normalizedScore =
                    maxRawScore > 0
                        ? Math.ceil((token.rawScore / maxRawScore) * 10) // Scale to 10
                        : 0; // Default to 0 if maxRawScore is 0
                return {
                    name: token.name,
                    ticker: token.ticker,
                    contractAddress: token.contractAddress,
                    price: token.price,
                    score: normalizedScore,
                };
            });

            // Sort by normalized score in descending order
            const sortedTrendingTokens = trendingTokens
                .sort((a, b) => b.score - a.score)
                .map((token, index) => ({
                    ...token,
                    rank: index + 1,
                }));

            return res.status(200).json(sortedTrendingTokens);
        }

        return res.status(200).json(agentsWithDexData);
    } catch (error) {
        console.error("Error fetching data:", error);

        // Return detailed error response for debugging
        return res.status(500).json({
            message: "Error fetching data.",
            error: error.message,
        });
    }
}
