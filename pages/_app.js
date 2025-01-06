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
import Head from 'next/head';
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
      <Head>
        {/* Add custom favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
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
