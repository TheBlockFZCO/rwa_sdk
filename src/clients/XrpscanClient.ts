export interface XrpscanTokenResponse {
	id?: string;
	code?: string;
	currency?: string;
	issuer?: string;
	token?: string;
	createdAt?: string;
	updatedAt?: string;
	blackholed?: boolean;
	price?: number;
	marketcap?: number;
	supply?: number;
	holders?: number;
	amms?: number;
	meta?: Record<string, any>;
	metrics?: Record<string, any>;
	tomldata?: Record<string, any>;
	disabled?: boolean;
	score?: number;
	IssuingAccount?: Record<string, any>;
}

export interface XrpscanClientConfig {
	baseUrl?: string; // default https://api.xrpscan.com
	timeoutMs?: number; // default 15000
	retries?: number; // default 2
}

export class XrpscanClient {
	private readonly baseUrl: string;
	private readonly timeoutMs: number;
	private readonly retries: number;

	constructor(config: XrpscanClientConfig = {}) {
		this.baseUrl = config.baseUrl ?? "https://api.xrpscan.com";
		this.timeoutMs = config.timeoutMs ?? 15_000;
		this.retries = config.retries ?? 2;
	}

	public async getToken(identifier: string): Promise<XrpscanTokenResponse> {
		const path = `/api/v1/token/${encodeURIComponent(identifier)}`;
		return await this.request<XrpscanTokenResponse>(path);
	}

	private async request<T>(path: string): Promise<T> {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
		const url = `${this.baseUrl}${path}`;

		let lastError: unknown = undefined;
		for (let attempt = 0; attempt <= this.retries; attempt++) {
			try {
				const resp = await fetch(url, { method: "GET", signal: controller.signal });
				if (!resp.ok) {
					const text = await resp.text().catch(() => "");
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
		throw lastError instanceof Error ? lastError : new Error("XRPSCan request failed");
	}
}


