// components/PartnerShowcase.js
import React from 'react';
import Link from 'next/link';

const partners = [
  {
    name: "DexScreener",
    logo: "https://cdn.prod.website-files.com/6421d264d066fd2b24b91b20/661375b92a7e161501f4b5e5_dexscreener.322a5a2d.png",
    link: "https://dexscreener.com/solana/b3jpvaxhdmb3ptafvl4shhtp6d23qdtlfbejetzy24ap",
  },
  {
    name: "DexCheck",
    logo: "https://dexcheck.fun/images/Logo.png",
    link: "https://dexcheck.fun",
  },
  {
    name: "CoinMarketCap",
    logo: "/cmc-logo.png",
    link: "https://coinmarketcap.com",
  },
  {
    name: "CoinGecko",
    logo: "/cg-logo.png",
    link: "https://coingecko.com",
  },
  {
    name: "Solana",
    logo: "/sol-image.png",
    link: "https://explorer.solana.com/",
  },
  {
    name: "Jupiter",
    logo: "/jupyter-logo.png",
    link: "https://jup.ag/swap/SOL-G4YyirkFcHU4Xn6jJ5GyTLv291n3Sxtv8vzJnBM2pump",
  },
  {
    name: "Raydium",
    logo: "/raydium-logo.png",
    link: "https://raydium.io/swap/?inputMint=sol&outputMint=G4YyirkFcHU4Xn6jJ5GyTLv291n3Sxtv8vzJnBM2pump",
  },
  {
    name: "PumpFun",
    logo: "/Pump_fun_logo.png",
    link: "https://pump.fun",
  },
  {
    name: "Photon",
    logo: "photon-logo.png",
    link: "https://photon-sol.tinyastro.io/en/lp/B3jpVAXHDmb3PTaFvL4SHhTP6D23qdTLFBEjeTzY24AP?handle=115937696e4eec89665d0c",
  },
  {
    name: "MEVX",
    logo: "/mevx-logo.jpg",
    link: "https://mevx.io/solana/G4YyirkFcHU4Xn6jJ5GyTLv291n3Sxtv8vzJnBM2pump?ref=MajorBuyBot",
  },
];

const PartnerShowcase = () => {
  return (
    <div className="lg:px-10 lg:p-5 pb-5 bg-gradient-to-r from-white to-[#f0f7f4] border-t border-green-500 text-gray-800">
      <div className="text-center mb-5">
        <h2 className="text-2xl font-bold text-[rgb(4, 27, 16)] pt-4">
          Our Partners and Ecosystems
        </h2>
        <p className="text-sm md:text-base text-gray-600 mt-2 mb-6">
          Connecting you to our partners with the best in the industry
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {partners.map((partner, index) => (
          <a
            key={index}
            href={partner.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-[#f0f7f4] border border-[#e6f3ed] rounded-lg shadow-sm hover:shadow-md p-4 flex flex-col items-center text-center group transition-all duration-200"
          >
            <div className="h-16 flex items-center justify-center mb-3">
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-full max-w-full object-contain transition-transform transform group-hover:scale-110"
              />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-[#00cc6a]">
              {partner.name}
            </span>
          </a>
        ))}
      </div>

      <div className="text-center mt-6">
        <Link 
          href="/partners" 
          className="text-[#00cc6a] hover:text-[#00a857] font-medium transition-colors duration-200 inline-flex items-center gap-2"
        >
          View All Partners
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default PartnerShowcase;