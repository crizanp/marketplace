import { MongoClient, ObjectId } from 'mongodb';

// Replace with your MongoDB URI and Database Name
const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME;

let cachedClient = null;

async function connectToDatabase() {
    if (cachedClient) return cachedClient;
    const client = await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    cachedClient = client;
    return client;
}

export default async function handler(req, res) {
    const { contractAddress } = req.query;

    try {
        const client = await connectToDatabase();
        const db = client.db(DATABASE_NAME);

        if (req.method === 'GET') {
            const { walletAddress } = req.query;

            // Validate required parameters
            if (!walletAddress) {
                return res.status(400).json({ message: 'Missing wallet address' });
            }

            // Fetch agent based on walletAddress and contractAddress
            const agent = await db.collection('agents').findOne({
                walletAddress,
            });

            if (!agent) {
                return res.status(404).json({ message: 'Agent not found' });
            }

            return res.status(200).json(agent);
        }

        if (req.method === 'PUT') {
            const { walletAddress, updatedDetails } = req.body;

            if (!walletAddress || !updatedDetails) {
                return res.status(400).json({ message: 'Invalid request body' });
            }

            // Update the agent details
            const result = await db.collection('agents').updateOne(
                { walletAddress },
                { $set: updatedDetails }
            );

            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: 'Agent not found or no changes made' });
            }

            return res.status(200).json({ message: 'Agent updated successfully' });
        }

        res.status(405).json({ message: 'Method not allowed' });
    } catch (error) {
        console.error('Error handling agent:', error);
        res.status(500).json({ message: 'Error handling agent.', error });
    }
}
