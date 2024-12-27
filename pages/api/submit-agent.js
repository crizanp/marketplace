import { MongoClient } from 'mongodb';

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
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { agentDetails, walletAddress } = req.body;

    // Basic validation
    if (!agentDetails.name || !agentDetails.ticker || !agentDetails.description || !walletAddress) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const client = await connectToDatabase();
        const db = client.db(DATABASE_NAME);

        // Add default status and timestamp
        const submission = {
            ...agentDetails,
            walletAddress, // Save the wallet address
            status: 'unapproved',
            submittedAt: new Date(),
        };

        const result = await db.collection('agents').insertOne(submission);

        res.status(201).json({ message: 'Agent submitted successfully!', id: result.insertedId });
    } catch (error) {
        console.error('Error saving agent:', error);
        res.status(500).json({ message: 'Error saving agent.', error });
    }
}
