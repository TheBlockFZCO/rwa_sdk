export interface DexscreenerTokenInfo {
	address: string;
	name: string;
	symbol: string;
}

export interface DexscreenerTxnWindowStats {
	buys: number;
	sells: number;
}

export interface DexscreenerTxns {
	m5?: DexscreenerTxnWindowStats;
	h1?: DexscreenerTxnWindowStats;
	h6?: DexscreenerTxnWindowStats;
	h24?: DexscreenerTxnWindowStats;
}

export interface DexscreenerVolume {
	m5?: number;
	h1?: number;
	h6?: number;
	h24?: number;
}

export interface DexscreenerLiquidity {
	usd?: number;
	base?: number;
	quote?: number;
}

export interface DexscreenerPairInfo {
	imageUrl?: string;
	header?: string;
	openGraph?: string;
}

export interface DexscreenerPairItem {
	chainId: string; // e.g., "solana", "ethereum"
	dexId: string; // e.g., "raydium"
	url: string;
	pairAddress: string;
	labels?: string[];
	baseToken: DexscreenerTokenInfo;
	quoteToken: DexscreenerTokenInfo;
	priceNative?: string;
	priceUsd?: string;
	txns?: DexscreenerTxns;
	volume?: DexscreenerVolume;
	priceChange?: Record<string, number>;
	liquidity?: DexscreenerLiquidity;
	fdv?: number;
	marketCap?: number;
	pairCreatedAt?: number; // ms epoch
	info?: DexscreenerPairInfo;
}

export interface DexscreenerPairsResponse {
	schemaVersion: string;
	pairs: DexscreenerPairItem[];
}

export interface DexscreenerTokenSummary {
	tokenAddress: string;
	tokenName?: string;
	tokenSymbol?: string;
	chains: string[];
	numPairs: number;
	liquidityUsdTotal: number;
	volume24hTotal: number;
	transactions24h: { buys: number; sells: number };
	primaryPair?: {
		chainId: string;
		dexId: string;
		pairAddress: string;
		priceUsd?: string;
		liquidityUsd?: number;
		fdv?: number;
		marketCap?: number;
		url: string;
	};
}

export interface DexscreenerClientConfig {
	/** Optionally override base URL, defaults to public Dexscreener API */
	baseUrl?: string;
	/** Request timeout in ms (default: 15_000) */
	timeoutMs?: number;
	/** Number of retries on transient failures (default: 2) */
	retries?: number;
}

export class DexscreenerClient {
	private readonly baseUrl: string;
	private readonly timeoutMs: number;
	private readonly retries: number;

	constructor(config: DexscreenerClientConfig = {}) {
		this.baseUrl = config.baseUrl ?? "https://api.dexscreener.com";
		this.timeoutMs = config.timeoutMs ?? 15_000;
		this.retries = config.retries ?? 2;
	}

	public async getPairsByToken(tokenAddress: string): Promise<DexscreenerPairsResponse> {
		const path = `/latest/dex/tokens/${encodeURIComponent(tokenAddress)}`;
		return await this.request<DexscreenerPairsResponse>(path);
	}

	/** GET /latest/dex/pairs/{chainId}/{pairId} */
	public async getPairByChainAndAddress(chainId: string, pairId: string): Promise<DexscreenerPairsResponse> {
		const path = `/latest/dex/pairs/${encodeURIComponent(chainId)}/${encodeURIComponent(pairId)}`;
		return await this.request<DexscreenerPairsResponse>(path);
	}

	/** GET /latest/dex/search?q= */
	public async searchPairs(query: string): Promise<DexscreenerPairsResponse> {
		const q = encodeURIComponent(query);
		const path = `/latest/dex/search?q=${q}`;
		return await this.request<DexscreenerPairsResponse>(path);
	}

	/** GET /token-pairs/v1/{chainId}/{tokenAddress} */
	public async getTokenPools(chainId: string, tokenAddress: string): Promise<DexscreenerPairItem[]> {
		const path = `/token-pairs/v1/${encodeURIComponent(chainId)}/${encodeURIComponent(tokenAddress)}`;
		return await this.request<DexscreenerPairItem[]>(path);
	}

	/** GET /tokens/v1/{chainId}/{tokenAddresses} (comma-separated addresses, up to 30) */
	public async getTokensByAddresses(chainId: string, tokenAddresses: string[]): Promise<DexscreenerPairItem[]> {
		const joined = tokenAddresses.map((a) => encodeURIComponent(a)).join(",");
		const path = `/tokens/v1/${encodeURIComponent(chainId)}/${joined}`;
		return await this.request<DexscreenerPairItem[]>(path);
	}

	/** GET /token-profiles/latest/v1 */
	public async getLatestTokenProfiles(): Promise<unknown> {
		return await this.request<unknown>(`/token-profiles/latest/v1`);
	}

	/** GET /community-takeovers/latest/v1 */
	public async getLatestCommunityTakeovers(): Promise<unknown> {
		return await this.request<unknown>(`/community-takeovers/latest/v1`);
	}

	/** GET /ads/latest/v1 */
	public async getLatestAds(): Promise<unknown> {
		return await this.request<unknown>(`/ads/latest/v1`);
	}

	/** GET /token-boosts/latest/v1 */
	public async getLatestTokenBoosts(): Promise<unknown> {
		return await this.request<unknown>(`/token-boosts/latest/v1`);
	}

	/** GET /token-boosts/top/v1 */
	public async getTopTokenBoosts(): Promise<unknown> {
		return await this.request<unknown>(`/token-boosts/top/v1`);
	}

	/** GET /orders/v1/{chainId}/{tokenAddress} */
	public async getOrders(chainId: string, tokenAddress: string): Promise<unknown> {
		const path = `/orders/v1/${encodeURIComponent(chainId)}/${encodeURIComponent(tokenAddress)}`;
		return await this.request<unknown>(path);
	}

	private async request<T>(path: string): Promise<T> {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
		const url = `${this.baseUrl}${path}`;

		let lastError: unknown = undefined;
		for (let attempt = 0; attempt <= this.retries; attempt++) {
			try {
				const resp = await fetch(url, {
					method: "GET",
					headers: { "Content-Type": "application/json" },
					signal: controller.signal,
				});
				if (!resp.ok) {
					throw new Error(`HTTP ${resp.status}`);
				}
				const data = (await resp.json()) as T;
				clearTimeout(timeout);
				return data;
			} catch (err) {
				lastError = err;
				// small backoff before retrying (except on final attempt)
				if (attempt < this.retries) {
					await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
				}
			}
		}
		clearTimeout(timeout);
		throw lastError instanceof Error ? lastError : new Error("Dexscreener request failed");
	}
}


export function buildDexscreenerTokenSummary(tokenAddress: string, response: DexscreenerPairsResponse): DexscreenerTokenSummary {
	const pairs = response.pairs ?? [];
	const chains = Array.from(new Set(pairs.map((p) => p.chainId)));
	let liquidityUsdTotal = 0;
	let volume24hTotal = 0;
	let buys24h = 0;
	let sells24h = 0;
	let tokenName: string | undefined = undefined;
	let tokenSymbol: string | undefined = undefined;

	for (const p of pairs) {
		if (p.liquidity?.usd) liquidityUsdTotal += p.liquidity.usd;
		if (p.volume?.h24) volume24hTotal += p.volume.h24;
		if (p.txns?.h24?.buys) buys24h += p.txns.h24.buys;
		if (p.txns?.h24?.sells) sells24h += p.txns.h24.sells;
		if (!tokenName || !tokenSymbol) {
			if (p.baseToken?.address?.toLowerCase() === tokenAddress.toLowerCase()) {
				tokenName = p.baseToken.name;
				tokenSymbol = p.baseToken.symbol;
			}
		}
	}

	const primaryPair = [...pairs].sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))[0];

	return {
		tokenAddress,
		tokenName,
		tokenSymbol,
		chains,
		numPairs: pairs.length,
		liquidityUsdTotal,
		volume24hTotal,
		transactions24h: { buys: buys24h, sells: sells24h },
		primaryPair: primaryPair
			? {
				chainId: primaryPair.chainId,
				dexId: primaryPair.dexId,
				pairAddress: primaryPair.pairAddress,
				priceUsd: primaryPair.priceUsd,
				liquidityUsd: primaryPair.liquidity?.usd,
				fdv: primaryPair.fdv,
				marketCap: primaryPair.marketCap,
				url: primaryPair.url,
			}
			: undefined,
	};
}


