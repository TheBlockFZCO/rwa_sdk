import { Address } from "viem";
import { buildOnChain, type NetworkInput, DexscreenerClient, StellarExpertClient, XrpscanClient, AptosIndexerClient, DexguruClient, GeckoTerminalClient, buildGeckoTerminalTokenSummary, MoralisClient } from "./src";
import { buildDexscreenerTokenSummary } from "./src/clients/DexscreenerClient";
import { base, mainnet } from "viem/chains";
import { writeFileSync } from "fs";
import { resolve } from "path";

// const ZERO: Address = "0x0000000000000000000000000000000000000000";
// const WETH: Address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
// const USDC: Address = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

// const TOKEN: Address = "0x808507121B80c02388fAd14726482e061B8da827";

// const inputs: NetworkInput[] = [
//   {
//     chainId: 1,
//     chainName: "eth-mainnet",
//     rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/GwL4E_7jzhO6_eH_aV3tkKlELSh7UQEO",
//     factory: ["0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"],
//     base: ["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"],
//     walletAddress: ZERO,
//     quoteCurrency: "USD",
//     chain: mainnet,
//   },
// ];

// const nets = buildOnChain(inputs);
// const { erc20Client, uniClient, addressClient, goldrushClient } = nets[0];

// console.log(await erc20Client.get(TOKEN, ZERO, ZERO));
// console.log(await erc20Client.get(USDC, ZERO, ZERO));
// console.log(await uniClient.findPairsForTokenInFactory(nets[0].config.factory[0], TOKEN , 0n, 464n));
// console.log(await addressClient.get(TOKEN));

// console.log(
//   JSON.stringify(
//     await goldrushClient.getHistoricalTokenPrices({
//       chainName: nets[0].config.chainName,
//       quoteCurrency: "USD",
//       contractAddresses: TOKEN,
//       from: "2024-10-27",
//       to: "2025-10-28",
//     }),
//     null,
//     2
//   )
// );


// Dexscreener sample: fetch pairs for a token on Solana (USD1)
// const dexscreener = new DexscreenerClient();
// const tokenAddress = "USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB";
// const dsData = await dexscreener.getPairsByToken(tokenAddress);
// const summary = buildDexscreenerTokenSummary(tokenAddress, dsData);

// // Extra Dexscreener endpoints per docs: https://docs.dexscreener.com/api/reference
// const pools = await dexscreener.getTokenPools("solana", tokenAddress);
// const tokensBatch = await dexscreener.getTokensByAddresses("solana", [tokenAddress]);
// const search = await dexscreener.searchPairs("USD1/USDC");
// const latestProfiles = await dexscreener.getLatestTokenProfiles();
// const latestBoosts = await dexscreener.getLatestTokenBoosts();

// // Save raw pairs and computed summary to dexscreener.json at project root
// writeFileSync(
//   resolve(process.cwd(), "dexscreener.json"),
//   JSON.stringify({ raw: dsData, summary, pools, tokensBatch, search, latestProfiles, latestBoosts }, null, 2),
//   "utf8"
// );

// --- DexGuru sample (optional, requires DEXGURU_API_KEY) ---
// const DEXGURU_API_KEY = process.env.DEXGURU_API_KEY;
// if (DEXGURU_API_KEY) {
//   const DEXGURU_BASE_URL = process.env.DEXGURU_BASE_URL ?? "https://api.dev.dex.guru"; // override to https://api.dex.guru in prod
//   console.log(`[DexGuru] Using base URL: ${DEXGURU_BASE_URL}`);
//   console.log(`[DexGuru] API key present: ${DEXGURU_API_KEY ? "yes" : "no"} (length: ${DEXGURU_API_KEY.length})`);
  
//   try {
//     const guru = new DexguruClient({ apiKey: DEXGURU_API_KEY, baseUrl: DEXGURU_BASE_URL, timeoutMs: 20000 });
//     const networkId = 1;
//     const tokenLower = TOKEN.toLowerCase();
//     const now = Math.floor(Date.now() / 1000);

//     const out: any = { networkId, tokenAddress: tokenLower };
//     try { out.inventory = await guru.getTokenInventory(networkId, tokenLower); } catch (e) { out.inventory = { error: String(e) }; }
//     try { out.market = await guru.getTokenMarket(networkId, tokenLower); } catch (e) { out.market = { error: String(e) }; }
//     try { out.marketHistory = await guru.getTokenMarketHistory(networkId, tokenLower, { from: now - 86400, to: now, interval: "1h" }); } catch (e) { out.marketHistory = { error: String(e) }; }
//     try { out.swaps = await guru.getTokenSwaps(networkId, tokenLower, { begin_timestamp: now - 86400, sort_by: "timestamp", order: "desc", limit: 100, offset: 0 }); } catch (e) { out.swaps = { error: String(e) }; }

//     writeFileSync(
//       resolve(process.cwd(), "dexguru.json"),
//       JSON.stringify(out, null, 2),
//       "utf8"
//     );
//     console.log(`[DexGuru] Data saved to dexguru.json`);
//   } catch (e) {
//     console.error(`[DexGuru] Failed to initialize client:`, e);
//   }
// } else {
//   console.log("[DexGuru] Skipping - DEXGURU_API_KEY not set");
// }

// // --- GeckoTerminal sample: fetch token data (e.g., Solana token) ---
// const geckoterminal = new GeckoTerminalClient();
// const geckoNetwork = "solana"; // or "ethereum", "base", etc.
// const geckoTokenAddress = "USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB"; // Solana token example
// try {
//   const gtData = await geckoterminal.getToken(geckoNetwork, geckoTokenAddress, true, false);
//   const gtSummary = buildGeckoTerminalTokenSummary(geckoNetwork, geckoTokenAddress, gtData);
  
//   // Also fetch additional endpoints
//   const gtTrending = await geckoterminal.getTrendingPools(geckoNetwork).catch((e) => ({ error: String(e) }));
//   const gtNetworks = await geckoterminal.getNetworks().catch((e) => ({ error: String(e) }));
  
//   writeFileSync(
//     resolve(process.cwd(), "geckoterminal.json"),
//     JSON.stringify({ raw: gtData, summary: gtSummary, trending: gtTrending, networks: gtNetworks }, null, 2),
//     "utf8"
//   );
//   console.log(`[GeckoTerminal] Data saved to geckoterminal.json`);
// } catch (e) {
//   console.error(`[GeckoTerminal] Error:`, e);
// }

// Stellar Expert sample: fetch asset details for BENJI
// const stellar = new StellarExpertClient();
// const benji = await stellar.getAsset("BENJI-GBHNGLLIE3KWGKCHIKMHJ5HVZHYIK7WTBE4QF5PLAKL4CJGSEU7HZIW5");
// console.log(
//   JSON.stringify(
//     benji,
//     null,
//     2
//   )
// );

// Aptos Indexer (GraphQL) sample: fetch fungible asset metadata
// const aptIndexer = new AptosIndexerClient();
// const aptosMeta = await aptIndexer.getFungibleAssetMetadata("0x7647a37bb1ee1f42953ca4a00f1cf347254d38a2aa31d2e37176bbb94c14cf75");
// console.log(JSON.stringify(aptosMeta, null, 2));

// XRPSCan sample: fetch RLUSD token details
// const xrpscan = new XrpscanClient();
// const xrpToken = await xrpscan.getToken("RLUSD.rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De");
// console.log(JSON.stringify(xrpToken, null, 2));

// console.log(JSON.stringify(await goldrushClient.getTokenHoldersV2ForTokenAddress({
// 	chainName: nets[0].config.chainName,
// 	tokenAddress: TOKEN,
// 	pageSize: 100,
// 	pageNumber: 0,
// 	noSnapshot: false,
// }),null, 2));

// Moralis sample: fetch ERC20 token price and metadata
const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
if (MORALIS_API_KEY) {
  try {
    const moralis = new MoralisClient({ apiKey: MORALIS_API_KEY });
    const kylinTokenAddress = "0x514910771AF9Ca656af840dff83E8264EcF986CA"; // KYL token
    const tokenData = await moralis.getERC20TokenPrice(kylinTokenAddress, "eth");
    const validatedData = moralis.validateTokenData(tokenData);
    
    console.log("[Moralis] KYL Token Data:");
    console.log(`Name: ${validatedData.tokenName} (${validatedData.tokenSymbol})`);
    console.log(`Price: $${validatedData.usdPrice}`);
    console.log(`24h Change: ${validatedData["24hrPercentChange"]}%`);
    console.log(`Exchange: ${validatedData.exchangeName}`);
    console.log(`Verified: ${validatedData.verifiedContract}`);
    console.log(`Security Score: ${validatedData.securityScore}`);
  } catch (e) {
    console.error("[Moralis] Error:", e);
  }
} else {
  console.log("[Moralis] Skipping - MORALIS_API_KEY not set");
}