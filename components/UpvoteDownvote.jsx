import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import idl from "./idl.json"; // Ensure this file is correctly placed and contains your program's IDL

const programId = new PublicKey("4qxCePpQggNdzVSsT4Nk6AmzpUGU2dZmPDopeDry2URL");
const network = "https://api.devnet.solana.com"; // Change to mainnet or localnet if needed
const preflightCommitment = "processed";

const UpvoteDownvote = ({ contractaddress }) => {
  const { publicKey, wallet, connected } = useWallet();
  const [program, setProgram] = useState(null);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const connection = new Connection(network, preflightCommitment);
    const provider = new AnchorProvider(connection, wallet, {
      preflightCommitment,
    });
    const programInstance = new Program(idl, programId, provider);
    setProgram(programInstance);
  }, [wallet]);

  useEffect(() => {
    const fetchVotes = async () => {
      if (!contractaddress || !program) return;
      try {
        const [votesAccount] = await PublicKey.findProgramAddress(
          [Buffer.from("votes"), new PublicKey(contractaddress).toBuffer()],
          programId
        );

        const accountInfo = await program.provider.connection.getAccountInfo(votesAccount);
        if (accountInfo === null) {
          // Check if the wallet supports signing
          if (wallet && wallet.signTransaction) {
            const txId = await program.methods
              .initialize(contractaddress)
              .accounts({
                votes: votesAccount,
                user: publicKey,
                systemProgram: web3.SystemProgram.programId,
              })
              .rpc();
            console.log("Initialized account with transaction ID:", txId);
          } else {
            throw new Error("Wallet does not support transaction signing.");
          }
        }

        const accountData = await program.account.votes.fetch(votesAccount);
        setUpvotes(accountData.upvotes.toNumber());
        setDownvotes(accountData.downvotes.toNumber());
      } catch (error) {
        console.error("Error fetching votes:", error);
      }
    };

    fetchVotes();
  }, [contractaddress, program]);

  const handleVote = async (isUpvote) => {
    if (!connected) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      setLoading(true);
      const [votesAccount] = await PublicKey.findProgramAddress(
        [Buffer.from("votes"), new PublicKey(contractaddress).toBuffer()],
        programId
      );

      if (wallet && wallet.signTransaction) {
        await program.methods
          .vote(isUpvote)
          .accounts({
            votes: votesAccount,
            user: publicKey,
          })
          .rpc();

        if (isUpvote) {
          setUpvotes((prev) => prev + 1);
        } else {
          setDownvotes((prev) => prev + 1);
        }

        alert(`Successfully ${isUpvote ? "upvoted" : "downvoted"}!`);
      } else {
        throw new Error("Wallet does not support transaction signing.");
      }
    } catch (error) {
      console.error("Error casting vote:", error);
      alert("Failed to cast vote. Please try again.");
    } finally {
      setLoading(false);
    }
 }
  
  return (
    <div className="vote-container">
      <h2>Upvote and Downvote</h2>
      <p>Contract Address: {contractaddress}</p>
      <div>
        <button
          onClick={() => handleVote(true)}
          disabled={loading}
          className="upvote-button"
        >
          👍 Upvote ({upvotes})
        </button>
        <button
          onClick={() => handleVote(false)}
          disabled={loading}
          className="downvote-button"
        >
          👎 Downvote ({downvotes})
        </button>
      </div>
    </div>
  );
};

export default UpvoteDownvote;