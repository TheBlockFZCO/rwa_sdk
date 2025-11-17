import type { Address, Chain } from "viem";
import { createPublicClient, http } from "viem";
import { ADDRESS_INDEXER_ABI } from "../contracts/abis";
import type { OnChainConfig } from "./types";

export class AddressIndexerClient<TChain extends Chain | undefined = Chain | undefined> {
	protected readonly client: any;
	protected readonly address: Address;

	constructor(address: Address, options: OnChainConfig<TChain> = {}) {
		this.address = address;
		this.client = createPublicClient({
			chain: options.chain,
			transport: http(options.rpcUrl),
		});
	}

    public async get(account: Address) {
		const tuple = (await this.client.readContract({
			abi: ADDRESS_INDEXER_ABI,
			address: this.address,
			functionName: "get",
			args: [account],
		})) as readonly [bigint, boolean, `0x${string}`];
		const [bal, isContract, codehash] = tuple;
		return { bal, isContract, codehash };
	}

    public async getBatch(accounts: Address[]) {
		const res = (await this.client.readContract({
			abi: ADDRESS_INDEXER_ABI,
			address: this.address,
			functionName: "getBatch",
			args: [accounts],
		})) as { balances: bigint[]; isContracts: boolean[]; codehashes: `0x${string}`[] };
		return res;
	}
}


