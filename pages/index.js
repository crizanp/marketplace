import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AgentsList from "../components/AgentsList";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.css";
import AgentsTable from "@/components/AgentsTable";
import PartnerShowcase from "@/components/PartnerShowcase";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className={styles.main}>
        <HeroSection />
        <AgentsTable />
        <PartnerShowcase />
      </main>
      <Footer />
    </div>
  );
}
