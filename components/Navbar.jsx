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
        return <OriginalButton {...props}>Connect Wallet</OriginalButton>;
      };
    }),
  { ssr: false }
);

// Detect if running on a mobile device
const isMobileDevice = () => {
  if (typeof window === "undefined") return false;

  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobile = mobileRegex.test(navigator.userAgent);

  // Additional checks for screen size
  const screenWidth = window.innerWidth || document.documentElement.clientWidth;
  const screenHeight =
    window.innerHeight || document.documentElement.clientHeight;

  return isMobile || screenWidth <= 768;
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
      // Check wallet connection status
      if (!connected) {
        if (isMobileDevice()) {
          // Improved mobile wallet connection logic
          if (!window.solana || !window.solana.isPhantom) {
            alert("Phantom wallet not detected. Please install first.");
            connectMobileWallet();
            return;
          }
        } else {
          alert("Please connect your wallet first.");
          return;
        }
      }

      // Rest of the sign-in logic remains the same
      const message = `Sign in to GekkoAI at ${new Date().toISOString()}`;
      const encodedMessage = new TextEncoder().encode(message);

      if (!signMessage) {
        throw new Error("Your wallet does not support message signing.");
      }

      const signature = await signMessage(encodedMessage);

      // Additional validation
      if (!signature) {
        throw new Error("Signature creation failed.");
      }

      Cookies.set("walletAddress", publicKey.toString(), { path: "/" });
      setIsSignedIn(true);
      alert("Successfully signed in!");
    } catch (error) {
      console.error("Sign-in Error:", error);

      // Detailed error messaging
      const errorMessage = error.message || "An unexpected error occurred.";

      if (errorMessage.includes("no installed wallet")) {
        alert(
          "No compatible Solana wallet found. Please install Phantom or Solflare."
        );
        connectMobileWallet();
      } else {
        alert(`Failed to sign in: ${errorMessage}`);
      }
    }
  };

  const connectMobileWallet = () => {
    // Check for specific mobile wallet providers
    if (window.solana && window.solana.isPhantom) {
      // Phantom wallet detected
      window.solana.connect();
    } else if (window.solflare && window.solflare.isSolflare) {
      // Solflare wallet detected
      window.solflare.connect();
    } else {
      // Provide clear wallet installation guidance
      const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

      if (isMobile) {
        const walletOptions = [
          {
            name: "Phantom",
            ios: "https://apps.apple.com/app/phantom-crypto-wallet/id1567713696",
            android:
              "https://play.google.com/store/apps/details?id=io.phantom.android",
          },
          {
            name: "Solflare",
            ios: "https://apps.apple.com/app/solflare/id1580902014",
            android:
              "https://play.google.com/store/apps/details?id=com.solflare.mobile",
          },
        ];

        const platform = /iPhone|iPad/.test(navigator.userAgent)
          ? "ios"
          : "android";

        const message = `No compatible mobile wallet found. Would you like to install ${walletOptions[0].name}?`;

        if (confirm(message)) {
          window.location.href = walletOptions[0][platform];
        }
      } else {
        alert("Please install a Solana wallet like Phantom or Solflare");
      }
    }
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

  const ensureCorrectNetwork = async () => {
    try {
      const walletNetwork = await window.solana.getCluster();
      if (walletNetwork !== "mainnet-beta") {
        alert(
          "Your wallet is not connected to the Mainnet network. Please switch to Mainnet in your wallet settings."
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Failed to check wallet network:", error);
      alert("An error occurred while checking the network. Please try again.");
      return false;
    }
  };

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
            📤 Create Agent
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
            width: 350,
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
                  "&:hover": { backgroundColor: "#d9d9d9" },
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
                  "&:hover": { backgroundColor: "#d9d9d9" },
                }}
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
