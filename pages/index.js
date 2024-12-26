import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AgentsList from "../components/AgentsList";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.css";
import AgentsTable from "@/components/AgentsTable";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className={styles.main}>
        <HeroSection />
        <AgentsTable />
      </main>
      <Footer />
    </div>
  );
}
