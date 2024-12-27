import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const AgentEditor = ({ contractAddress }) => {
    const { publicKey } = useWallet();
    const [agent, setAgent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (publicKey) {
            fetchAgentData();
        }
    }, [publicKey]);

    const fetchAgentData = async () => {
        setIsLoading(true);

        try {
            const response = await fetch(
                `/api/agent/${contractAddress}?walletAddress=${publicKey.toString()}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch agent data');
            }

            const data = await response.json();
            setAgent(data);
            setFormData(data);
        } catch (error) {
            console.error('Error fetching agent:', error);
            alert('Failed to fetch agent data');
        }

        setIsLoading(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateAgent = async () => {
        setIsLoading(true);

        try {
            const response = await fetch(`/api/agent/${contractAddress}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    walletAddress: publicKey.toString(),
                    updatedDetails: formData,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update agent');
            }

            alert('Agent updated successfully!');
            setIsEditing(false);
            fetchAgentData(); // Refresh data after update
        } catch (error) {
            console.error('Error updating agent:', error);
            alert('Failed to update agent');
        }

        setIsLoading(false);
    };

    if (!publicKey) {
        return <p className="text-red-500">Please connect your wallet to view this agent.</p>;
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!agent) {
        return <p>No agent found for the provided contract address.</p>;
    }

    return (
        <div className="p-4 bg-gray-800 text-white rounded-lg">
            <h2 className="text-2xl font-bold">Edit Agent</h2>
            {!isEditing ? (
                <div>
                    <p><strong>Name:</strong> {agent.name}</p>
                    <p><strong>Ticker:</strong> {agent.ticker}</p>
                    <p><strong>Description:</strong> {agent.description}</p>
                    <p><strong>Status:</strong> {agent.status}</p>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
                    >
                        Edit
                    </button>
                </div>
            ) : (
                <div>
                    <div className="mb-4">
                        <label className="block">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-2 bg-gray-700 rounded-lg"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block">Ticker</label>
                        <input
                            type="text"
                            name="ticker"
                            value={formData.ticker}
                            onChange={handleInputChange}
                            className="w-full p-2 bg-gray-700 rounded-lg"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full p-2 bg-gray-700 rounded-lg"
                        />
                    </div>
                    <button
                        onClick={handleUpdateAgent}
                        className="mt-4 bg-green-500 px-4 py-2 rounded-lg"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="mt-4 bg-red-500 px-4 py-2 rounded-lg ml-2"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default AgentEditor;
