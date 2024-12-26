import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useState } from 'react';

const Navbar = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const connectWallet = () => {
    setIsWalletConnected(!isWalletConnected);
  };

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logo}>
        <Image src="/D.png" alt="Gekko AI Logo" width={50} height={50} />
        <span>&lt;GekkoAI/&gt;</span>
      </div>

      {/* Navbar Links */}
      <ul className={styles.navLinks}>
        <li>
          <Link href="/">🏠 Home</Link>
        </li>
        <li>
          <Link href="/explorer">🧠 Explore Agents</Link>
        </li>
        <li>
          <Link href="/list-agent">📤 List Your Agent</Link>
        </li>
      </ul>

      {/* Wallet Connect Button */}
      <div className={styles.walletButton}>
        <button onClick={connectWallet}>
          {isWalletConnected ? '🔌 Wallet Connected' : '💼 Connect Wallet'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
