import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useWallet, WalletAdapterNetwork } from '@solana/wallet-adapter-react';
import {
  Connection,
  clusterApiUrl,
  PublicKey,
} from '@solana/web3.js';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Cookies from 'js-cookie'; // For cookie management
import styles from '../styles/Home.module.css';

const Navbar = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const wallet = useWallet(); // Solana wallet adapter context

  useEffect(() => {
    // Check if the user is already signed in (cookie-based session)
    const signedInWallet = Cookies.get('walletAddress');
    if (signedInWallet) {
      setIsSignedIn(true);
    }
  }, []);

  const connectWallet = async () => {
    try {
      // Ensure wallet is connected
      if (!wallet.connected) {
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
        return;
      }

      // Get the connected wallet's public address
      const walletAddress = wallet.publicKey?.toString();

      // Save wallet address in cookies (as session)
      Cookies.set('walletAddress', walletAddress, { expires: 1 }); // Expires in 1 day
      setIsSignedIn(true);

      console.log(`Wallet Connected: ${walletAddress}`);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const signOut = () => {
    // Clear the session
    Cookies.remove('walletAddress');
    setIsSignedIn(false);
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
          {!isSignedIn ? (
            <WalletMultiButton className={styles.walletButtonCustom} />
          ) : (
            <button onClick={signOut}>🔒 Sign Out</button>
          )}
        </div>
      </div>

      {/* Floating Message */}
      {showMessage && (
        <div className={styles.floatingMessage}>
          Please connect your Solana wallet to sign in.
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
