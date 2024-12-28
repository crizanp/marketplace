import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';
import { useWallet } from '@solana/wallet-adapter-react';
import styles from '../styles/Home.module.css';

// Dynamically load WalletMultiButton
const WalletMultiButton = dynamic(
  () =>
    import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

const Navbar = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { connected, publicKey, signMessage, disconnect } = useWallet(); // Wallet hooks

  useEffect(() => {
    // Check if user is already signed in (using cookies)
    const walletAddress = Cookies.get('walletAddress');
    if (walletAddress) {
      setIsSignedIn(true);
    }
  }, []);

  useEffect(() => {
    // Automatically attempt sign-in when wallet is connected and user isn't already signed in
    const walletAddress = Cookies.get('walletAddress');
    if (connected && !isSignedIn && !walletAddress) {
      handleSignIn();
    }
  }, [connected]);

  const handleSignIn = async () => {
    try {
      if (!connected) {
        alert('Please connect your wallet first.');
        return;
      }

      const message = `Sign in to GekkoAI at ${new Date().toISOString()}`;
      const encodedMessage = new TextEncoder().encode(message);

      if (!signMessage) {
        alert('Your wallet does not support message signing.');
        return;
      }

      // Request user to sign the message
      const signature = await signMessage(encodedMessage);

      // Log details (can be used for verification)
      console.log('Signed message:', message);
      console.log('Signature:', signature);

      // Store wallet address in cookies and mark as signed in
      Cookies.set('walletAddress', publicKey.toString());
      setIsSignedIn(true);
    } catch (error) {
      console.error('Error signing message:', error);
      alert('Failed to sign in. Please try again.');
    }
  };

  const handleSignOut = () => {
    disconnect(); // Disconnect wallet
    clearCookies(); // Clear all cookies
    setIsSignedIn(false);
    alert('Successfully signed out!');
  };

  const clearCookies = () => {
    // Clear all cookies
    const cookies = document.cookie.split(';');
    cookies.forEach((cookie) => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
    });
    Cookies.remove('walletAddress'); // Ensure walletAddress cookie is cleared
  };

  return (
    <nav className={styles.navbar}>
      {/* Top Row: Logo */}
      <div className={styles.topRow}>
        <div className={styles.logo}>
          <img src="https://aigekko.vercel.app/D.png" alt="Gekko AI Logo" width={50} height={50} />
          <span>&lt;GekkoAI/&gt;</span>
        </div>
        <div className={styles.walletButton}>
          {connected ? (
            <button onClick={handleSignOut} className={styles.walletButtonCustom}>
              🔒 Sign Out
            </button>
          ) : (
            <WalletMultiButton className={styles.walletButtonCustom} />
          )}
        </div>
      </div>

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
