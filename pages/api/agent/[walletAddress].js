import { MongoClient, ObjectId } from 'mongodb';

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

export default async function handler(req, res) {
    try {
        console.log(`[${req.method}] Request received on /api/agent`);

        const client = await connectToDatabase();
        const db = client.db(DATABASE_NAME);

        if (req.method === 'GET') {
            const { walletAddress } = req.query;
            console.log('GET Request - Query Parameters:', req.query);

            if (!walletAddress) {
                console.error('Missing wallet address');
                return res.status(400).json({ message: 'Missing wallet address' });
            }

            const agents = await db.collection('agents').find({ walletAddress }).toArray();
            console.log(`Fetched ${agents.length} agents for wallet address: ${walletAddress}`);

            if (agents.length === 0) {
                console.error('No agents found for this wallet address');
                return res.status(404).json({ message: 'No agents found for this wallet address' });
            }

            return res.status(200).json(agents);
        }

        if (req.method === 'PUT') {
            const { walletAddress, updatedDetails } = req.body;

            if (!walletAddress || !updatedDetails || !updatedDetails._id) {
                console.error('Invalid request body:', req.body);
                return res.status(400).json({ message: 'Invalid request body' });
            }

            try {
                const { _id, ...fieldsToUpdate } = updatedDetails; // Exclude `_id` from the update fields

                const result = await db.collection('agents').updateOne(
                    { _id: new ObjectId(_id), walletAddress }, // Query by `_id` and `walletAddress`
                    { $set: fieldsToUpdate } // Update only other fields
                );

                console.log('Update Result:', result);

                if (result.modifiedCount === 0) {
                    console.error('No document matched or no changes made');
                    return res.status(404).json({ message: 'Agent not found or no changes made' });
                }

                return res.status(200).json({ message: 'Agent updated successfully' });
            } catch (error) {
                console.error('Error updating agent:', error);
                return res.status(500).json({ message: 'Error handling agent.', error });
            }
        }


        if (req.method === 'POST') {
            const { agentDetails, walletAddress } = req.body;
            console.log('POST Request - Body:', req.body);

            if (!agentDetails.name || !agentDetails.ticker || !agentDetails.description || !walletAddress) {
                console.error('Missing required fields:', req.body);
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const submission = {
                ...agentDetails,
                walletAddress,
                status: 'unapproved',
                submittedAt: new Date(),
            };

            const result = await db.collection('agents').insertOne(submission);
            console.log('Inserted Document ID:', result.insertedId);

            return res.status(201).json({ message: 'Agent submitted successfully!', id: result.insertedId });
        }

        console.error('Method not allowed:', req.method);
        return res.status(405).json({ message: 'Method not allowed' });
    } catch (error) {
        console.error('Error handling agent:', error);
        return res.status(500).json({ message: 'Error handling agent.', error });
    }
}
