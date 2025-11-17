export interface AptosFungibleAssetMetadata {
	symbol: string;
	name: string;
	decimals: number;
	asset_type: string;
	project_uri?: string | null;
	icon_uri?: string | null;
	supply_aggregator_table_key_v1?: string | null;
	supply_v2?: string | null;
	last_transaction_timestamp?: string | null;
	__typename?: string;
}

export interface AptosIndexerResponse<T> {
	data?: T;
	errors?: Array<{ message: string }>; // basic GraphQL error shape
}

export interface AptosIndexerClientConfig {
	baseUrl?: string; // default https://api.mainnet.aptoslabs.com/v1/graphql
	timeoutMs?: number; // default 15000
	retries?: number; // default 2
}

export class AptosIndexerClient {
	private readonly baseUrl: string;
	private readonly timeoutMs: number;
	private readonly retries: number;

	constructor(config: AptosIndexerClientConfig = {}) {
		this.baseUrl = config.baseUrl ?? "https://api.mainnet.aptoslabs.com/v1/graphql";
		this.timeoutMs = config.timeoutMs ?? 15_000;
		this.retries = config.retries ?? 2;
	}

	public async getFungibleAssetMetadata(assetType: string) {
		const query = `
			query GetFungibleAssetMetadata($assetType: String!) {
				fungible_asset_metadata(
					where: { asset_type: { _eq: $assetType } }
					offset: 0
					limit: 100
				) {
					symbol
					name
					decimals
					asset_type
					project_uri
					icon_uri
					supply_aggregator_table_key_v1
					supply_v2
					last_transaction_timestamp
					__typename
				}
			}
		`;
		const body = { query, variables: { assetType } };
		const resp = await this.request<AptosIndexerResponse<{ fungible_asset_metadata: AptosFungibleAssetMetadata[] }>>(
			JSON.stringify(body),
		);
		if (resp.errors && resp.errors.length) {
			throw new Error(resp.errors.map((e) => e.message).join("; "));
		}
		return resp.data?.fungible_asset_metadata ?? [];
	}

	private async request<T>(jsonBody: string): Promise<T> {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

		let lastError: unknown = undefined;
		for (let attempt = 0; attempt <= this.retries; attempt++) {
			try {
				const resp = await fetch(this.baseUrl, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: jsonBody,
					signal: controller.signal,
				});
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
		throw lastError instanceof Error ? lastError : new Error("Aptos Indexer request failed");
	}
}


