import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AgentsList from "../components/AgentsList";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.css";
import AgentsTable from "@/components/AgentsTable";
import PartnerShowcase from "@/components/PartnerShowcase";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>AI Agent Marketplace & Launchpad - Gekko AI on Solana</title>
        <meta
          name="description"
          content="Discover Gekko AI, the leading AI agent marketplace and launchpad built on Solana. Find, trade, and deploy cutting-edge AI agents for trading, DeFi, and more."
        />
        <meta
          name="keywords"
          content="AI agent marketplace, AI launchpad, Solana blockchain, Gekko AI, trading AI, DeFi automation, crypto innovation"
        />
        <meta property="og:title" content="AI Agent Marketplace & Launchpad - Gekko AI on Solana" />
        <meta
          property="og:description"
          content="Explore Gekko AI, a revolutionary platform on Solana, providing an AI agent marketplace and launchpad for crypto and blockchain enthusiasts."
        />
        <meta property="og:image" content="/gekkobanner.jpg" />
        <meta property="og:url" content="https://www.aigekko.fun" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Agent Marketplace & Launchpad - Gekko AI on Solana" />
        <meta
          name="twitter:description"
          content="Revolutionize your blockchain experience with Gekko AI's AI agent marketplace and launchpad on Solana."
        />
        <meta name="twitter:image" content="/gekkobanner.jpg" />
        <link rel="canonical" href="https://www.aigekko.fun" />
      </Head>
      <div>
        <Navbar />
        <main className={styles.main}>
          <HeroSection />
          <AgentsTable />
          <PartnerShowcase />
        </main>
        <Footer />
      </div>
    </>
  );
}
