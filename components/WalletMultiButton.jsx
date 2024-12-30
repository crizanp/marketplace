import { useWallet } from '@solana/wallet-adapter-react';

const CustomWalletButton = () => {
  const { connected, connect, disconnect } = useWallet();

  return connected ? (
    <button onClick={disconnect} className="custom-wallet-button">
      🔒 Disconnect
    </button>
  ) : (
    <button onClick={connect} className="custom-wallet-button">
      Connect Wallet
    </button>
  );
};

export default CustomWalletButton;
