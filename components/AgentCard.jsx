import { FaTwitter, FaFacebookF, FaTelegramPlane, FaInstagram } from 'react-icons/fa';
import styles from '../styles/AgentCard.module.css';

const AgentCard = ({ agent }) => (
  <div className={styles.agentCard}>
    <div className={styles.agentHeader}>
      <img src={agent.logo} alt={agent.name} className={styles.agentLogo} />
      <div className={styles.agentInfo}>
        <h3>{agent.name} <span>({agent.ticker})</span></h3>
        <p>created by <span className={styles.creator}>@{agent.creator}</span> {agent.time} ago</p>
        <p>market cap: ${agent.marketCap} <span className={styles.emoji}>⚡</span></p>
      </div>
    </div>
    <div className={styles.agentBody}>
      <p>{agent.description}</p>
    </div>
    <div className={styles.agentFooter}>
      <div className={styles.replies}>replies: {agent.replies}</div>
      <div className={styles.socials}>
        <a href={agent.socials.twitter} target="_blank" rel="noopener noreferrer">
          <FaTwitter size={24} />
        </a>
        <a href={agent.socials.instagram} target="_blank" rel="noopener noreferrer">
          <FaInstagram size={24} />
        </a>
        <a href={agent.socials.facebook} target="_blank" rel="noopener noreferrer">
          <FaFacebookF size={24} />
        </a>
        <a href={agent.socials.telegram} target="_blank" rel="noopener noreferrer">
          <FaTelegramPlane size={24} />
        </a>
      </div>
    </div>
  </div>
);

export default AgentCard;