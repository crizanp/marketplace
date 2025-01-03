import React from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';

import '@/styles/globals.css';
import '@solana/wallet-adapter-react-ui/styles.css'; // Default styles for wallet adapter

import { useMemo } from 'react';

import { clusterApiUrl } from '@solana/web3.js';
import Script from 'next/script'; // Import Next.js Script component

export default function App({ Component, pageProps }) {
  const network = WalletAdapterNetwork.Mainnet;

  const endpoint = 'https://api.mainnet-beta.solana.com';
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ];

  return (
    <>
      {/* Add the hCaptcha script */}
      <Script
        src="https://js.hcaptcha.com/1/api.js"
        strategy="lazyOnload"
        async
        defer
      />

      <ConnectionProvider endpoint={endpoint}>
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
