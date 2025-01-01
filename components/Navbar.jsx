import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import { useWallet } from "@solana/wallet-adapter-react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import { FaRocket, FaDollarSign } from "react-icons/fa"; // Updated icons
import { Close as CloseIcon } from "@mui/icons-material";
import styles from "../styles/Home.module.css";

// Dynamically load WalletMultiButton
const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then((mod) => {
      const OriginalButton = mod.WalletMultiButton;

      return function CustomWalletMultiButton(props) {
        return (
          <OriginalButton {...props}>
            Connect Wallet {/* Custom button text */}
          </OriginalButton>
        );
      };
    }),
  { ssr: false }
);

const Navbar = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { connected, publicKey, signMessage, disconnect } = useWallet(); // Wallet hooks
  const [modalOpen, setModalOpen] = useState(false); // Modal state

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
        alert("Please connect your wallet first.");
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
          <img
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
            <WalletMultiButton className={styles.walletButton} />
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
      {/* Modal */}
      <Modal open={modalOpen} onClose={closeModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "#f5f5f5", // Silverish background
            borderRadius: "12px",
            boxShadow: 24,
            p: 4,
            color: "#333", // Dark text for contrast
            border: "2px solid #27ae60", // Green border
          }}
        >
          {/* Modal Header */}
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

          {/* Options */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
              mt: 2,
            }}
          >
            {/* Launch a New Token */}
            <Link href="/list-agent?tab=launch-agent" passHref>
              <Box
                sx={{
                  flex: 1,
                  textAlign: "center",
                  border: "2px solid #27ae60", // Green border for option box
                  borderRadius: "12px",
                  padding: "20px",
                  cursor: "pointer",
                  backgroundColor: "#e8e8e8", // Light silver background
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center", // Center the icon
                  justifyContent: "center", // Center vertically
                  "&:hover": {
                    backgroundColor: "#d9d9d9", // Slightly darker silver on hover
                  },
                }}
                onClick={closeModal}
              >
                <FaRocket size={40} color="#27ae60" /> {/* Green icon */}
                <Typography
                  variant="body1"
                  sx={{ mt: 1, fontWeight: "bold", color: "#333" }}
                >
                  Launch a New Token
                </Typography>
              </Box>
            </Link>

            {/* I Have My Own Token */}
            <Link href="/list-agent?tab=new-submission" passHref>
              <Box
                sx={{
                  flex: 1,
                  textAlign: "center",
                  border: "2px solid #27ae60", // Green border for option box
                  borderRadius: "12px",
                  padding: "20px",
                  cursor: "pointer",
                  backgroundColor: "#e8e8e8", // Light silver background
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center", // Center the icon
                  justifyContent: "center", // Center vertically
                  "&:hover": {
                    backgroundColor: "#d9d9d9", // Slightly darker silver on hover
                  },
                }}
                onClick={closeModal}
              >
                <FaDollarSign size={40} color="#27ae60" /> {/* Green icon */}
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
