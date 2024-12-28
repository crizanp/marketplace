import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const AgentEditor = ({ walletAddress }) => {
    const { publicKey } = useWallet();
    const [agents, setAgents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);
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
                `/api/agent/${walletAddress}?walletAddress=${publicKey.toString()}`
            );
            if (!response.ok) {
                throw new Error('Failed to fetch agent data');
            }
            const data = await response.json();
            setAgents(data);
        } catch (error) {
            console.error('Error fetching agent:', error);
            alert('Failed to fetch agent data');
        }
        setIsLoading(false);
    };

    const openEditModal = (agent) => {
        setSelectedAgent(agent);
        setFormData(agent);
    };

    const closeEditModal = () => {
        setSelectedAgent(null);
        setFormData({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNestedInputChange = (e, key) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [key]: { ...prev[key], [name]: value },
        }));
    };

    const handleArrayChange = (index, key, field, value) => {
        setFormData((prev) => ({
            ...prev,
            [key]: prev[key].map((item, idx) =>
                idx === index ? { ...item, [field]: value } : item
            ),
        }));
    };

    const handleUpdateAgent = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/agent/${walletAddress}`, {
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
            closeEditModal();
            fetchAgentData();
        } catch (error) {
            console.error('Error updating agent:', error);
            alert('Failed to update agent');
        }
        setIsLoading(false);
    };

    if (!publicKey) {
        return <p className="text-red-500">Please connect your wallet to view agents.</p>;
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!agents.length) {
        return <p>No agents found for the provided wallet address.</p>;
    }

    return (
        <div className="p-4 bg-gray-800 text-white rounded-lg h-screen">
            <h2 className="text-2xl font-bold py-4">Your Submission Agents</h2>
            <div className="grid gap-4">
                {agents.map((agent) => (
                    <div key={agent._id} className="p-4 bg-gray-700 rounded-lg">
                        <p><strong>Name:</strong> {agent.name}</p>
                        <p><strong>Ticker:</strong> {agent.ticker}</p>
                        <p>
                            <strong>Status:</strong>{' '}
                            <span
                                className={`px-2 py-1 rounded-lg ${agent.status === 'unapproved'
                                    ? 'bg-orange-500'
                                    : agent.status === 'approved'
                                        ? 'bg-green-500'
                                        : 'bg-red-500'
                                    }`}
                            >
                                {agent.status}
                            </span>
                        </p>
                        {agent.status === 'unapproved' && (
                            <button
                                onClick={() => openEditModal(agent)}
                                className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
                            >
                                Edit
                            </button>
                        )}
                        {agent.status === 'approved' && (
                            <a
                                href="/appeal"
                                className="mt-4 bg-blue-500 px-4 py-2 rounded-lg inline-block text-white"
                            >
                                Appeal for Edit
                            </a>
                        )}
                        {agent.status === 'rejected' && (
                            <button
                                disabled
                                className="mt-4 bg-gray-500 px-4 py-2 rounded-lg cursor-not-allowed"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal for Editing */}
            {selectedAgent && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75" style={{ zIndex: 9999 }}>
                    <div className="relative p-6 bg-gray-900 text-white rounded-lg w-2/4 overflow-auto max-h-screen">
                        {/* Close Button */}
                        <button
                            onClick={closeEditModal}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
                        >
                            ✕
                        </button>
                        <h3 className="text-xl font-bold mb-4">Edit Agent</h3>
                        <div className="mb-4">
                            <label className="block">Contract Address</label>
                            <input
                                type="text"
                                name="contractAddress"
                                value={formData.contractAddress || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 bg-gray-700 rounded-lg"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 bg-gray-700 rounded-lg"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Ticker</label>
                            <input
                                type="text"
                                name="ticker"
                                value={formData.ticker || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 bg-gray-700 rounded-lg"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Description</label>
                            <textarea
                                name="description"
                                value={formData.description || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 bg-gray-700 rounded-lg"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block">Social</label>
                            {Object.keys(formData.social || {}).map((key) => (
                                <div key={key} className="mb-2">
                                    <label className="block capitalize">{key}</label>
                                    <input
                                        type="text"
                                        name={key}
                                        value={formData.social[key] || ''}
                                        onChange={(e) => handleNestedInputChange(e, 'social')}
                                        className="w-full p-2 bg-gray-700 rounded-lg"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mb-4">
                            <label className="block">Utility</label>
                            {formData.utility?.map((utility, index) => (
                                <div key={index} className="mb-2 p-2 bg-gray-800 rounded-lg">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={utility.name || ''}
                                        onChange={(e) =>
                                            handleArrayChange(index, 'utility', 'name', e.target.value)
                                        }
                                        className="w-full p-2 mb-2 bg-gray-700 rounded-lg"
                                    />
                                    <textarea
                                        placeholder="Short Description"
                                        value={utility.shortDesc || ''}
                                        onChange={(e) =>
                                            handleArrayChange(index, 'utility', 'shortDesc', e.target.value)
                                        }
                                        className="w-full p-2 bg-gray-700 rounded-lg"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Social Type"
                                        value={utility.socialType || ''}
                                        onChange={(e) =>
                                            handleArrayChange(index, 'utility', 'socialType', e.target.value)
                                        }
                                        className="w-full p-2 bg-gray-700 rounded-lg"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Link"
                                        value={utility.link || ''}
                                        onChange={(e) =>
                                            handleArrayChange(index, 'utility', 'link', e.target.value)
                                        }
                                        className="w-full p-2 bg-gray-700 rounded-lg"
                                    />
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleUpdateAgent}
                            className="mt-4 bg-green-500 px-4 py-2 rounded-lg"
                        >
                            Save
                        </button>
                        <button
                            onClick={closeEditModal}
                            className="mt-4 bg-red-500 px-4 py-2 rounded-lg ml-2"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgentEditor;
