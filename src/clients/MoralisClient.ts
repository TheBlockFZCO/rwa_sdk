export interface MoralisClientConfig {
	/** Optionally override base URL, defaults to Moralis API */
	baseUrl?: string;
	/** API key for Moralis (required) */
	apiKey: string;
	/** Request timeout in ms (default: 15_000) */
	timeoutMs?: number;
	/** Number of retries on transient failures (default: 2) */
	retries?: number;
}

export interface MoralisERC20TokenResponse {
	tokenName: string;
	tokenSymbol: string;
	tokenLogo: string;
	tokenDecimals: string;
	nativePrice: string;
	usdPrice: number;
	usdPriceFormatted: string;
	'24hrPercentChange': string;
	exchangeAddress: string;
	exchangeName: string;
	tokenAddress: string;
	toBlock: string;
	possibleSpam: string;
	verifiedContract: boolean;
	pairAddress: string;
	pairTotalLiquidityUsd: string;
	usdPrice24h: number;
	usdPrice24hrUsdChange: number;
	usdPrice24hrPercentChange: number;
	securityScore: number;
}

export class MoralisClient {
	private readonly baseUrl: string;
	private readonly apiKey: string;
	private readonly timeoutMs: number;
	private readonly retries: number;

	constructor(config: MoralisClientConfig) {
		this.baseUrl = (config.baseUrl ?? "https://deep-index.moralis.io/api/v2.2").replace(/\/$/, "");
		if (!config.apiKey || config.apiKey.trim() === "") {
			throw new Error("Moralis API key is required");
		}
		this.apiKey = config.apiKey.trim();
		this.timeoutMs = config.timeoutMs ?? 15_000;
		this.retries = config.retries ?? 2;
	}

	/**
	 * Fetch ERC20 token price and metadata from Moralis
	 * @param tokenAddress - The ERC20 token contract address
	 * @param chain - The blockchain (e.g., "eth", "bsc", "polygon", "arbitrum", "optimism", "base", "avalanche")
	 * @returns Token price and metadata information
	 */
	public async getERC20TokenPrice(
		tokenAddress: string,
		chain: string = "eth"
	): Promise<MoralisERC20TokenResponse> {
		if (!tokenAddress || tokenAddress.trim() === "") {
			throw new Error("Token address is required");
		}
		
		if (!chain || chain.trim() === "") {
			throw new Error("Chain is required");
		}

		const path = `/erc20/${encodeURIComponent(tokenAddress.trim())}/price?chain=${encodeURIComponent(chain.trim())}`;
		
		try {
			return await this.request<MoralisERC20TokenResponse>(path);
		} catch (error) {
			// Provide more helpful error messages for common cases
			if (error instanceof Error && error.message.includes("404")) {
				throw new Error(
					`No liquidity pools found for token ${tokenAddress} on ${chain}. ` +
					`This token may not have trading liquidity or may not exist on this chain.`
				);
			}
			throw error;
		}
	}

	/**
	 * Validate and format token data from Moralis response
	 * @param data - Raw response from Moralis API
	 * @returns Formatted and validated token data
	 */
	public validateTokenData(data: MoralisERC20TokenResponse): MoralisERC20TokenResponse {
		// Basic validation
		if (!data.tokenAddress) {
			throw new Error("Invalid token data: missing tokenAddress");
		}

		// Ensure numeric fields are properly typed
		const formatted = {
			...data,
			usdPrice: Number(data.usdPrice) || 0,
			usdPrice24h: Number(data.usdPrice24h) || 0,
			usdPrice24hrUsdChange: Number(data.usdPrice24hrUsdChange) || 0,
			usdPrice24hrPercentChange: Number(data.usdPrice24hrPercentChange) || 0,
			securityScore: Number(data.securityScore) || 0,
			verifiedContract: Boolean(data.verifiedContract),
		};

		return formatted;
	}

	/**
	 * Make HTTP request to Moralis API with retry logic
	 * @param path - API endpoint path
	 * @returns Parsed response data
	 */
	private async request<T>(path: string): Promise<T> {
		const url = `${this.baseUrl}${path}`;
		const headers = {
			"accept": "application/json",
			"X-API-Key": this.apiKey,
		};

		let lastError: Error;
		
		for (let attempt = 0; attempt <= this.retries; attempt++) {
			try {
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

				const response = await fetch(url, {
					method: "GET",
					headers,
					signal: controller.signal,
				});

				clearTimeout(timeoutId);

				if (!response.ok) {
					const errorText = await response.text().catch(() => "Unknown error");
					throw new Error(`HTTP ${response.status}: ${errorText}`);
				}

				const contentType = response.headers.get("content-type");
				if (!contentType || !contentType.includes("application/json")) {
					throw new Error("Invalid response format: expected JSON");
				}

				const data = await response.json();
				return data as T;
			} catch (error) {
				lastError = error instanceof Error ? error : new Error(String(error));
				
				// Don't retry on authentication errors
				if (error instanceof Error && error.message.includes("401")) {
					throw new Error("Invalid Moralis API key");
				}
				
				// Don't retry on client errors (4xx)
				if (error instanceof Error && error.message.match(/HTTP 4\d\d/)) {
					throw error;
				}

				// If this isn't the last attempt, wait before retrying
				if (attempt < this.retries) {
					const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
					await new Promise(resolve => setTimeout(resolve, delay));
				}
			}
		}

		throw lastError!;
	}
}