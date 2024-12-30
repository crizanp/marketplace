import "@/styles/globals.css";
import '@solana/wallet-adapter-react-ui/styles.css';

import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import Script from "next/script"; // Import Next.js Script component

export default function App({ Component, pageProps }) {
  const network = clusterApiUrl('devnet'); // Change to 'mainnet-beta' for production
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

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
