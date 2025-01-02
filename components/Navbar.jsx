import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import { useWallet } from "@solana/wallet-adapter-react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import { FaRocket, FaDollarSign } from "react-icons/fa";
import { Close as CloseIcon } from "@mui/icons-material";
import styles from "../styles/Home.module.css";

// Dynamically load WalletMultiButton
const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then((mod) => {
      const OriginalButton = mod.WalletMultiButton;

      return function CustomWalletMultiButton(props) {
        return (
          <OriginalButton
            {...props}
            onClick={(e) => {
              // Prevent default for mobile
              if (isMobileDevice()) {
                e.preventDefault();
                connectMobileWallet();
              }
            }}
          >
            Connect Wallet
          </OriginalButton>
        );
      };
    }),
  { ssr: false }
);

// Detect if running on a mobile device
const isMobileDevice = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Navbar Component
const Navbar = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { connected, publicKey, signMessage, disconnect } = useWallet();

  useEffect(() => {
    const walletAddress = Cookies.get("walletAddress");
    if (walletAddress) {
      setIsSignedIn(true);
    }
  }, []);

  useEffect(() => {
    const walletAddress = Cookies.get("walletAddress");
    if (connected && !isSignedIn && !walletAddress) {
      handleSignIn();
    }
  }, [connected]);

  const handleSignIn = async () => {
    try {
      if (!connected) {
        if (isMobileDevice()) {
          connectMobileWallet();
        } else {
          alert("Please connect your wallet first.");
        }
        return;
      }

      const message = `Sign in to GekkoAI at ${new Date().toISOString()}`;
      const encodedMessage = new TextEncoder().encode(message);

      if (!signMessage) {
        alert("Your wallet does not support message signing.");
        return;
      }

      const signature = await signMessage(encodedMessage);

      Cookies.set("walletAddress", publicKey.toString());
      setIsSignedIn(true);
    } catch (error) {
      console.error("Error signing message:", error);
      alert("Failed to sign in. Please try again.");
    }
  };

  const connectMobileWallet = () => {
    // Phantom deep links
    const phantomDeepLinks = {
      // Use the specific Phantom deep link for connection
      connect: "phantom://v2/connect",

      // Fallback store links
      iosStore: "https://apps.apple.com/app/phantom-crypto-wallet/id1567713696",
      androidStore:
        "https://play.google.com/store/apps/details?id=io.phantom.android",
    };

    // Check if running on mobile
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    // Detect mobile OS
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (!isMobile) {
      alert("This method is only for mobile devices");
      return;
    }

    // For local development, use a more explicit approach
    const tryConnectPhantom = () => {
      // First, try the deep link
      window.location.href = phantomDeepLinks.connect;

      // Create a fallback iframe method
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = phantomDeepLinks.connect;
      document.body.appendChild(iframe);

      // Timeout to handle different scenarios
      setTimeout(() => {
        // Remove iframe
        if (iframe && iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }

        // Prompt for app store if Phantom doesn't open
        const shouldInstall = confirm(
          "Phantom Wallet not found. Would you like to install it?"
        );

        if (shouldInstall) {
          window.location.href = isIOS
            ? phantomDeepLinks.iosStore
            : phantomDeepLinks.androidStore;
        }
      }, 1500); // Give some time for app to open
    };

    // Additional logging for debugging
    console.log("Attempting to connect Phantom Wallet");
    console.log("Current URL:", window.location.href);
    console.log("Connecting from local IP:", window.location.hostname);

    // Execute connection attempt
    tryConnectPhantom();
  };
  const handleSignOut = () => {
    disconnect();
    clearCookies();
    setIsSignedIn(false);
    alert("Successfully signed out!");
  };

  const clearCookies = () => {
    const cookies = document.cookie.split(";");
    cookies.forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
    });
    Cookies.remove("walletAddress");
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.topRow}>
        <div className={styles.logo}>
          <Image
            src="https://aigekko.vercel.app/D.png"
            alt="Gekko AI Logo"
            width={50}
            height={50}
          />
          <span>&lt;GekkoAI/&gt;</span>
        </div>
        <div className={styles.walletButton}>
          {connected ? (
            <button onClick={handleSignOut} className={styles.walletButton}>
              Disconnect Wallet
            </button>
          ) : (
            <WalletMultiButton
              className={styles.walletButton}
              onClick={isMobileDevice() ? connectMobileWallet : undefined}
            />
          )}
        </div>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <Link href="/">🏠 Home</Link>
        </li>
        <li>
          <Link href="/explorer">🧠 Explore</Link>
        </li>
        <li>
          <a onClick={openModal} style={{ cursor: "pointer" }}>
            📤 List Agent
          </a>
        </li>
      </ul>
      <Modal open={modalOpen} onClose={closeModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "#f5f5f5",
            borderRadius: "12px",
            boxShadow: 24,
            p: 4,
            color: "#333",
            border: "2px solid #27ae60",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#27ae60" }}
            >
              Create New AI Agent
            </Typography>
            <IconButton onClick={closeModal} sx={{ color: "#27ae60" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
              mt: 2,
            }}
          >
            <Link href="/list-agent?tab=launch-agent" passHref>
              <Box
                sx={{
                  flex: 1,
                  textAlign: "center",
                  border: "2px solid #27ae60",
                  borderRadius: "12px",
                  padding: "20px",
                  cursor: "pointer",
                  backgroundColor: "#e8e8e8",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": {
                    backgroundColor: "#d9d9d9",
                  },
                }}
                onClick={closeModal}
              >
                <FaRocket size={40} color="#27ae60" />
                <Typography
                  variant="body1"
                  sx={{ mt: 1, fontWeight: "bold", color: "#333" }}
                >
                  Launch a New Token
                </Typography>
              </Box>
            </Link>
            <Link href="/list-agent?tab=new-submission" passHref>
              <Box
                sx={{
                  flex: 1,
                  textAlign: "center",
                  border: "2px solid #27ae60",
                  borderRadius: "12px",
                  padding: "20px",
                  cursor: "pointer",
                  backgroundColor: "#e8e8e8",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": {
                    backgroundColor: "#d9d9d9",
                  },
                }}
                onClick={closeModal}
              >
                <FaDollarSign size={40} color="#27ae60" />
                <Typography
                  variant="body1"
                  sx={{ mt: 1, fontWeight: "bold", color: "#333" }}
                >
                  I Have My Own Token
                </Typography>
              </Box>
            </Link>
          </Box>
        </Box>
      </Modal>
    </nav>
  );
};

export default Navbar;
