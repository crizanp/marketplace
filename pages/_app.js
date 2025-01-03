import '@/styles/globals.css';
import '@solana/wallet-adapter-react-ui/styles.css'; // Default styles for wallet adapter

import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  // Consider adding mobile-specific adapters
  SolongWalletAdapter,
  TorusWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import Script from 'next/script'; // Import Next.js Script component

export default function App({ Component, pageProps }) {
  const network = clusterApiUrl('mainnet-beta'); // Change this to 'mainnet-beta' for production
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new SolongWalletAdapter(),
    new TorusWalletAdapter()
  ], []);

  return (
    <>
      {/* Add the hCaptcha script */}
      <Script
        src="https://js.hcaptcha.com/1/api.js"
        strategy="lazyOnload"
        async
        defer
      />

      <ConnectionProvider endpoint={network}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <div className="font-inter">
              <Component {...pageProps} />
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}
