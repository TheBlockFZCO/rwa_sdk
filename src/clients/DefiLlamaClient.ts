export interface DefiLlamaClientConfig {
	/** Optionally override base URL, defaults to DefiLlama API */
	baseUrl?: string;
	/** Optionally override Stablecoins API base URL (default: https://stablecoins.llama.fi) */
	stablecoinsBaseUrl?: string;
	/** Request timeout in ms (default: 15_000) */
	timeoutMs?: number;
	/** Number of retries on transient failures (default: 2) */
	retries?: number;
}

/**
 * Minimal typing for protocols
 */
export interface DefiLlamaProtocol {
	id: string;
	name: string;
	address?: string | null;
	symbol?: string;
	url?: string;
	description?: string;
	chain?: string;
	logo?: string;
	category?: string;
	chains?: string[];
	module?: string;
	twitter?: string;
	listedAt?: number;
	slug?: string;
	tvl?: number;
	chainTvls?: Record<string, number>;
	change_1h?: number | null;
	change_1d?: number | null;
	change_7d?: number | null;

	[key: string]: unknown;
}

/**
 * Minimal typing for https://stablecoins.llama.fi/stablecoins
 */
export interface LlamaStablecoinsResponse {
	peggedAssets: LlamaPeggedAsset[];
	[key: string]: unknown;
}

export interface LlamaPeggedAsset {
	id: string;
	name: string;
	symbol: string;
	gecko_id?: string | null;
	pegType?: string;
	priceSource?: string | null;
	pegMechanism?: string;
	chains?: string[];
	price?: number | null;

	// very large nested objects in the response; keep loose typing for compatibility
	circulating?: Record<string, number>;
	circulatingPrevDay?: Record<string, number>;
	circulatingPrevWeek?: Record<string, number>;
	circulatingPrevMonth?: Record<string, number>;
	chainCirculating?: Record<string, unknown>;

	[key: string]: unknown;
}

export class DefiLlamaClient {
	private readonly baseUrl: string;
	private readonly stablecoinsBaseUrl: string;
	private readonly timeoutMs: number;
	private readonly retries: number;

	constructor(config: DefiLlamaClientConfig = {}) {
		this.baseUrl = (config.baseUrl ?? "https://api.llama.fi").replace(/\/$/, "");
		this.stablecoinsBaseUrl = (config.stablecoinsBaseUrl ?? "https://stablecoins.llama.fi").replace(/\/$/, "");
		this.timeoutMs = config.timeoutMs ?? 15_000;
		this.retries = config.retries ?? 2;
	}

	/** GET /protocols */
	public async getProtocols(): Promise<DefiLlamaProtocol[]> {
		const data = await this.request<unknown>(`/protocols`);
		if (!Array.isArray(data)) {
			throw new Error("DefiLlama /protocols: expected an array response");
		}
		return data as DefiLlamaProtocol[];
	}

	/** GET https://stablecoins.llama.fi/stablecoins */
	public async getStablecoins(): Promise<LlamaStablecoinsResponse> {
		const data = await this.requestFrom<LlamaStablecoinsResponse>(this.stablecoinsBaseUrl, `/stablecoins`);
		if (!data || typeof data !== "object" || !Array.isArray((data as any).peggedAssets)) {
			throw new Error("Stablecoins /stablecoins: expected an object with peggedAssets[]");
		}
		return data;
	}

	private async request<T>(path: string): Promise<T> {
		return await this.requestFrom<T>(this.baseUrl, path);
	}

	private async requestFrom<T>(baseUrl: string, path: string): Promise<T> {
		const url = `${baseUrl}${path}`;
		let lastError: unknown = undefined;

		for (let attempt = 0; attempt <= this.retries; attempt++) {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);
			try {
				const resp = await fetch(url, {
					method: "GET",
					headers: { Accept: "application/json" },
					signal: controller.signal,
				});
				if (!resp.ok) {
					const text = await resp.text().catch(() => "");
					throw new Error(text || `HTTP ${resp.status}`);
				}

				const data = (await resp.json()) as T;
				return data;
			} catch (err) {
				lastError = err;
				// small backoff before retrying (except on final attempt)
				if (attempt < this.retries) {
					await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
				}
			} finally {
				clearTimeout(timeoutId);
			}
		}

		throw lastError instanceof Error ? lastError : new Error("Llama request failed");
	}
}

