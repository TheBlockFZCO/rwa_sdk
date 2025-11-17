export interface StellarExpertTomlInfo {
	code: string;
	issuer: string;
	name?: string;
	decimals?: number;
	anchorAssetType?: string;
	anchorAsset?: string;
	orgName?: string;
	orgLogo?: string;
}

export interface StellarExpertRating {
	age?: number;
	trades?: number;
	payments?: number;
	trustlines?: number;
	volume7d?: number;
	interop?: number;
	liquidity?: number;
	average?: number;
}

export interface StellarExpertAssetResponse {
	asset: string;
	created: number;
	supply: number;
	trustlines: {
		total: number;
		authorized: number;
		funded: number;
	};
	payments: number;
	payments_amount: number;
	volume: number | null;
	volume7d: number | null;
	toml_info?: StellarExpertTomlInfo;
	home_domain?: string;
	rating?: StellarExpertRating;
}

export interface StellarExpertClientConfig {
	baseUrl?: string; // default https://api.stellar.expert
	timeoutMs?: number; // default 15000
	retries?: number; // default 2
}

export class StellarExpertClient {
	private readonly baseUrl: string;
	private readonly timeoutMs: number;
	private readonly retries: number;

	constructor(config: StellarExpertClientConfig = {}) {
		this.baseUrl = config.baseUrl ?? "https://api.stellar.expert";
		this.timeoutMs = config.timeoutMs ?? 15_000;
		this.retries = config.retries ?? 2;
	}

	public async getAsset(asset: string): Promise<StellarExpertAssetResponse> {
		// asset format: CODE-ISSUER (e.g., BENJI-GBHN...)
		const path = `/explorer/public/asset/${encodeURIComponent(asset)}`;
		return await this.request<StellarExpertAssetResponse>(path);
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
				if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
				const data = (await resp.json()) as T;
				clearTimeout(timeout);
				return data;
			} catch (err) {
				lastError = err;
				if (attempt < this.retries) {
					await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
				}
			}
		}
		clearTimeout(timeout);
		throw lastError instanceof Error ? lastError : new Error("Stellar Expert request failed");
	}
}


