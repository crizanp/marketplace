import { MongoClient } from 'mongodb';
import fetch from 'node-fetch'; // Import node-fetch to make external API calls

// Replace with your MongoDB URI and Database Name
const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME;

let cachedClient = null;

async function connectToDatabase() {
    if (cachedClient) return cachedClient;
    console.log('Connecting to MongoDB...');
    const client = await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    cachedClient = client;
    return client;
}

async function fetchDexData(contractAddress) {
    try {
        const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${contractAddress}`);
        const data = await response.json();

        if (data?.pairs?.length > 0) {
            const pair = data.pairs[0]; // Use the first pair for data
            return {
                marketCap: pair.marketCap || null,
                price: pair.priceUsd || null,
                liquidity: pair.liquidity?.usd || null,
                volume24h: pair.volume?.h24 || null,
                logo: pair.info?.imageUrl || null, // Fetch logo from info.imageUrl
            };
        }
        return { marketCap: null, price: null, liquidity: null, volume24h: null, logo: null };
    } catch (error) {
        console.error(`Error fetching Dex data for ${contractAddress}:`, error);
        return { marketCap: null, price: null, liquidity: null, volume24h: null, logo: null };
    }
}

export default async function handler(req, res) {
    try {
        console.log(`[${req.method}] Request received on /api/getdata`);

        if (req.method !== 'GET') {
            console.error('Method not allowed:', req.method);
            return res.status(405).json({ message: 'Method not allowed' });
        }

        const { query } = req.query;
        console.log('GET Request - Query Parameter:', query);

        const client = await connectToDatabase();
        const db = client.db(DATABASE_NAME);

        const filter = query ? { status: query } : {};

        console.log('Filter applied to query:', filter);

        const agents = await db.collection('agents').find(filter).toArray();
        console.log(`Fetched ${agents.length} agents matching the filter.`);

        if (agents.length === 0) {
            return res.status(404).json({ message: 'No agents found matching the query.' });
        }

        // Fetch Dex data for each agent, remove walletAddress, and merge results
        const agentsWithDexData = await Promise.all(
            agents.map(async (agent) => {
                const { walletAddress, ...filteredAgent } = agent; // Exclude walletAddress
                const dexData = await fetchDexData(agent.contractAddress);
                return {
                    ...filteredAgent,
                    ...dexData, // Merge Dex data with agent data
                };
            })
        );

        return res.status(200).json(agentsWithDexData);
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ message: 'Error fetching data.', error });
    }
}
