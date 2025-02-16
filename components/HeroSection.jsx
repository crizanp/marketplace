// HeroSection.jsx
import styles from "../styles/HeroSection.module.css";

const HeroSection = () => (
  <div className={styles.hero}>
    <div className={styles.heroAscii}>

{`   ██████╗ ██╗   ██╗██╗     ██╗         █████╗ ██╗
   ██╔══██╗██║   ██║██║     ██║        ██╔══██╗██║
   ██████╔╝██║   ██║██║     ██║        ███████║██║
   ██╔══██╗██║   ██║██║     ██║        ██╔══██║██║
   ██████╔╝╚██████╔╝███████╗███████╗   ██║  ██║██║
   ╚═════╝  ╚═════╝ ╚══════╝╚══════╝   ╚═╝  ╚═╝╚═╝
   > Welcome to BullAI.fun - The first AI agent marketplace and launchpad < `}
    </div>
    <p className={styles.heroSubtitle}>
      ⚡ Revolutionize your workflow with cutting-edge AI Agents. Explore, integrate, and grow smarter with <span className={styles.highlight}>BULL AI</span>.
    </p>
    <div className={styles.heroButtons}>
      <a href="https://dexscreener.com/solana/G4YyirkFcHU4Xn6jJ5GyTLv291n3Sxtv8vzJnBM2pump">
        <button className={styles.ctaPrimary}>🚀 Get $BULL</button>
      </a>
      <a href="https://gekkoais-organization.gitbook.io/aigekko.fun-or-usdgekko-ai-marketplace/">
        <button className={styles.ctaSecondary}>📤 Read Whitepaper</button>
      </a>
    </div>
  </div>
);

export default HeroSection;