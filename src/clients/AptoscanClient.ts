export interface AptoscanFungibleAssetData {
	coin_id: string;
	name: string;
	symbol: string;
	decimals: number;
	current_price?: number;
	current_num_holder?: number;
	total_supply?: number;
	logo_url?: string;
	project_url?: string;
	creator_address?: string;
	coin_standard?: string; // e.g., "v2"
	reputation?: string; // e.g., "ok"
	isFungibleAsset?: boolean;
	address: string;
}

export interface AptoscanResponse<T> {
	success: boolean;
	data: T;
	metadata?: Record<string, unknown>;
}

export interface AptoscanClientConfig {
    baseUrl?: string; // default https://api.aptoscan.com
    timeoutMs?: number; // default 15000
    retries?: number; // default 2
}

export class AptoscanClient {
	private readonly baseUrl: string;
	private readonly timeoutMs: number;
	private readonly retries: number;

    constructor(config: AptoscanClientConfig = {}) {
		this.baseUrl = config.baseUrl ?? "https://api.aptoscan.com";
		this.timeoutMs = config.timeoutMs ?? 15_000;
		this.retries = config.retries ?? 2;
	}

	public async getFungibleAsset(address: string): Promise<AptoscanResponse<AptoscanFungibleAssetData>> {
		const path = `/public/v1.0/fungible_assets/${encodeURIComponent(address)}`;
		return await this.request<AptoscanResponse<AptoscanFungibleAssetData>>(path);
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
					signal: controller.signal,
				});
				if (!resp.ok) {
					const text = await resp.text().catch(() => "");
					// Handle rate limits explicitly
					if (resp.status === 429) {
						const retryAfter = Number(resp.headers.get("retry-after") ?? 0);
						const waitMs = retryAfter > 0 ? retryAfter * 1000 : 500 * (attempt + 1);
						await new Promise((r) => setTimeout(r, waitMs));
						continue;
					}
					throw new Error(`HTTP ${resp.status}${text ? `: ${text}` : ""}`);
				}
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
		throw lastError instanceof Error ? lastError : new Error("Aptoscan request failed");
	}
}


