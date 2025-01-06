import React from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
    return (
        <div className="bg-gray-900 text-gray-200">
            <Head>
                <title>About Gekko AI</title>
                <meta name="description" content="Learn about Gekko AI - revolutionizing blockchain with AI-powered solutions. Explore the limitless potential of decentralized intelligence." />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href="/favicon.ico" />
                <meta property="og:image" content="/gekkobanner.jpg" />
                <meta name="twitter:image" content="/gekkobanner.jpg" />

            </Head>

            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <section className="bg-gradient-to-b from-gray-800 to-gray-900 py-16">
                <div className="container mx-auto px-6 lg:px-20 text-center">
                    <h1 className="text-5xl lg:text-6xl font-bold text-green-400">
                        About <span className="text-white">Gekko AI</span>
                    </h1>
                    <p className="mt-4 text-lg lg:text-xl text-gray-300">
                        Revolutionizing blockchain with AI-powered solutions. Explore the limitless potential of decentralized intelligence.
                    </p>
                </div>
            </section>

            {/* Who We Are Section */}
            <section className="py-16">
                <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-green-400 mb-6">Who We Are</h2>
                        <p className="text-lg lg:text-xl leading-8 text-gray-300">
                            Gekko AI is pioneering the integration of artificial intelligence and blockchain technology. Built on Solana&apos;s high-speed and low-cost infrastructure, we enable developers, traders, and innovators to redefine the possibilities of AI in decentralized ecosystems.
                        </p>
                        <p className="mt-4 text-lg lg:text-xl leading-8 text-gray-300">
                            From automating trading strategies to simplifying DeFi operations and exploring NFT intelligence, Gekko AI is your trusted partner in bridging AI and blockchain.
                        </p>
                    </div>
                    {/* Image */}
                    <div className="flex justify-center">
                        <img
                            src="/gekkobanner.jpg"
                            alt="Solana Blockchain"
                            className="w-full max-w-md lg:max-w-lg rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            </section>

            {/* What We Offer Section */}
            <section className="py-16 bg-gray-800">
                <div className="container mx-auto px-6 lg:px-20">
                    <h2 className="text-4xl lg:text-5xl font-bold text-green-400 mb-12 text-center">
                        What We Offer
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {/* Card 1 */}
                        <div className="p-6 bg-gray-700 rounded-lg shadow-lg hover:scale-105 transition-transform">
                            <h3 className="text-2xl font-semibold text-green-300 mb-4">AI Agent Launchpad</h3>
                            <p className="text-gray-300">
                                Build, deploy, and scale AI agents seamlessly on Solana&apos;s high-speed and low-cost blockchain network. Leverage cutting-edge tools to redefine decentralized intelligence.
                            </p>
                        </div>
                        {/* Card 2 */}
                        <div className="p-6 bg-gray-700 rounded-lg shadow-lg hover:scale-105 transition-transform">
                            <h3 className="text-2xl font-semibold text-green-300 mb-4">Developer Resources</h3>
                            <p className="text-gray-300">
                                Access comprehensive developer resources, including SDKs, APIs, and funding opportunities, to bring your AI solutions to life on Solana.
                            </p>
                        </div>
                        {/* Card 3 */}
                        <div className="p-6 bg-gray-700 rounded-lg shadow-lg hover:scale-105 transition-transform">
                            <h3 className="text-2xl font-semibold text-green-300 mb-4">Scalable Blockchain Infrastructure</h3>
                            <p className="text-gray-300">
                                Harness the power of Solana’s scalable and efficient blockchain infrastructure to deploy AI agents optimized for speed and cost-effectiveness.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/* Why Choose Gekko AI Section */}
            <section className="py-16">
                <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center">
                    {/* Text Content */}
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-green-400 mb-6">Why Choose Gekko AI?</h2>
                        <ul className="list-disc list-inside text-lg lg:text-xl leading-8 text-gray-300 space-y-4">
                            <li className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-2xl hover:scale-105 transition-transform">
                                Leverage Solana&apos;s high-speed and low-cost transactions for AI deployment.
                            </li>
                            <li className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-2xl hover:scale-105 transition-transform">
                                Access a diverse marketplace of tokenized AI agents for any blockchain application.
                            </li>
                            <li className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-2xl hover:scale-105 transition-transform">
                                Empower innovation with developer resources and launchpad support.
                            </li>
                            <li className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-2xl hover:scale-105 transition-transform">
                                Engage with a transparent, decentralized community focused on ethical AI use.
                            </li>
                            <li className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-2xl hover:scale-105 transition-transform">
                                Secure your assets and data with robust blockchain-backed security measures.
                            </li>
                        </ul>
                    </div>
                    {/* Image */}
                    <div className="flex justify-center">
                        <img
                            src="/gekkoaibanner3.jpg"
                            alt="Decentralization with Solana"
                            className="w-full max-w-md lg:max-w-lg rounded-lg shadow-lg"
                        />
                    </div>
                </div>

            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default About;
