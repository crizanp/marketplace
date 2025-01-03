// components/PartnerShowcase.js

const partners = [
    {
        name: "DexScreener",
        logo: "/dexscreener-logo.png",
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
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-16 px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-green-400 mb-4">
                Our Partners and Ecosystems
            </h2>
            <p className="text-sm md:text-base text-center text-gray-400 mb-8">
                Connecting you to our partners with the best in the industry
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-6 gap-3">
                {partners.map((partner, index) => (
                    <a
                        key={index}
                        href={partner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-700 hover:bg-gray-600 transition-all rounded-lg shadow-lg hover:shadow-2xl p-4 sm:p-6 flex flex-col items-center text-center group"
                    >
                        <img
                            src={partner.logo}
                            alt={partner.name}
                            className="w-20 h-10 sm:w-24 sm:h-12 object-contain mb-2 sm:mb-4 transition-transform transform group-hover:scale-110"
                        />
                        <span className="text-xs sm:text-sm md:text-base font-semibold group-hover:text-blue-300">
                            {partner.name}
                        </span>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default PartnerShowcase;
