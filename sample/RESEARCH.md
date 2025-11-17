# NEW RESEARCH DATASETS FOR RWA ASSETS

## RWA Asset Data from Covalent & GoldRush SDK

Both **Covalent** and **GoldRush SDK** can be used to gather on-chain and off-chain data related to **Real World Assets (RWA)**, including:

- **Token Metadata** — name, symbol, decimals, and contract addresses of tokenized RWA assets.  
- **Ownership Data** — current holders, historical transfers, and wallet distributions.  
- **Transaction History** — minting, redemption, and settlement events tied to RWA tokens.  
- **Valuation Metrics** — token prices, liquidity pool data, and market cap.  
- **Protocol Analytics** — RWA-related smart contract interactions and performance indicators.  
- **Cross-chain Insights** — unified asset tracking across multiple chains supported by Covalent.  

These datasets enable monitoring, verification, and transparency of tokenized real-world assets on-chain.

## RWA Asset Data from Alchemy SDK

The Alchemy platform provides APIs and SDKs that enable gathering the following **Real-World Asset (RWA)**-related on-chain and off-chain data:

- **Token Metadata** — contract addresses, symbols, decimals, token names via Token API.  
- **Token Balances / Ownership** — current balances held by wallet addresses, token holdings per address.
- **Transfers & Transaction Histories** — historical asset transfers, token movements and on-chain event logs.
- **Price & Market Data** — real-time and historical pricing of tokens, useful for valuation of tokenised RWAs.
- **Analytics / Portfolio Views** — aggregated views of a wallet or address’s entire holdings (tokens + NFTs) across chains.
- **Simulation & Real-Time Events** — simulate transactions before execution; subscribe to webhooks for events like balance changes.
- **Multi-chain & Indexing Infrastructure** — access pre-indexed data spanning many chains (so less own infra needed).

These capabilities support monitoring, verification, transparency, and analytics for tokenised real-world assets using Alchemy’s infrastructure.

## RWA Asset Data from Moralis SDK

The Moralis platform provides APIs and SDKs that enable gathering the following **Real World Asset (RWA)**-related on-chain and off-chain data:

- **Token Metadata** — contract addresses, symbols, decimals, token names, logos via Token/NFT APIs.
- **Ownership Data** — balances of wallets (native tokens, ERC-20, NFTs), historical token holdings per address.
- **Transaction History** — wallet-level full history endpoints (wallet activity, transfers, swaps, burns, mints) via the Wallet History API.
- **Valuation & Market Data** — token price data, portfolio net-worth across chains (USD value of holdings) via Price/Wallet APIs.
- **Protocol/Contract Analytics** — on-chain event logs, NFT transfers, internal operations of contracts (for RWA smart contract interactions).
- **Cross-chain & Multi-asset Insights** — support for EVM + non-EVM chains (e.g., Solana) with enriched data for tokens/NFTs across many chains.

These capabilities enable monitoring, transparency, and analytics of tokenised real-world assets by leveraging Moralis’ infrastructure of indexed data and unified endpoints.

## RWA Asset Data from QuickNode Crypto Index / Market Data API Add-On

The QuickNode Marketplace add-on (via CoinAPI) provides APIs that enable gathering the following **Real-World Asset (RWA)-related on-chain and off-chain data** through market-data endpoints:

- **Asset Metadata & Listings** — information about assets (cryptocurrencies and fiat) including symbol, name, identifiers and supported trading pairs.
- **Current Market Quotes / Exchange Rates** — live price quotes, conversion rates between assets (crypto ↔ crypto, crypto ↔ fiat).
- **Historical Market Data** — historical quotes, exchange rates, OHLCV (open-high-low-close-volume) time series data for assets.
- **Order Book & Trade Data** — snapshots of current order book depth, detailed trade-by-trade historical data from multiple exchanges.
- **Index / Aggregated Metrics** — pre-calculated indices and aggregated metrics such as VWAP (volume-weighted average price) across markets (for crypto markets) which can be leveraged in RWA token monitoring and benchmarking.
- **Multi-venue / Exchange Coverage & Normalization** — unified access across 350+ centralized and decentralized exchanges with normalized data fields and timestamps, reducing integration overhead for handling RWA token market performance.

These capabilities support use-cases like tracking tokenised real-world assets, benchmarking valuation, building portfolio dashboards, analytics platforms, compliance/verification tools, and other infrastructure for RWA monitoring via market data layers.

## RWA Asset Data from Etherscan APIs

The Etherscan APIs provide on-chain data access for EVM-compatible chains (50+ supported) and support these kinds of RWA-related datasets:

- **Token Metadata & Supply** — e.g., total supply of a given ERC-20 token, contract address, token name/symbol.
- **Account Balances / Ownership** — the native ETH (or chain coin) balance of addresses, multi-address balance retrieval.
- **Token Transfers / Transaction History** — lists of ERC-20 token transfer events for an address, normal transactions, internal transactions.
- **Contract Data / Smart-Contract Events** — smart contract ABI retrieval, creation transaction, verified source code, logs/events for custom tokens or RWA contracts.
- **Block & Network Statistics** — block reward data, chain statistics such as supply, nodes, historical metrics that can underpin broader RWA monitoring.
- **Multi-chain EVM coverage** — With the V2 API, a single API key covers many EVM chains, making it usable for tokenised real-world assets across chains.

These capabilities enable tracking, auditing and analytics of tokenised real-world assets (RWAs) that are issued on the blockchain, including ownership changes, contract behaviour, token-supply flow and interactions.

## RWA Asset Data from The Graph Studio

The Graph Studio allows you to build, deploy and query subgraphs for “RWA”-tokenized asset ecosystems. Key capabilities include:

- **Indexed On-Chain Data via Subgraphs** — you can define data schemas to capture token issuance, redemption, transfer and settlement events for RWA tokens.  
- **Token Metadata & Contract Events** — subgraphs can index metadata (token name, symbol, decimals), contract creation, and custom events for tokenized assets.  
- **Ownership & Historical Transfers** — by indexing `Transfer` or custom events, you can retrieve complete wallet-level ownership histories and movement of RWA tokens on-chain.  
- **Custom Analytics & Aggregations** — since subgraphs expose GraphQL endpoints, you can query aggregated statistics like active holders, volume over time, asset-flow dynamics.  
- **API Key-Secured Endpoints** — queries to deployed subgraphs require an API key from Studio for authentication and usage tracking.
- **Multi-chain Support & Composability** — The Graph supports indexing data across multiple EVM and non-EVM chains (depending on network/subgraph setup), enabling cross-chain RWA tracking.  
- **Integration Friendly** — GraphQL endpoints allow for embedding in dashboards, analytics tools, WebSocket updates (when combined with streaming layers) etc.

## RWA Asset Data from Bitquery Blockchain Data API

Bitquery’s GraphQL API lets you gather rich on-chain data for tokenised Real-World Assets (RWAs) and related transfers. Key datasets include:

- **Token Metadata & Supply** — contract addresses, symbols, decimals, token names, issuance/redemption events.  
- **Transfers & Ownership History** — detailed token transfer records (ERC-20, ERC-721, etc), including amounts, sender/receiver, timestamps, USD-value fields.
- **Internal Transactions / Contract Calls** — nested smart-contract calls and value flows within a transaction (critical for RWA token redemptions or protocol logic).
- **Balances & Wallet Portfolios** — historic and current balances of wallets for tokens and assets, enabling holder snapshots and token-flow tracing.
- **Cross-Chain / Multi-Asset Support** — support for 40+ blockchains, allowing asset-tracking beyond a single chain (useful if RWA assets exist on multiple chains).
- **Real-Time & Historical Data** — choose between archived (‘combined’) data and real-time streams, enabling both retrospective audits and live monitoring of RWA token activity.

## RWA Asset Data from CoinGecko API

The CoinGecko API offers REST (and WebSocket for higher tiers) endpoints to retrieve market-data and metadata that can support monitoring of tokenised Real-World Assets (RWAs). Key datasets include:

- **Asset Metadata & Listings** — information about assets (symbols, names, identifiers) listed across many exchanges and chains.
- **Current Market Quotes / Valuation** — real-time price data, conversion rates (crypto ↔ fiat), which can help value tokenised RWAs.
- **Historical Market Data & OHLCV** — historical price/volume/time series which allow tracking of valuation trends of RWA-tokens.  
- **Exchange & DEX Data** — aggregated listings across many centralized and decentralized exchanges, useful for liquidity and market-access visibility.
- **Multi-chain Coverage** — API supports data across 250+ blockchain networks, 1,700+ DEXes and 15M+ tokens, providing broad coverage for RWA tokens on different chains.
- **Streaming / WebSocket (Premium)** — for real-time price and trade updates, enabling live monitoring of RWA token markets.

## RWA Asset Data from RWA.xyz Platform

The RWA.xyz platform provides a data-centric view of tokenised Real-World Assets (RWAs) that empowers issuers, investors, researchers and service providers. Key data capabilities include:

- **Asset-level Metadata & Structures** — insights into token structures, underlying reserves, legal/issuer jurisdiction, custodians, associated entities.  
- **On-chain Transaction & Ownership Data** — token mints/burns, transfers, token holder counts, network metrics (chains, platforms) for RWA tokens.
- **Off-chain Backing & Asset Reporting** — reserve values, CUSIPs, legal frameworks, issuer filings and service provider details supporting transparency of underlying real-world assets.
- **Aggregated Market Metrics** — total on-chain issuance volume across assets/networks, number of issuers, networks covered, “Total RWA value” dashboard view.
- **API & Data-Download Access** — enterprise-ready APIs and data downloads enable integration of RWA.xyz datasets into research platforms, analytics dashboards or institutional workflows.
- **Multi-chain & Multi-asset support** — The platform covers issuance across 12+ blockchain networks and multiple asset classes (treasuries, private credit, commodities, etc.).

## RWA Asset Data from CoinMarketCap (CMC) API

The CoinMarketCap API provides comprehensive cryptocurrency- and market-data endpoints which can contribute to RWA (Real-World Asset)-tokenised asset monitoring. Key data capabilities include:

- **Asset Metadata & Listings** — information about assets (name, symbol, website, logo, token status) via metadata endpoints.
- **Current Market Quotes / Valuation** — real-time price quotes, market capitalisation, volume (for tokens including those representing RWAs) in fiat or crypto conversions.
- **Historical Market Data & Time-Series** — historical OHLCV (Open, High, Low, Close, Volume) data useful for tracking performance/trends of RWA-tokenised assets.
- **Global Metrics & Market Depth** — aggregate metrics like total market cap, dominance (e.g., BTC dominance) which can support broader RWA market context and benchmarking.  
- **Programmable Access & Integration** — RESTful JSON endpoints, well-documented, with free and paid tiers, enabling integration into dashboards or analytics platforms for RWA-token tracking.

These capabilities make CMC’s API useful for building tools that monitor token-ised real-world assets: tracking market value, liquidity, historic trends, and metadata of underlying tokens.

## RWA Asset Data via Chainlink Automated Compliance Engine (ACE)

The Chainlink Automated Compliance Engine (ACE) facilitates the tokenization of Real‑World Assets (RWAs) by integrating compliance and identity frameworks directly into smart contracts. Key data capabilities include:

- **Cross-Chain Identity (CCID) Framework**: Enables the representation of investor identities, attestations, and credentials across multiple blockchains. It stores cryptographic proofs of verified credentials, such as Know Your Customer (KYC), Anti‑Money Laundering (AML), and investor sophistication status, while keeping personal information offchain.

- **CCT Compliance Extension**: Allows smart contracts to enforce compliance policies, such as investment limits and jurisdictional restrictions, based on the investor's identity and credentials. This ensures that only eligible investors can participate in RWA token offerings.

- **Policy Manager**: Automates the enforcement of compliance policies by integrating with offchain systems and data sources. It ensures that all transactions involving RWA tokens adhere to regulatory requirements.

- **Monitoring & Reporting Manager**: Provides real-time monitoring and reporting of compliance status, enabling issuers and regulators to track and audit RWA token transactions.

These components collectively enable the secure and compliant tokenization and management of Real‑World Assets on blockchain platforms.
