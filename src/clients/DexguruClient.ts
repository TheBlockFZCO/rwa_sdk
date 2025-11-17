export interface DexguruClientConfig {
	/** Base URL for DexGuru API (default: https://api.dev.dex.guru) */
	baseUrl?: string;
	/** API key for DexGuru (required) */
	apiKey: string;
	/** Request timeout in ms (default: 8_000) */
	timeoutMs?: number;
	/** Number of retries on transient failures (default: 2) */
	retries?: number;
}

export interface DexguruPaginatedParams {
	begin_timestamp?: number;
	end_timestamp?: number;
	sort_by?: string; // e.g. "timestamp"
	order?: "asc" | "desc";
	limit?: number;
	offset?: number;
	[key: string]: unknown;
}

export interface DexguruHistoryParams {
	from: number; // unix seconds
	to: number; // unix seconds
	interval: "1m" | "5m" | "15m" | "1h" | "4h" | "1d";
}

export class DexguruClient {
	private readonly baseUrl: string;
	private readonly apiKey: string;
	private readonly timeoutMs: number;
	private readonly retries: number;

	constructor(config: DexguruClientConfig) {
		this.baseUrl = (config.baseUrl ?? "https://api.dev.dex.guru").replace(/\/$/, "");
		if (!config.apiKey || config.apiKey.trim() === "") {
			throw new Error("DexGuru API key is required");
		}
		this.apiKey = config.apiKey.trim();
		this.timeoutMs = config.timeoutMs ?? 8_000;
		this.retries = config.retries ?? 2;
	}

	// --- Token endpoints ---
	public async getTokenInventory(chainId: number, tokenAddress: string): Promise<unknown> {
		return await this.request(`/v1/chain/${chainId}/tokens/${tokenAddress}`);
	}

	public async getTokenLogo(chainId: number, tokenAddress: string): Promise<unknown> {
		return await this.request(`/v1/chain/${chainId}/tokens/${tokenAddress}/logo`);
	}

	public async getTokenMarket(chainId: number, tokenAddress: string): Promise<unknown> {
		return await this.request(`/v1/chain/${chainId}/tokens/${tokenAddress}/market`);
	}

	public async getTokenMarketHistory(chainId: number, tokenAddress: string, params: DexguruHistoryParams): Promise<unknown> {
		const u = new URL(`${this.baseUrl}/v1/chain/${chainId}/tokens/${tokenAddress}/market/history`);
		u.searchParams.set("from", String(params.from));
		u.searchParams.set("to", String(params.to));
		u.searchParams.set("interval", params.interval);
		return await this.request(u.pathname + "?" + u.searchParams.toString());
	}

	public async getTokenTransactions(chainId: number, tokenAddress: string, params: DexguruPaginatedParams = {}): Promise<unknown> {
		return await this.request(this.withQuery(`/v1/chain/${chainId}/tokens/${tokenAddress}/transactions`, params));
	}

	public async getTokenSwaps(chainId: number, tokenAddress: string, params: DexguruPaginatedParams = {}): Promise<unknown> {
		return await this.request(this.withQuery(`/v1/chain/${chainId}/tokens/${tokenAddress}/transactions/swaps`, params));
	}

	public async getTokenBurns(chainId: number, tokenAddress: string, params: DexguruPaginatedParams = {}): Promise<unknown> {
		return await this.request(this.withQuery(`/v1/chain/${chainId}/tokens/${tokenAddress}/transactions/burns`, params));
	}

	public async getTokenMints(chainId: number, tokenAddress: string, params: DexguruPaginatedParams = {}): Promise<unknown> {
		return await this.request(this.withQuery(`/v1/chain/${chainId}/tokens/${tokenAddress}/transactions/mints`, params));
	}

	public async getTokenTransfers(chainId: number, tokenAddress: string, params: DexguruPaginatedParams = {}): Promise<unknown> {
		return await this.request(this.withQuery(`/v1/chain/${chainId}/tokens/${tokenAddress}/transactions/transfers`, params));
	}

	// --- TradingView UDF ---
	public async getTradingViewHistory(symbol: string, from: number, to: number, resolution: string): Promise<unknown> {
		const u = new URL(`${this.baseUrl}/v1/tradingview/history`);
		u.searchParams.set("symbol", symbol);
		u.searchParams.set("from", String(from));
		u.searchParams.set("to", String(to));
		u.searchParams.set("resolution", resolution);
		return await this.request(u.pathname + "?" + u.searchParams.toString());
	}

	// --- internals ---
	private withQuery(path: string, params: Record<string, unknown>): string {
		const u = new URL(`${this.baseUrl}${path}`);
		for (const [k, v] of Object.entries(params)) {
			if (v === undefined || v === null) continue;
			u.searchParams.set(k, String(v));
		}
		return `${u.pathname}${u.search ? `?${u.searchParams.toString()}` : ""}`;
	}

	/** Ensures api-key is present in query params (matching dexguru.ts pattern) */
	private withKey(url: string): string {
		const u = new URL(url);
		if (!u.searchParams.has("api-key")) {
			u.searchParams.set("api-key", this.apiKey);
		}
		return u.toString();
	}

	private headers(): Record<string, string> {
		return { "api-key": this.apiKey, Accept: "application/json" };
	}

	private async request(path: string): Promise<unknown> {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
		const url = this.withKey(`${this.baseUrl}${path}`);

		let lastError: unknown = undefined;
		for (let attempt = 0; attempt <= this.retries; attempt++) {
			try {
				const resp = await fetch(url, {
					method: "GET",
					headers: this.headers(),
					signal: controller.signal,
				});
				const text = await resp.text();
				if (!resp.ok) {
					throw new Error(text || `HTTP ${resp.status}`);
				}
				clearTimeout(timeout);
				try {
					return JSON.parse(text);
				} catch {
					return text;
				}
			} catch (err) {
				lastError = err;
				// small backoff before retrying (except on final attempt)
				if (attempt < this.retries) {
					await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
				}
			}
		}
		clearTimeout(timeout);
		throw lastError instanceof Error ? lastError : new Error("DexGuru request failed");
	}
}

