import { GoldRushClient as CovalentGoldRushClient } from "@covalenthq/client-sdk";
import type { OnChainConfig } from "./types";

export interface GetTokenBalancesParams {
	chainName: string;
	walletAddress: string;
	quoteCurrency?:
		| "USD"
		| "CAD"
		| "EUR"
		| "SGD"
		| "INR"
		| "JPY"
		| "VND"
		| "CNY"
		| "KRW"
		| "RUB"
		| "TRY"
		| "NGN"
		| "ARS"
		| "AUD"
		| "CHF"
		| "GBP";
	noSpam?: boolean;
}

export class GoldrushClient {
	private readonly client: CovalentGoldRushClient;

	constructor(_config: OnChainConfig) {
		const apiKey = process.env.GOLDRUSH_API_KEY;
		if (!apiKey) throw new Error("Missing GoldRush API key. Set GOLDRUSH_API_KEY.");
		this.client = new CovalentGoldRushClient(apiKey);
	}

	public async getTokenBalancesForWalletAddress(params: GetTokenBalancesParams) {
		const resp = await (this.client as any).BalanceService.getTokenBalancesForWalletAddress({
			chainName: params.chainName,
			walletAddress: params.walletAddress,
			"quote-currency": params.quoteCurrency,
			"no-spam": params.noSpam,
		});
		return resp.data as any;
	}

	public async getHistoricalTokenPrices(params: {
		chainName: string;
		quoteCurrency:
			| "USD"
			| "CAD"
			| "EUR"
			| "SGD"
			| "INR"
			| "JPY"
			| "VND"
			| "CNY"
			| "KRW"
			| "RUB"
			| "TRY"
			| "NGN"
			| "ARS"
			| "AUD"
			| "CHF"
			| "GBP";
		contractAddresses: string[] | string;
		from?: string; // YYYY-MM-DD
		to?: string; // YYYY-MM-DD
		pricesAtAsc?: boolean;
	}) {
		const contractAddress = Array.isArray(params.contractAddresses)
			? params.contractAddresses.join(",")
			: params.contractAddresses;
		const resp = await (this.client as any).PricingService.getTokenPrices(
			params.chainName,
			params.quoteCurrency,
			contractAddress,
			{ from: params.from, to: params.to, pricesAtAsc: params.pricesAtAsc },
		);
		return resp.data as any;
	}

	public async getTokenHoldersV2ForTokenAddress(params: {
		chainName: string;
		tokenAddress: string;
		blockHeight?: number;
		date?: string; // YYYY-MM-DD
		pageSize?: 100 | 1000;
		pageNumber?: number;
		noSnapshot?: boolean;
	}) {
		try {
			// Since the SDK doesn't have this method, make a direct HTTP request
			const apiKey = process.env.GOLDRUSH_API_KEY;
			if (!apiKey) {
				throw new Error("Missing GoldRush API key. Set GOLDRUSH_API_KEY.");
			}

			// Build query parameters
			const queryParams = new URLSearchParams();
			if (params.blockHeight !== undefined) queryParams.append('block-height', params.blockHeight.toString());
			if (params.date) queryParams.append('date', params.date);
			if (params.pageSize !== undefined) queryParams.append('page-size', params.pageSize.toString());
			if (params.pageNumber !== undefined) queryParams.append('page-number', params.pageNumber.toString());
			if (params.noSnapshot !== undefined) queryParams.append('no-snapshot', params.noSnapshot.toString());

			const url = `https://api.covalenthq.com/v1/${params.chainName}/tokens/${params.tokenAddress}/token_holders_v2/?${queryParams.toString()}`;
			
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${apiKey}`,
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			return data;
		} catch (error) {
			console.error("API Error:", error);
			throw error;
		}
	}

	public async getTokenHoldersV2ForTokenAddressByPage(params: {
		chainName: string;
		tokenAddress: string;
		blockHeight?: number;
		date?: string; // YYYY-MM-DD
		pageSize?: 100 | 1000;
		pageNumber?: number;
		noSnapshot?: boolean;
	}) {
		// Use the same implementation as getTokenHoldersV2ForTokenAddress
		return this.getTokenHoldersV2ForTokenAddress(params);
	}
}

// Global singleton helpers
let __goldrushSingleton: GoldrushClient | null = null;

export function initGoldrushClient(config: OnChainConfig = {}) {
	__goldrushSingleton = new GoldrushClient(config);
	return __goldrushSingleton;
}

export function getGoldrushClient() {
	if (__goldrushSingleton) return __goldrushSingleton;
	const apiKey = process.env.GOLDRUSH_API_KEY;
	if (!apiKey) {
		throw new Error(
			"GoldRush API key not initialized. Call initGoldrushClient() or set GOLDRUSH_API_KEY.",
		);
	}
	__goldrushSingleton = new GoldrushClient({});
	return __goldrushSingleton;
}


