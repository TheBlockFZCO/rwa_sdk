export interface DefiLlamaClientConfig {
	/** Optionally override base URL, defaults to DefiLlama API */
	baseUrl?: string;
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

export class DefiLlamaClient {
	private readonly baseUrl: string;
	private readonly timeoutMs: number;
	private readonly retries: number;

	constructor(config: DefiLlamaClientConfig = {}) {
		this.baseUrl = (config.baseUrl ?? "https://api.llama.fi").replace(/\/$/, "");
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

	private async request<T>(path: string): Promise<T> {
		const url = `${this.baseUrl}${path}`;
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

		throw lastError instanceof Error ? lastError : new Error("DefiLlama request failed");
	}
}

