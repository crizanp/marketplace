import { MongoClient } from "mongodb";
import fetch from "node-fetch"; // Import node-fetch to make external API calls

// Chain logo mapping
const chainLogos = {
    polygon: "https://dd.dexscreener.com/ds-data/chains/polygon.png",
    arbitrum: "https://dd.dexscreener.com/ds-data/chains/arbitrum.png",
    hyperliquid: "https://dd.dexscreener.com/ds-data/chains/hyperliquid.png",
    ton: "https://dd.dexscreener.com/ds-data/chains/ton.png",
    pulsechain: "https://dd.dexscreener.com/ds-data/chains/pulsechain.png",
    sui: "https://dd.dexscreener.com/ds-data/chains/sui.png",
    bsc: "https://dd.dexscreener.com/ds-data/chains/bsc.png",
    base: "https://dd.dexscreener.com/ds-data/chains/base.png",
    ethereum: "https://dd.dexscreener.com/ds-data/chains/ethereum.png",
    solana: "https://dd.dexscreener.com/ds-data/chains/solana.png",
};
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
                marketCap: pair.marketCap || null,
                volume24h: pair.volume?.h24 || 0,
                liquidity: pair.liquidity?.usd || 0,
                price: pair.priceUsd || null,
                priceChange: pair.priceChange || {}, // Include price change details
                logo: pair.info?.imageUrl || null,
            };
        }

        console.warn(`No data available for contract: ${contractAddress}`);
        return { marketCap: null, volume24h: 0, liquidity: 0, price: null, priceChange: {}, logo: null };
    } catch (error) {
        console.error(`Error fetching Dex data for ${contractAddress}:`, error);
        return { marketCap: null, volume24h: 0, liquidity: 0, price: null, priceChange: {}, logo: null };
    }
}

export default async function handler(req, res) {
    try {
        console.log(`[${req.method}] Request received on /api/getdata`);

        if (req.method !== "GET") {
            console.error("Method not allowed:", req.method);
            return res.status(405).json({ message: "Method not allowed" });
        }

        const { query, contractAddress } = req.query;
        console.log("GET Request - Query Parameters:", { query, contractAddress });

        const client = await connectToDatabase();
        const db = client.db(DATABASE_NAME);

        // If contractAddress is provided, fetch a single agent
        if (contractAddress) {
            console.log(`Fetching data for contractAddress: ${contractAddress}`);

            const agent = await db.collection("agents").findOne(
                {
                    contractAddress: contractAddress,
                    status: "approved"
                },
                {
                    projection: {
                        name: 1,
                        ticker: 1,
                        description: 1,
                        type: 1,
                        chain: 1,
                        marketCap: 1,
                        contractAddress: 1,
                        social: 1,
                        utility: 1,
                        status: 1,
                        submittedAt: 1,
                    },
                }
            );

            if (!agent) {
                return res
                    .status(404)
                    .json({ message: "No agent found for the given contractAddress." });
            }

            const dexData = await fetchDexData(agent.contractAddress);

            const enrichedAgent = {
                name: agent.name,
                ticker: agent.ticker,
                description: agent.description,
                type: agent.type,
                chain: agent.chain, // Use the `chain` property from the agent object
                social: agent.social,
                utility: agent.utility,
                contractAddress: agent.contractAddress,
                marketCap: dexData.marketCap || agent.marketCap || 0,
                volume24h: dexData.volume24h || 0,
                liquidity: dexData.liquidity || 0,
                price: dexData.price || "N/A",
                priceChange24h: dexData.priceChange?.h24 || "N/A", // Include 24h price change
                logo: dexData.logo || chainLogos[agent.chain?.toLowerCase()] || null, // Use agent.chain safely
                status: agent.status,
                submittedAt: agent.submittedAt,
            };

            return res.status(200).json(enrichedAgent);
        }

        // Handle other queries (e.g., top10, trending)
        let filter = {};
        let sort = {};

        if (query === "top10") {
            filter = { status: "approved" };
            sort = { marketCap: -1 };
        } else if (query === "trending") {
            filter = { status: "approved" };
        } else if (query) {
            filter = { status: query };
        }

        console.log("Filter applied to query:", filter);

        const agents = await db
            .collection("agents")
            .find(filter)
            .project({
                name: 1,
                ticker: 1,
                description: 1,
                type: 1,
                chain: 1,
                marketCap: 1,
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
                    chain: agent.chain, // Ensure the chain property is used from agent
                    social: agent.social,
                    utility: agent.utility,
                    contractAddress: agent.contractAddress,
                    marketCap: dexData.marketCap || agent.marketCap || 0,
                    volume24h: dexData.volume24h || 0,
                    liquidity: dexData.liquidity || 0,
                    price: dexData.price || "N/A",
                    priceChange24h: dexData.priceChange?.h24 || "N/A", // Include 24h price change
                    logo: dexData.logo || chainLogos[agent.chain?.toLowerCase()] || null, // Use agent.chain safely
                    status: agent.status,
                    submittedAt: agent.submittedAt,
                };
            })
        );


        if (query === "top10") {
            const top10Agents = agentsWithDexData
                .sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0))
                .slice(0, 9); // Fetch exactly 9 results

            return res.status(200).json(top10Agents);
        }

        if (query === "trending") {
            const agentsWithScores = agentsWithDexData.map((agent) => {
                const rawScore =
                    (agent.volume24h || 0) * 2 + (agent.liquidity || 0) * 1;
                return { ...agent, rawScore };
            });

            const maxRawScore = Math.max(
                ...agentsWithScores.map((token) => token.rawScore)
            );

            const trendingTokens = agentsWithScores.map((token) => {
                const normalizedScore =
                    maxRawScore > 0
                        ? Math.ceil((token.rawScore / maxRawScore) * 10)
                        : 0;
                return {
                    name: token.name,
                    ticker: token.ticker,
                    contractAddress: token.contractAddress,
                    price: token.price,
                    score: normalizedScore,
                    logo: token.logo || chainLogos[token.chain?.toLowerCase()],
                };
            });


            const sortedTrendingTokens = trendingTokens
                .sort((a, b) => b.score - a.score)
                .slice(0, 8)
                .map((token, index) => ({
                    ...token,
                    rank: index + 1,
                }));

            return res.status(200).json(sortedTrendingTokens);
        }

        return res.status(200).json(agentsWithDexData);
    } catch (error) {
        console.error("Error fetching data:", error);

        return res.status(500).json({
            message: "Error fetching data.",
            error: error.message,
        });
    }
}
