import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useState } from 'react';

const Navbar = () => {
  const [showMessage, setShowMessage] = useState(false); // State to control the message visibility

  const connectWallet = () => {
    setShowMessage(true); // Show the message when the button is clicked

    // Hide the message after 3 seconds
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  return (
    <nav className={styles.navbar}>
      {/* Top Row: Logo and Wallet Button */}
      <div className={styles.topRow}>
        <div className={styles.logo}>
          <Image src="/D.png" alt="Gekko AI Logo" width={50} height={50} />
          <span>&lt;GekkoAI/&gt;</span>
        </div>
        <div className={styles.walletButton}>
          <button onClick={connectWallet}>💼 Connect Wallet</button>
        </div>
      </div>

      {/* Floating Message */}
      {showMessage && (
        <div className={styles.floatingMessage}>
          Full version will be released on Jan 1, this is just a prototype.
        </div>
      )}

      {/* Links Row: Navigation Menu */}
      <ul className={styles.navLinks}>
        <li>
          <Link href="/">🏠 Home</Link>
        </li>
        <li>
          <Link href="/explorer">🧠 Explore</Link>
        </li>
        <li>
          <Link href="/list-agent">📤 List Agent</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
