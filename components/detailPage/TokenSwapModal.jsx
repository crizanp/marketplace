import React, { useState, useEffect, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowDown, Search } from 'lucide-react';
import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';

const TokenSwapModal = ({ isOpen, onClose, destinationToken }) => {
  const [fromToken, setFromToken] = useState(null);
  const [amount, setAmount] = useState('');
  const [tokenList, setTokenList] = useState([]);
  const [filteredTokens, setFilteredTokens] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [rateLoading, setRateLoading] = useState(false);
  const [error, setError] = useState('');
  const [quote, setQuote] = useState(null);
  const [swapStatus, setSwapStatus] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const { connected, publicKey, signTransaction } = useWallet();
  const MAX_RECONNECTION_ATTEMPTS = 3;
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  const toToken = useMemo(() => destinationToken, [destinationToken]);
  
  // Initialize connection with retry mechanism
  const [connection, setConnection] = useState(null);
  
  const initConnection = async () => {
    const endpoints = [
      'https://api.mainnet-beta.solana.com',
      'https://solana-api.projectserum.com',
      'https://rpc.ankr.com/solana'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const conn = new Connection(endpoint, {
          commitment: 'confirmed',
          confirmTransactionInitialTimeout: 60000
        });
        
        // Test the connection
        await conn.getSlot();
        setConnection(conn);
        setConnectionStatus('connected');
        return conn;
      } catch (err) {
        console.warn(`Failed to connect to ${endpoint}:`, err);
        continue;
      }
    }
    
    setConnectionStatus('failed');
    setError('Unable to connect to Solana network. Please try again later.');
    return null;
  };
  useEffect(() => {
    if (!connection && connectionAttempts < MAX_RECONNECTION_ATTEMPTS) {
      const reconnect = async () => {
        const conn = await initConnection();
        if (!conn) {
          setConnectionAttempts(prev => prev + 1);
        }
      };
      reconnect();
    }
  }, [connection, connectionAttempts]);
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchTokenList = async () => {
      if (!isOpen) return;
      
      try {
        setLoading(true);
        // Try multiple token list endpoints
        const endpoints = [
          'https://token.jup.ag/all',
          'https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json',
          'https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json'
        ];

        let data = null;
        let error = null;

        for (const endpoint of endpoints) {
          try {
            const response = await fetch(endpoint, {
              signal: controller.signal
            });
            
            if (response.ok) {
              data = await response.json();
              break;
            }
          } catch (err) {
            error = err;
            continue;
          }
        }

        if (!mounted) return;

        if (!data) {
          throw error || new Error('Failed to fetch token list from all endpoints');
        }

        // Process tokens array depending on the format
        const tokens = Array.isArray(data) ? data : (data.tokens || []);
        
        const uniqueSymbols = new Map();
        
        tokens.forEach(token => {
          const isPopular = token.tags?.includes('popular');
          const isPriority = ['SOL', 'USDC', 'USDT'].includes(token.symbol);
          
          const cleanSymbol = token.symbol.split('-')[0].trim();
          
          if (!uniqueSymbols.has(cleanSymbol) || (isPopular && !uniqueSymbols.get(cleanSymbol).isPopular)) {
            uniqueSymbols.set(cleanSymbol, {
              ...token,
              cleanSymbol,
              displaySymbol: cleanSymbol,
              isPopular: isPopular || isPriority
            });
          }
        });
        
        const uniqueTokens = [...uniqueSymbols.values()]
          .filter(token => token.isPopular || token.tags?.includes('popular'))
          .sort((a, b) => {
            if (a.isPopular !== b.isPopular) return a.isPopular ? -1 : 1;
            return a.displaySymbol.localeCompare(b.displaySymbol);
          })
          .slice(0, 50);
        
        setTokenList(uniqueTokens);
        setFilteredTokens(uniqueTokens);
        
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (mounted) {
          setError('Failed to load token list. Please try refreshing the page.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchTokenList();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [isOpen]);

  const getQuote = async () => {
    if (!amount || !fromToken || !toToken?.address) return;
    
    setRateLoading(true);
    setError('');
    
    try {
      const decimals = fromToken.decimals || 9;
      const amountInSmallestUnit = Math.floor(parseFloat(amount) * Math.pow(10, decimals));
      
      if (isNaN(amountInSmallestUnit) || amountInSmallestUnit <= 0) {
        throw new Error('Please enter a valid amount');
      }

      // Try multiple quote API endpoints
      const quoteEndpoints = [
        'https://quote-api.jup.ag/v6/quote',
        'https://jupiter-quote-api.solana.com/v6/quote'
      ];

      let quoteData = null;
      let quoteError = null;

      for (const endpoint of quoteEndpoints) {
        try {
          const url = `${endpoint}?inputMint=${encodeURIComponent(fromToken.address)}&outputMint=${encodeURIComponent(toToken.address)}&amount=${amountInSmallestUnit}&slippageBps=50`;
          
          const response = await fetch(url);
          const data = await response.json();
          
          if (response.ok) {
            quoteData = data;
            break;
          } else {
            quoteError = data.error;
          }
        } catch (err) {
          quoteError = err;
          continue;
        }
      }

      if (quoteData) {
        setQuote(quoteData);
      } else {
        if (quoteError === 'COULD_NOT_FIND_ANY_ROUTE') {
          throw new Error('No available swap route found. This pair may not have enough liquidity.');
        } else {
          throw new Error(`Failed to get quote: ${quoteError || 'Unknown error'}`);
        }
      }
    } catch (err) {
      console.error('Quote error:', err);
      setError(err.message || 'Failed to get quote. Please try again.');
    } finally {
      setRateLoading(false);
    }
  };

  const handleSwap = async () => {
    if (!connected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!quote) {
      setError('Please get a quote first');
      return;
    }

    if (!connection) {
      // Try to reconnect if connection is lost
      const conn = await initConnection();
      if (!conn) {
        setError('Network connection failed. Please try again.');
        return;
      }
    }

    setLoading(true);
    setSwapStatus('loading');
    
    try {
      // Verify connection is still valid before proceeding
      try {
        await connection.getSlot();
      } catch (err) {
        const conn = await initConnection();
        if (!conn) {
          throw new Error('Failed to establish network connection');
        }
      }

      const swapEndpoints = [
        'https://quote-api.jup.ag/v6/swap',
        'https://jupiter-swap-api.solana.com/v6/swap'
      ];

      let swapData = null;
      let swapError = null;

      for (const endpoint of swapEndpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              quoteResponse: quote,
              userPublicKey: publicKey.toString(),
              wrapUnwrapSOL: true
            })
          });

          const data = await response.json();
          
          if (response.ok) {
            swapData = data;
            break;
          } else {
            swapError = data.error;
          }
        } catch (err) {
          swapError = err;
          continue;
        }
      }

      if (!swapData) {
        throw new Error(swapError || 'Failed to prepare swap transaction');
      }

      const swapTransactionBuf = Buffer.from(swapData.swapTransaction, 'base64');
      
      let transaction;
      try {
        transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      } catch (err) {
        transaction = Transaction.from(swapTransactionBuf);
      }
      
      const signedTransaction = await signTransaction(transaction);
      
      if (!connection) {
        throw new Error('Connection lost during transaction signing');
      }

      const rawTransaction = signedTransaction.serialize();
      
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 3
      });
      
      // Wait for confirmation with timeout and retry logic
      let confirmed = false;
      let attempts = 0;
      const MAX_CONFIRMATION_ATTEMPTS = 3;

      while (!confirmed && attempts < MAX_CONFIRMATION_ATTEMPTS) {
        try {
          const confirmationPromise = connection.confirmTransaction(txid);
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Transaction confirmation timeout')), 60000)
          );
          
          await Promise.race([confirmationPromise, timeoutPromise]);
          confirmed = true;
        } catch (err) {
          attempts++;
          if (attempts >= MAX_CONFIRMATION_ATTEMPTS) {
            throw new Error('Failed to confirm transaction after multiple attempts');
          }
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
        }
      }
      
      setSwapStatus('success');
      setTimeout(() => onClose(), 2000);
      
    } catch (err) {
      console.error('Swap error:', err);
      setError(err.message || 'Swap failed. Please try again.');
      setSwapStatus('error');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!isOpen) {
      setFromToken(null);
      setAmount('');
      setQuote(null);
      setError('');
      setSwapStatus(null);
      setSearchQuery('');
      setDropdownVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;
// Simple division function that preserves full numeric value
const formatOutputAmount = (rawAmount, decimals = 6) => {
    if (!rawAmount) return '0';
    const amount = rawAmount / Math.pow(10, decimals); // Divide by 10^6 for 6 decimal places
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
      useGrouping: true
    }).format(amount);
};
  // Function to format token output amount
  // Function to format token output amount
// const formatOutputAmount = (rawAmount, decimals = toToken?.decimals || 9) => {
//     if (!rawAmount) return '0';
    
//     // Convert to actual decimal value based on token decimals
//     const amount = rawAmount / Math.pow(10, decimals);
    
//     // Handle large numbers with proper comma separation
//     // For example: 786746.062 should become 786,746.062
//     return new Intl.NumberFormat('en-US', {
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 6,
//       useGrouping: true
//     }).format(amount);
//   };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Swap Tokens</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl focus:outline-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {swapStatus === 'success' && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <AlertDescription className="text-green-700">Swap completed successfully!</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">From</label>
            <div className="relative">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  className="flex-1 p-3 bg-transparent text-left flex items-center gap-2 hover:bg-gray-50"
                  onClick={() => {
                    setDropdownVisible(!dropdownVisible); // Toggle dropdown visibility
                    if (!dropdownVisible) document.getElementById('tokenSearch').focus();
                  }}
                  disabled={loading}
                >
                  {fromToken ? (
                    <>
                      <img 
                        src={fromToken.logoURI || '/default-token-icon.png'} 
                        alt={fromToken.displaySymbol} 
                        className="w-6 h-6 rounded-full"
                        onError={(e) => {e.target.src = '/default-token-icon.png'}}
                      />
                      <span>{fromToken.displaySymbol}</span>
                    </>
                  ) : (
                    <span className="text-gray-400">Select token</span>
                  )}
                </button>
                <input
                  id="tokenSearch"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setDropdownVisible(true)} // Show dropdown on focus
                  placeholder="Search token..."
                  className="flex-1 p-3 focus:outline-none border-l"
                  disabled={loading}
                />
                <div className="px-3 flex items-center text-gray-400">
                  <Search size={18} />
                </div>
              </div>
              
              {/* Token dropdown */}
              {dropdownVisible && (
                <div id="token-dropdown" className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredTokens.length === 0 ? (
                    <div className="p-3 text-center text-gray-500">No tokens found</div>
                  ) : (
                    filteredTokens.map(token => (
                      <button
                        key={token.address}
                        className="w-full p-3 text-left flex items-center gap-2 hover:bg-gray-50 border-b last:border-b-0"
                        onClick={() => {
                          setFromToken(token);
                          setSearchQuery('');
                          setQuote(null);
                          setDropdownVisible(false); // Hide dropdown after selection
                        }}
                      >
                        <img 
                          src={token.logoURI || '/default-token-icon.png'} 
                          alt={token.displaySymbol} 
                          className="w-6 h-6 rounded-full"
                          onError={(e) => {e.target.src = '/default-token-icon.png'}}
                        />
                        <div className="flex-1">
                          <div className="font-medium">{token.displaySymbol}</div>
                          <div className="text-xs text-gray-500">{token.name}</div>
                        </div>
                        {token.tags?.includes('popular') && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Popular</span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setQuote(null);
                }}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter amount"
                disabled={loading || !fromToken}
                min="0"
                step="0.000001"
              />
              {fromToken && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded text-xs"
                  onClick={() => {
                    // Ideally fetch balance here, but for now just fill with default amount
                    setAmount('1');
                    setQuote(null);
                  }}
                >
                  MAX
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-gray-100 p-2 rounded-full">
              <ArrowDown size={20} className="text-gray-500" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">To</label>
            <div className="p-3 border rounded-lg bg-gray-50 flex items-center gap-2">
              {toToken?.logo && (
                <img 
                  src={toToken.logo || '/default-token-icon.png'} 
                  alt={toToken.symbol} 
                  className="w-6 h-6 rounded-full"
                  onError={(e) => {e.target.src = '/default-token-icon.png'}}
                />
              )}
              <span>{toToken?.symbol || 'Loading...'}</span>
            </div>
          </div>

          {quote && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between">
  <p className="text-sm font-medium">Expected Output:</p>
  <p className="text-sm font-bold">{formatOutputAmount(quote.outAmount)} {toToken?.symbol}</p>
</div>
<div className="flex justify-between">
  <p className="text-sm">Price Impact:</p>
  <p className={`text-sm font-medium ${parseFloat(quote.priceImpactPct) > 3 ? 'text-orange-600' : 'text-green-600'}`}>
    {parseFloat(quote.priceImpactPct).toFixed(7)}%
  </p>
</div>
<div className="flex justify-between">
  <p className="text-sm">Min Received:</p>
  <p className="text-sm font-medium">
    {formatOutputAmount(quote.otherAmountThreshold)} {toToken?.symbol}
  </p>
</div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={getQuote}
              disabled={!fromToken || !amount || rateLoading || loading}
              className="flex-1 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {rateLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Loading rate...</span>
                </>
              ) : (
                'Get Quote'
              )}
            </button>
            <button
              onClick={handleSwap}
              disabled={!quote || loading || !connected}
              className="flex-1 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Swapping...</span>
                </>
              ) : (
                'Swap'
              )}
            </button>
          </div>
          
          {!connected && (
            <div className="text-center text-sm text-gray-500">
              Please connect your wallet to swap tokens
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenSwapModal;