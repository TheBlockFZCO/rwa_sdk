import type { Address, Chain } from "viem";
import { createPublicClient, http } from "viem";
import { ERC20_INDEXER_ABI } from "../contracts/abis";
import type { OnChainConfig } from "./types";

export interface Erc20IndexerGetResult {
	n: string; // name
	s: string; // symbol
	d: number; // decimals
	ts: bigint; // totalSupply
	bal: bigint; // balanceOf
	alw: bigint; // allowance
}

export class Erc20IndexerClient<TChain extends Chain | undefined = Chain | undefined> {
	protected readonly client: any;
	protected readonly address: Address;

	constructor(address: Address, options: OnChainConfig<TChain> = {}) {
		this.address = address;
		this.client = createPublicClient({
			chain: options.chain,
			transport: http(options.rpcUrl),
		});
	}

	public async get(token: Address, tokenOwner: Address, spender: Address): Promise<Erc20IndexerGetResult> {
		const tuple = (await this.client.readContract({
			abi: ERC20_INDEXER_ABI,
			address: this.address,
			functionName: "get",
			args: [token, tokenOwner, spender],
		})) as readonly [string, string, number | bigint, bigint, bigint, bigint];
		const [n, s, dRaw, ts, bal, alw] = tuple;
		return { n, s, d: Number(dRaw), ts, bal, alw } as Erc20IndexerGetResult;
	}

	public async getBatch(tokens: Address[], tokenOwner: Address, spender: Address) {
		const res = (await this.client.readContract({
			abi: ERC20_INDEXER_ABI,
			address: this.address,
			functionName: "getBatch",
			args: [tokens, tokenOwner, spender],
		})) as {
			names: string[];
			symbols: string[];
			decimalsList: Array<number | bigint>;
			totalSupplies: bigint[];
			balances: bigint[];
			allowances: bigint[];
		};
		return res as any;
	}
}


