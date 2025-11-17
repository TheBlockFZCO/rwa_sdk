import { writeFileSync } from "node:fs";
import { join } from "node:path";
// Minimal sample: call specific token endpoints directly (no iteration over schema)

const API_BASE = "https://api.dev.dex.guru"; // switch to https://api.dex.guru if needed
const REQUEST_TIMEOUT_MS = 8000;
const BEGIN_TIMESTAMP = 1588723228; // earliest mainnet Uniswap era; adjust as needed
const SORT_BY = "timestamp";
const ORDER = "desc";

const NETWORK_ID: number = 1; // changeable
const TOKEN_ADDRESS: string = "0x2d1f7226bd1f780af6b9a49dcc0ae00e8df4bdee"; // changeable
const DEXGURU_API_KEY: string = "NwzqTHF7BJZ94L4L3CF0nooQh6Gf19RTWYFK6VBo_xQ"; // changeable

function headers(): HeadersInit {
  return { "api-key": DEXGURU_API_KEY, Accept: "application/json" };
}

function withKey(url: string): string {
  const u = new URL(url);
  if (!u.searchParams.has("api-key")) u.searchParams.set("api-key", DEXGURU_API_KEY);
  return u.toString();
}

async function getJson(url: string): Promise<any> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(withKey(url), { headers: headers(), signal: ctrl.signal });
    const text = await res.text();
    if (!res.ok) throw new Error(text || `${res.status}`);
    try { return JSON.parse(text); } catch { return text; }
  } finally {
    clearTimeout(t);
  }
}

async function run() {
  const base = API_BASE.replace(/\/$/, "");

  // Correct path base per OpenAPI: /v1/chain/{chain_id}/tokens/{address}
  const tokenBase = `${base}/v1/chain/${NETWORK_ID}/tokens/${TOKEN_ADDRESS}`;
  const endpoints = {
    tokenInventory: `${tokenBase}`,
    tokenLogo: `${tokenBase}/logo`,
    tokenMarket: `${tokenBase}/market`,
    tokenMarketHistory: (() => {
      const u = new URL(`${tokenBase}/market/history`);
      // sample timeframe (24h)
      const now = Math.floor(Date.now() / 1000);
      u.searchParams.set("from", String(now - 86400));
      u.searchParams.set("to", String(now));
      u.searchParams.set("interval", "1h");
      return u.toString();
    })(),
    tokenTransactions: `${tokenBase}/transactions?begin_timestamp=${BEGIN_TIMESTAMP}&sort_by=${SORT_BY}&order=${ORDER}&limit=100&offset=0`,
    tokenSwaps: `${tokenBase}/transactions/swaps?begin_timestamp=${BEGIN_TIMESTAMP}&sort_by=${SORT_BY}&order=${ORDER}&limit=100&offset=0`,
    tokenBurns: `${tokenBase}/transactions/burns?begin_timestamp=${BEGIN_TIMESTAMP}&sort_by=${SORT_BY}&order=${ORDER}&limit=100&offset=0`,
    tokenMints: `${tokenBase}/transactions/mints?begin_timestamp=${BEGIN_TIMESTAMP}&sort_by=${SORT_BY}&order=${ORDER}&limit=100&offset=0`,
    tokenTransfers: `${tokenBase}/transactions/transfers?begin_timestamp=${BEGIN_TIMESTAMP}&sort_by=${SORT_BY}&order=${ORDER}&limit=100&offset=0`,
    udfHistory: (() => {
      const u = new URL(`${base}/v1/tradingview/history`);
      u.searchParams.set("symbol", `${NETWORK_ID}_${TOKEN_ADDRESS}`);
      const now = Math.floor(Date.now() / 1000);
      u.searchParams.set("from", String(now - 86400));
      u.searchParams.set("to", String(now));
      u.searchParams.set("resolution", "60");
      return u.toString();
    })(),
  } as const;

  const out: Record<string, any> = {};
  out["tokenInventory"] = await getJson(endpoints.tokenInventory).catch((e) => ({ error: String(e) }));
  out["tokenLogo"] = await getJson(endpoints.tokenLogo).catch((e) => ({ error: String(e) }));
  out["tokenMarket"] = await getJson(endpoints.tokenMarket).catch((e) => ({ error: String(e) }));
  out["tokenMarketHistory"] = await getJson(endpoints.tokenMarketHistory).catch((e) => ({ error: String(e) }));
  out["tokenTransactions"] = await getJson(endpoints.tokenTransactions).catch((e) => ({ error: String(e) }));
  out["tokenSwaps"] = await getJson(endpoints.tokenSwaps).catch((e) => ({ error: String(e) }));
  out["tokenBurns"] = await getJson(endpoints.tokenBurns).catch((e) => ({ error: String(e) }));
  out["tokenMints"] = await getJson(endpoints.tokenMints).catch((e) => ({ error: String(e) }));
  out["tokenTransfers"] = await getJson(endpoints.tokenTransfers).catch((e) => ({ error: String(e) }));
  out["udfHistory"] = await getJson(endpoints.udfHistory).catch((e) => ({ error: String(e) }));

  const payload = { networkId: NETWORK_ID, tokenAddress: TOKEN_ADDRESS, data: out };
  const outfile = join(process.cwd(), "dexguru.json");
  writeFileSync(outfile, JSON.stringify(payload, null, 2), "utf8");
  console.log(JSON.stringify(payload, null, 2));
}

await run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

export {};