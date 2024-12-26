import styles from "../styles/HeroSection.module.css";

const HeroSection = () => (
  <div className={styles.hero}>
    <div className={styles.heroAscii}>
      {`
  ██████╗ ███████╗██╗  ██╗██╗  ██╗ ██████╗      █████╗ ██╗
  ██╔════╝ ██╔════╝██║ ██╔╝██║ ██╔╝██╔═══██╗    ██╔══██╗██║
  ██║  ███╗█████╗  █████╔╝ █████╔╝ ██║   ██║    ███████║██║
  ██║   ██║██╔══╝  ██╔═██╗ ██╔═██╗ ██║   ██║    ██╔══██║██║
  ╚██████╔╝███████╗██║  ██╗██║  ██╗╚██████╔╝    ██║  ██║██║
   ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝     ╚═╝  ╚═╝╚═╝

     > Welcome to GEKKOAI.fun - The Father of All AI Agents <
`}
    </div>
    <p className={styles.heroSubtitle}>
      ⚡ Revolutionize your workflow with cutting-edge AI Agents. Explore, integrate, and grow smarter with <span className={styles.highlight}>GEKKOAI</span>.
    </p>
    <div className={styles.heroButtons}>
      <button className={styles.ctaPrimary}>🚀 Explore AI Agents</button>
      <button className={styles.ctaSecondary}>📤 Read Whitepaper</button>
    </div>
  </div>
);

export default HeroSection;
