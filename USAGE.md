# The Block Indexer SDK - Usage Guide

## Overview

The Block Indexer SDK is a comprehensive blockchain indexing toolkit that provides unified interfaces to multiple blockchain data providers and indexers. It supports various networks including Ethereum, BSC, Solana, Base, and more, offering developers a consistent way to access on-chain data across different ecosystems.

## Features

- **Multi-chain Support**: Ethereum, BSC, Solana, Base, Arbitrum, Optimism, and more
- **Multiple Data Providers**: Integration with DexScreener, GeckoTerminal, GoldRush, and other services
- **Smart Contract Integration**: Pre-built modules for common indexing patterns
- **TypeScript Support**: Full type safety and intellisense
- **Flexible Architecture**: Mix and match different clients based on your needs

## Installation

```bash
npm install the-block-indexer-sdk
# or
yarn add the-block-indexer-sdk
# or
pnpm add the-block-indexer-sdk
```

## Quick Start

### Basic Usage

```typescript
import { 
  DexscreenerClient, 
  GeckoTerminalClient, 
  AddressIndexerClient,
  Erc20IndexerClient 
} from "the-block-indexer-sdk";

// Create clients for different data sources
const dexClient = new DexscreenerClient();
const geckoClient = new GeckoTerminalClient();
const addressClient = new AddressIndexerClient();
const erc20Client = new Erc20IndexerClient();

// Get token pairs from DexScreener
const pairs = await dexClient.getTokenPairs("solana", "USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB");
console.log("Token pairs:", pairs);

// Get token data from GeckoTerminal
const tokenData = await geckoClient.getTokenData("solana", "USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB");
console.log("Token data:", tokenData);

// Get address information
const addressInfo = await addressClient.getAddressData("1", "0x1234...abcd");
console.log("Address info:", addressInfo);

// Get ERC20 token information
const erc20Info = await erc20Client.getTokenInfo("1", "0x1234...abcd");
console.log("ERC20 info:", erc20Info);
```

## Available Clients

### 1. DexScreenerClient
Provides access to DEX pair data, token information, and trading metrics.

```typescript
const dexClient = new DexscreenerClient();

// Get all pairs for a token
const pairs = await dexClient.getTokenPairs(chainId, tokenAddress);

// Search for pairs
const searchResults = await dexClient.searchPairs(query);

// Get pair details
const pairDetails = await dexClient.getPairDetails(chainId, pairAddress);
```

### 2. GeckoTerminalClient
Access to token prices, market data, and exchange information.

```typescript
const geckoClient = new GeckoTerminalClient();

// Get token data
const tokenData = await geckoClient.getTokenData(chainId, tokenAddress);

// Get token price history
const priceHistory = await geckoClient.getTokenPriceHistory(chainId, tokenAddress, timeframe);

// Get supported networks
const networks = await geckoClient.getNetworks();
```

### 3. GoldRushClient
Access to comprehensive blockchain analytics and historical data.

```typescript
const goldRushClient = new GoldRushClient(apiKey);

// Get token holders
const holders = await goldRushClient.getTokenHolders(chainId, tokenAddress, page);

// Get historical prices
const historicalPrices = await goldRushClient.getHistoricalTokenPrices(chainId, tokenAddress, startDate, endDate);

// Get address transactions
const transactions = await goldRushClient.getAddressTransactions(chainId, address);
```

### 4. AddressIndexerClient
Query address-specific information across different chains.

```typescript
const addressClient = new AddressIndexerClient();

// Get address data
const addressData = await addressClient.getAddressData(chainId, address);

// Get address balance
const balance = await addressClient.getAddressBalance(chainId, address);

// Get address transaction history
const txHistory = await addressClient.getAddressTransactions(chainId, address, options);
```

### 5. Erc20IndexerClient
Access ERC-20 token information and metadata.

```typescript
const erc20Client = new Erc20IndexerClient();

// Get token information
const tokenInfo = await erc20Client.getTokenInfo(chainId, tokenAddress);

// Get token holders
const tokenHolders = await erc20Client.getTokenHolders(chainId, tokenAddress, page);

// Get token transfers
const transfers = await erc20Client.getTokenTransfers(chainId, tokenAddress, options);
```

### 6. UniswapV2IndexerClient
Specific client for Uniswap V2 pair data and liquidity information.

```typescript
const uniswapClient = new UniswapV2IndexerClient();

// Get pair information
const pairInfo = await uniswapClient.getPairInfo(chainId, pairAddress);

// Get liquidity data
const liquidityData = await uniswapClient.getLiquidityData(chainId, pairAddress);

// Get trading volume
const volume = await uniswapClient.getVolume(chainId, pairAddress, timeframe);
```

## Network Configuration

The SDK supports multiple blockchain networks. Each client requires the appropriate chain ID:

```typescript
const NETWORKS = {
  ETHEREUM: 1,
  BSC: 56,
  POLYGON: 137,
  ARBITRUM: 42161,
  OPTIMISM: 10,
  BASE: 8453,
  AVALANCHE: 43114,
  SOLANA: "solana",
  APTOS: "aptos",
  XRPL: "xrpl"
};
```

## Smart Contract Integration

The SDK includes pre-built smart contract modules for common indexing patterns:

### Available Modules

- **AddressIndexerModule**: Indexes address-specific data
- **ERC20IndexerModule**: Indexes ERC-20 token data
- **UniswapV2IndexerModule**: Indexes Uniswap V2 pairs and liquidity

### Deploying Indexer Contracts

```typescript
import { OnChainBuilder } from "the-block-indexer-sdk";

const builder = new OnChainBuilder();

// Deploy an Address Indexer
const addressIndexer = await builder.deployAddressIndexer(chainId, {
  rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/your-api-key",
  privateKey: "0xyour-private-key"
});

// Deploy an ERC-20 Indexer
const erc20Indexer = await builder.deployERC20Indexer(chainId, {
  rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/your-api-key",
  privateKey: "0xyour-private-key"
});
```

### Using Deployed Contracts

```typescript
import { AddressIndexerClient } from "the-block-indexer-sdk";

const addressClient = new AddressIndexerClient();

// Use deployed contract at known address
const contractAddress = "0x1234567890123456789012345678901234567890";
const addressData = await addressClient.getAddressDataFromContract(1, contractAddress, targetAddress);
```

## Configuration Options

### Client Configuration

```typescript
// Configure client with options
const dexClient = new DexscreenerClient({
  baseUrl: "https://api.dexscreener.com",
  timeout: 30000,
  retryAttempts: 3
});

const goldRushClient = new GoldRushClient({
  apiKey: "your-api-key",
  baseUrl: "https://api.goldrush.com",
  rateLimit: 100 // requests per minute
});
```

### Environment Variables

Create a `.env` file for sensitive configuration:

```bash
# API Keys
GOLDRUSH_API_KEY=your-goldrush-api-key
DEXGURU_API_KEY=your-dexguru-api-key

# RPC URLs
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your-key
BSC_RPC_URL=https://bsc-dataseed.binance.org/
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

## Advanced Usage Examples

### Multi-Chain Token Analysis

```typescript
import { DexscreenerClient, GeckoTerminalClient } from "the-block-indexer-sdk";

async function analyzeTokenAcrossChains(tokenAddress: string) {
  const dexClient = new DexscreenerClient();
  const geckoClient = new GeckoTerminalClient();
  
  const chains = ["solana", "ethereum", "bsc"];
  const analysis = {};
  
  for (const chain of chains) {
    try {
      const [pairs, tokenData] = await Promise.all([
        dexClient.getTokenPairs(chain, tokenAddress),
        geckoClient.getTokenData(chain, tokenAddress)
      ]);
      
      analysis[chain] = {
        pairs: pairs.length,
        price: tokenData?.price,
        volume24h: tokenData?.volume24h,
        marketCap: tokenData?.marketCap
      };
    } catch (error) {
      analysis[chain] = { error: error.message };
    }
  }
  
  return analysis;
}

// Usage
const results = await analyzeTokenAcrossChains("USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB");
console.log(results);
```

### Batch Token Processing

```typescript
import { Erc20IndexerClient } from "the-block-indexer-sdk";

async function processTokenBatch(tokenAddresses: string[]) {
  const erc20Client = new Erc20IndexerClient();
  const results = [];
  
  // Process tokens in batches to avoid rate limits
  const batchSize = 10;
  for (let i = 0; i < tokenAddresses.length; i += batchSize) {
    const batch = tokenAddresses.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (address) => {
      try {
        const info = await erc20Client.getTokenInfo(1, address);
        return { address, success: true, data: info };
      } catch (error) {
        return { address, success: false, error: error.message };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Rate limiting delay
    if (i + batchSize < tokenAddresses.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}
```

### Real-time Price Monitoring

```typescript
import { GeckoTerminalClient, DexscreenerClient } from "the-block-indexer-sdk";

class PriceMonitor {
  private geckoClient = new GeckoTerminalClient();
  private dexClient = new DexscreenerClient();
  private subscribers = new Set();
  
  constructor(private tokenAddress: string, private chainId: string) {}
  
  subscribe(callback: (data: any) => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }
  
  async start() {
    setInterval(async () => {
      try {
        const [geckoData, dexData] = await Promise.all([
          this.geckoClient.getTokenData(this.chainId, this.tokenAddress),
          this.dexClient.getTokenPairs(this.chainId, this.tokenAddress)
        ]);
        
        const priceData = {
          timestamp: Date.now(),
          gecko: geckoData,
          dex: dexData[0] || null
        };
        
        this.subscribers.forEach(callback => callback(priceData));
      } catch (error) {
        console.error("Price monitoring error:", error);
      }
    }, 30000); // Update every 30 seconds
  }
}

// Usage
const monitor = new PriceMonitor("USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB", "solana");
monitor.subscribe((data) => {
  console.log(`Price update: $${data.gecko?.price || 'N/A'}`);
});
monitor.start();
```

## Error Handling

```typescript
import { DexscreenerClient } from "the-block-indexer-sdk";

const dexClient = new DexscreenerClient();

async function safeGetPairs(chainId: string, tokenAddress: string) {
  try {
    const pairs = await dexClient.getTokenPairs(chainId, tokenAddress);
    return { success: true, data: pairs };
  } catch (error) {
    if (error.code === 'RATE_LIMITED') {
      console.log("Rate limited, retrying in 60 seconds...");
      await new Promise(resolve => setTimeout(resolve, 60000));
      return safeGetPairs(chainId, tokenAddress);
    } else if (error.code === 'TOKEN_NOT_FOUND') {
      console.log("Token not found on this chain");
      return { success: false, error: "Token not found" };
    } else {
      console.error("Unexpected error:", error);
      return { success: false, error: error.message };
    }
  }
}
```

## Rate Limiting and Best Practices

1. **Respect Rate Limits**: Always implement proper rate limiting
2. **Use Caching**: Cache frequently accessed data
3. **Handle Errors Gracefully**: Implement comprehensive error handling
4. **Batch Requests**: Group multiple requests when possible
5. **Monitor Usage**: Keep track of your API usage

```typescript
// Example rate-limited batch processor
class BatchProcessor {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private rateLimitDelay = 100; // milliseconds between requests
  
  async add<T>(processor: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await processor();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      if (!this.processing) {
        this.processQueue();
      }
    });
  }
  
  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const task = this.queue.shift()!;
      try {
        await task();
      } catch (error) {
        console.error("Task failed:", error);
      }
      
      // Rate limiting delay
      await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay));
    }
    
    this.processing = false;
  }
}
```

## Integration Examples

### Next.js Integration

```typescript
// pages/api/token/[address].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { DexscreenerClient, GeckoTerminalClient } from 'the-block-indexer-sdk';

const dexClient = new DexscreenerClient();
const geckoClient = new GeckoTerminalClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address, chain = 'solana' } = req.query;
  
  try {
    const [pairs, tokenData] = await Promise.all([
      dexClient.getTokenPairs(chain, address as string),
      geckoClient.getTokenData(chain, address as string)
    ]);
    
    res.status(200).json({
      pairs,
      tokenData,
      timestamp: Date.now()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Express.js Middleware

```typescript
// middleware/blockchain.ts
import { Request, Response, NextFunction } from 'express';
import { AddressIndexerClient } from 'the-block-indexer-sdk';

const addressClient = new AddressIndexerClient();

export function validateAddress(req: Request, res: Response, next: NextFunction) {
  const { address } = req.params;
  
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return res.status(400).json({ error: 'Invalid Ethereum address format' });
  }
  
  next();
}

export async function getAddressInfo(req: Request, res: Response) {
  const { address } = req.params;
  const { chain = '1' } = req.query;
  
  try {
    const data = await addressClient.getAddressData(chain as string, address);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

## Troubleshooting

### Common Issues

1. **API Rate Limits**: Implement proper rate limiting and backoff strategies
2. **Network Connectivity**: Ensure proper RPC endpoint configuration
3. **Type Errors**: Use proper TypeScript types and interfaces
4. **Memory Usage**: Implement proper caching and data cleanup

### Debug Mode

```typescript
import { setDebugMode } from 'the-block-indexer-sdk';

// Enable debug logging
setDebugMode(true);

// Now all client operations will log detailed information
const pairs = await dexClient.getTokenPairs('solana', tokenAddress);
```
