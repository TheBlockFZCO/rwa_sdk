// import { Address } from "viem";
// import { buildOnChain, type NetworkInput, DexscreenerClient, StellarExpertClient, XrpscanClient, AptosIndexerClient, DexguruClient, GeckoTerminalClient, buildGeckoTerminalTokenSummary, MoralisClient } from "./src";
// import { buildDexscreenerTokenSummary } from "./src/clients/DexscreenerClient";
// import { arbitrum, avalanche, base, bsc, mainnet, optimism, polygon, sonic } from "viem/chains";
// import { writeFileSync } from "fs";
// import { resolve } from "path";

// const ZERO: Address = "0x0000000000000000000000000000000000000000";
// // const WETH: Address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
// // const USDC: Address = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

// const inputs: NetworkInput[] = [
//   {
//     chainId: 1,
//     chainName: "eth-mainnet",
//     // geckoTerminalId: "eth",
//     rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/GwL4E_7jzhO6_eH_aV3tkKlELSh7UQEO",
//     factory: [ZERO],
//     base: [ZERO],
//     walletAddress: ZERO,
//     quoteCurrency: "USD",
//     chain: mainnet,
//   },
//   {
//     chainId: 10,
//     chainName: "optimism-mainnet",
//     // geckoTerminalId: "optimism",
//     rpcUrl: "https://opt-mainnet.g.alchemy.com/v2/GwL4E_7jzhO6_eH_aV3tkKlELSh7UQEO",
//     factory: [ZERO],
//     base: [ZERO],
//     walletAddress: ZERO,
//     quoteCurrency: "USD",
//     chain: optimism,
//   },
//   {
//     chainId: 56,
//     chainName: "bsc-mainnet",
//     // geckoTerminalId: "bsc",
//     rpcUrl: "https://bnb-mainnet.g.alchemy.com/v2/GwL4E_7jzhO6_eH_aV3tkKlELSh7UQEO",
//     factory: [ZERO],
//     base: [ZERO],
//     walletAddress: ZERO,
//     quoteCurrency: "USD",
//     chain: bsc,
//   },
//   {
//     chainId: 137,
//     chainName: "polygon-mainnet",
//     // geckoTerminalId: "polygon_pos",
//     rpcUrl: "https://bnb-mainnet.g.alchemy.com/v2/GwL4E_7jzhO6_eH_aV3tkKlELSh7UQEO",
//     factory: [ZERO],
//     base: [ZERO],
//     walletAddress: ZERO,
//     quoteCurrency: "USD",
//     chain: polygon,
//   },
//   {
//     chainId: 146,
//     chainName: "sonic-mainnet",
//     // geckoTerminalId: "sonic",
//     rpcUrl: "https://sonic-mainnet.g.alchemy.com/v2/GwL4E_7jzhO6_eH_aV3tkKlELSh7UQEO",
//     factory: [ZERO],
//     base: [ZERO],
//     walletAddress: ZERO,
//     quoteCurrency: "USD",
//     chain: sonic,
//   },
//   {
//     chainId: 8453,
//     chainName: "base-mainnet",
//     // geckoTerminalId: "base",
//     rpcUrl: "https://base-mainnet.g.alchemy.com/v2/GwL4E_7jzhO6_eH_aV3tkKlELSh7UQEO",
//     factory: [ZERO],
//     base: [ZERO],
//     walletAddress: ZERO,
//     quoteCurrency: "USD",
//     chain: base,
//   },
//   {
//     chainId: 42161,
//     chainName: "arbitrum-mainnet",
//     // geckoTerminalId: "arbitrum",
//     rpcUrl: "https://arb-mainnet.g.alchemy.com/v2/GwL4E_7jzhO6_eH_aV3tkKlELSh7UQEO",
//     factory: [ZERO],
//     base: [ZERO],
//     walletAddress: ZERO,
//     quoteCurrency: "USD",
//     chain: arbitrum,
//   },
//   {
//     chainId: 43114,
//     chainName: "avalanche-mainnet",
//     // geckoTerminalId: "avax",
//     rpcUrl: "https://avax-mainnet.g.alchemy.com/v2/GwL4E_7jzhO6_eH_aV3tkKlELSh7UQEO",
//     factory: [ZERO],
//     base: [ZERO],
//     walletAddress: ZERO,
//     quoteCurrency: "USD",
//     chain: avalanche,
//   },
// ];

// const nets = buildOnChain(inputs);
// const { erc20Client, uniClient, addressClient, goldrushClient } = nets[2];


// // console.log(await erc20Client.get(USDC, ZERO, ZERO));
// // console.log(await uniClient.findPairsForTokenInFactory(nets[0].config.factory[0], TOKEN , 0n, 464n));
// // console.log(await addressClient.get(TOKEN));

// const TOKEN: Address = "0x2d5bdc96d9c8aabbdb38c9a27398513e7e5ef84f";
// console.log(await erc20Client.get(TOKEN, ZERO, ZERO));

// console.log(
//   JSON.stringify(
//     await goldrushClient.getHistoricalTokenPrices({
//       chainName: nets[2].config.chainName,
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

// Extra Dexscreener endpoints per docs: https://docs.dexscreener.com/api/reference
// const pools = await dexscreener.getTokenPools("solana", tokenAddress);
// const tokensBatch = await dexscreener.getTokensByAddresses("solana", [tokenAddress]);
// const search = await dexscreener.searchPairs("USD1/USDC");
// const latestProfiles = await dexscreener.getLatestTokenProfiles();
// const latestBoosts = await dexscreener.getLatestTokenBoosts();

// Save raw pairs and computed summary to dexscreener.json at project root
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

// const GECKO_SAMPLE_NETWORK = "eth";
// const GECKO_SAMPLE_TOKEN = "0xe50365f5d679cb98a1dd62d6f6e58e59321bcddf";
// const GECKO_SAMPLE_OUTPUT = resolve(process.cwd(), "geckoterminal.json");

// async function runLatokenGeckoSample() {
//   const geckoterminal = new GeckoTerminalClient();
//   try {
//     const gtData = await geckoterminal.getToken(GECKO_SAMPLE_NETWORK, GECKO_SAMPLE_TOKEN, true, false);
//     const gtSummary = buildGeckoTerminalTokenSummary(GECKO_SAMPLE_NETWORK, GECKO_SAMPLE_TOKEN, gtData);

//     writeFileSync(
//       GECKO_SAMPLE_OUTPUT,
//       JSON.stringify(
//         {
//           request: { network: GECKO_SAMPLE_NETWORK, tokenAddress: GECKO_SAMPLE_TOKEN },
//           raw: gtData,
//           summary: gtSummary,
//         },
//         null,
//         2
//       ),
//       "utf8"
//     );

//     console.log(`[GeckoTerminal] LAToken summary saved to ${GECKO_SAMPLE_OUTPUT}`);
//     console.dir(gtSummary, { depth: null });
//   } catch (e) {
//     console.error(`[GeckoTerminal] Error while fetching LAToken sample:`, e);
//   }
// }

// void runLatokenGeckoSample();

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
// const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
// if (MORALIS_API_KEY) {
//   try {
//     const moralis = new MoralisClient({ apiKey: MORALIS_API_KEY });
//     const kylinTokenAddress = "0x514910771AF9Ca656af840dff83E8264EcF986CA"; // KYL token
//     const tokenData = await moralis.getERC20TokenPrice(kylinTokenAddress, "eth");
//     const validatedData = moralis.validateTokenData(tokenData);
    
//     console.log("[Moralis] KYL Token Data:");
//     console.log(`Name: ${validatedData.tokenName} (${validatedData.tokenSymbol})`);
//     console.log(`Price: $${validatedData.usdPrice}`);
//     console.log(`24h Change: ${validatedData["24hrPercentChange"]}%`);
//     console.log(`Exchange: ${validatedData.exchangeName}`);
//     console.log(`Verified: ${validatedData.verifiedContract}`);
//     console.log(`Security Score: ${validatedData.securityScore}`);
//   } catch (e) {
//     console.error("[Moralis] Error:", e);
//   }
// } else {
//   console.log("[Moralis] Skipping - MORALIS_API_KEY not set");
// }

import { DefiLlamaClient } from "./src";
import { writeFileSync } from "fs";
import { resolve } from "path";

const LLAMA_PROTOCOLS_OUTPUT = resolve(process.cwd(), "defillama_protocols.json");
const STABLECOINS_OUTPUT = resolve(process.cwd(), "stablecoins.json");

async function runDefiLlamaProtocolsSample() {
  const llama = new DefiLlamaClient({ timeoutMs: 20_000, retries: 2 });
  try {
    const protocols = await llama.getProtocols();
    writeFileSync(
      LLAMA_PROTOCOLS_OUTPUT,
      JSON.stringify(
        {
          request: { path: "/protocols" },
          count: protocols.length,
          // keep a small preview for easy inspection, and the full payload for offline analysis
          preview: protocols.slice(0, 10),
          raw: protocols,
        },
        null,
        2,
      ),
      "utf8",
    );

    console.log(`[DefiLlama] Protocols saved to ${LLAMA_PROTOCOLS_OUTPUT} (count: ${protocols.length})`);
    console.dir(protocols[0], { depth: null });

		const stablecoins = await llama.getStablecoins();
		writeFileSync(
			STABLECOINS_OUTPUT,
			JSON.stringify(
				{
					request: { path: "https://stablecoins.llama.fi/stablecoins" },
					count: Array.isArray((stablecoins as any).peggedAssets) ? (stablecoins as any).peggedAssets.length : undefined,
					preview: Array.isArray((stablecoins as any).peggedAssets) ? (stablecoins as any).peggedAssets.slice(0, 10) : undefined,
					raw: stablecoins,
				},
				null,
				2,
			),
			"utf8",
		);
		console.log(`[Stablecoins] Data saved to ${STABLECOINS_OUTPUT}`);
  } catch (e) {
    console.error(`[DefiLlama] Error while fetching /protocols:`, e);
  }
}

void runDefiLlamaProtocolsSample();
