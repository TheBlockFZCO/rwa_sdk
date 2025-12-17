export interface GeckoTerminalTokenInfo {
	address: string;
	name: string;
	symbol: string;
	decimals?: number;
}

export interface GeckoTerminalPoolAttributes {
	address: string;
	name?: string;
	base_token: GeckoTerminalTokenInfo;
	quote_token: GeckoTerminalTokenInfo;
	base_token_price_usd?: string;
	base_token_price_native_currency?: string;
	quote_token_price_usd?: string;
	quote_token_price_native_currency?: string;
	base_token_price_quote_token?: string;
	quote_token_price_base_token?: string;
	pool_created_at?: string;
	fdv_usd?: string;
	market_cap_usd?: string;
	price_change_percentage?: {
		m5?: string;
		h1?: string;
		h6?: string;
		h24?: string;
	};
	transactions?: {
		m5?: { buys: number; sells: number };
		h1?: { buys: number; sells: number };
		h6?: { buys: number; sells: number };
		h24?: { buys: number; sells: number };
	};
	reserve_in_usd?: string;
	volume_usd?: {
		m5?: string;
		h1?: string;
		h6?: string;
		h24?: string;
	};
}

export interface GeckoTerminalPoolItem {
	id: string;
	type: string;
	attributes: GeckoTerminalPoolAttributes;
	relationships?: {
		base_token?: { data: { id: string; type: string } };
		quote_token?: { data: { id: string; type: string } };
		dex?: { data: { id: string; type: string } };
	};
}

export interface GeckoTerminalTokenData {
	id: string;
	type: string;
	attributes: {
		address: string;
		name: string;
		symbol: string;
		decimals?: number;
		image_url?: string;
		coingecko_coin_id?: string;
		total_supply?: string;
		normalized_total_supply?: string;
		price_usd?: string | null;
		fdv_usd?: string | null;
		total_reserve_in_usd?: string;
		volume_usd?: { h24?: string };
		market_cap_usd?: string;
	};
}

export interface GeckoTerminalTokenResponse {
	data: GeckoTerminalTokenData;
	included?: GeckoTerminalPoolItem[];
}

export interface GeckoTerminalClientConfig {
	/** Optionally override base URL, defaults to GeckoTerminal API */
	baseUrl?: string;
	/** Request timeout in ms (default: 15_000) */
	timeoutMs?: number;
	/** Number of retries on transient failures (default: 2) */
	retries?: number;
}

export interface GeckoTerminalTokenSummary {
	tokenAddress: string;
	tokenName?: string;
	tokenSymbol?: string;
	network: string;
	numPools: number;
	liquidityUsdTotal: number;
	volume24hTotal: number;
	transactions24h: { buys: number; sells: number };
	primaryPool?: {
		poolAddress: string;
		baseToken: GeckoTerminalTokenInfo;
		quoteToken: GeckoTerminalTokenInfo;
		priceUsd?: string;
		liquidityUsd?: number;
		fdv?: number;
		marketCap?: number;
	};
}

export class GeckoTerminalClient {
	private readonly baseUrl: string;
	private readonly timeoutMs: number;
	private readonly retries: number;

	constructor(config: GeckoTerminalClientConfig = {}) {
		this.baseUrl = (config.baseUrl ?? "https://api.geckoterminal.com/api/v2").replace(/\/$/, "");
		this.timeoutMs = config.timeoutMs ?? 15_000;
		this.retries = config.retries ?? 2;
	}

	/**
	 * Get token info and top pools for a token on a specific network
	 * @param network Network identifier (e.g., "solana", "ethereum", "base")
	 * @param tokenAddress Token address
	 * @param includeTopPools Include top pools in response (default: true)
	 * @param includeComposition Include pool composition (default: false)
	 */
	public async getToken(
		network: string,
		tokenAddress: string,
		includeTopPools: boolean = true,
		includeComposition: boolean = false
	): Promise<GeckoTerminalTokenResponse> {
		const params = new URLSearchParams();
		if (includeTopPools) {
			params.append("include", "top_pools");
		}
		if (includeComposition) {
			params.append("include_composition", "true");
		}
		const query = params.toString();
		const path = `/networks/${encodeURIComponent(network)}/tokens/${encodeURIComponent(tokenAddress)}${query ? `?${query}` : ""}`;
		return await this.request<GeckoTerminalTokenResponse>(path);
	}

	/**
	 * Get specific pool information
	 * @param network Network identifier
	 * @param poolAddress Pool address
	 */
	public async getPool(network: string, poolAddress: string): Promise<unknown> {
		const path = `/networks/${encodeURIComponent(network)}/pools/${encodeURIComponent(poolAddress)}`;
		return await this.request<unknown>(path);
	}

	/**
	 * Search for pools by network
	 * @param network Network identifier
	 * @param query Search query
	 */
	public async searchPools(network: string, query: string): Promise<unknown> {
		const path = `/networks/${encodeURIComponent(network)}/pools/search?query=${encodeURIComponent(query)}`;
		return await this.request<unknown>(path);
	}

	/**
	 * Get trending pools for a network
	 * @param network Network identifier
	 */
	public async getTrendingPools(network: string): Promise<unknown> {
		const path = `/networks/${encodeURIComponent(network)}/trending_pools`;
		return await this.request<unknown>(path);
	}

	/**
	 * Get OHLCV candlestick data for a pool
	 * @param network Network identifier
	 * @param poolAddress Pool address
	 * @param timeframe Timeframe (e.g., "hour", "day")
	 * @param aggregate Aggregate level (e.g., 1, 4, 24)
	 * @param beforeTimestamp Optional timestamp to get data before
	 * @param limit Number of data points (default: 100)
	 */
	public async getPoolOHLCV(
		network: string,
		poolAddress: string,
		timeframe: "minute" | "hour" | "day" = "hour",
		aggregate: number = 1,
		beforeTimestamp?: number,
		limit: number = 100
	): Promise<unknown> {
		const params = new URLSearchParams();
		params.append("timeframe", timeframe);
		params.append("aggregate", String(aggregate));
		params.append("limit", String(limit));
		if (beforeTimestamp) {
			params.append("before_timestamp", String(beforeTimestamp));
		}
		const path = `/networks/${encodeURIComponent(network)}/pools/${encodeURIComponent(poolAddress)}/ohlcv/${timeframe}?${params.toString()}`;
		return await this.request<unknown>(path);
	}

	/**
	 * Get supported networks
	 */
	public async getNetworks(): Promise<unknown> {
		return await this.request<unknown>("/networks");
	}

	/**
	 * Get DEXes for a network
	 * @param network Network identifier
	 */
	public async getDexes(network: string): Promise<unknown> {
		const path = `/networks/${encodeURIComponent(network)}/dexes`;
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
					headers: { Accept: "application/json" },
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
		throw lastError instanceof Error ? lastError : new Error("GeckoTerminal request failed");
	}
}

/**
 * Build a token summary from GeckoTerminal token response
 */
export function buildGeckoTerminalTokenSummary(
	network: string,
	tokenAddress: string,
	response: GeckoTerminalTokenResponse
): GeckoTerminalTokenSummary {
	const parseNumber = (value?: string | null): number | undefined => {
		if (value === undefined || value === null) return undefined;
		const parsed = Number.parseFloat(value);
		return Number.isNaN(parsed) ? undefined : parsed;
	};

	const tokenData = response.data;
	const tokenAttributes = tokenData.attributes;
	const pools = (response.included ?? []).filter((item) => item.type === "pool") as GeckoTerminalPoolItem[];

	let liquidityUsdTotal = 0;
	let volume24hTotal = 0;
	let buys24h = 0;
	let sells24h = 0;

	for (const pool of pools) {
		const attrs = pool.attributes;
		const reserve = parseNumber(attrs.reserve_in_usd);
		if (reserve !== undefined) {
			liquidityUsdTotal += reserve;
		}

		const volume = parseNumber(attrs.volume_usd?.h24);
		if (volume !== undefined) {
			volume24hTotal += volume;
		}

		if (attrs.transactions?.h24) {
			buys24h += attrs.transactions.h24.buys ?? 0;
			sells24h += attrs.transactions.h24.sells ?? 0;
		}
	}

	if (pools.length === 0) {
		const reserveFallback = parseNumber(tokenAttributes.total_reserve_in_usd);
		if (reserveFallback !== undefined) {
			liquidityUsdTotal = reserveFallback;
		}

		const volumeFallback = parseNumber(tokenAttributes.volume_usd?.h24);
		if (volumeFallback !== undefined) {
			volume24hTotal = volumeFallback;
		}
	}

	const primaryPool = pools.length
		? [...pools].sort((a, b) => {
			const aReserve = parseNumber(a.attributes.reserve_in_usd) ?? 0;
			const bReserve = parseNumber(b.attributes.reserve_in_usd) ?? 0;
			return bReserve - aReserve;
		})[0]
		: undefined;

	return {
		tokenAddress,
		tokenName: tokenAttributes.name,
		tokenSymbol: tokenAttributes.symbol,
		network,
		numPools: pools.length,
		liquidityUsdTotal,
		volume24hTotal,
		transactions24h: { buys: buys24h, sells: sells24h },
		primaryPool: primaryPool
			? {
				poolAddress: primaryPool.attributes.address,
				baseToken: primaryPool.attributes.base_token,
				quoteToken: primaryPool.attributes.quote_token,
				priceUsd: primaryPool.attributes.base_token_price_usd,
				liquidityUsd: parseNumber(primaryPool.attributes.reserve_in_usd),
				fdv: parseNumber(primaryPool.attributes.fdv_usd),
				marketCap: parseNumber(primaryPool.attributes.market_cap_usd),
			}
			: undefined,
	};
}

