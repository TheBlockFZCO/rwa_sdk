import type { Address, Chain } from "viem";
import type { OnChainConfig } from "./types";
import { AddressIndexerClient } from "./AddressIndexerClient";
import { Erc20IndexerClient } from "./Erc20IndexerClient";
import { UniswapV2IndexerClient } from "./UniswapV2IndexerClient";
import { getModuleAddresses } from "../contracts/addresses";
import { GoldrushClient, initGoldrushClient } from "./GoldRushClient";

export interface NetworkInput<TChain extends Chain | undefined = Chain | undefined> extends OnChainConfig<TChain> {
	chainId: number;
	chainName: string;
	factory: Address[];
	base: Address[];
	walletAddress: Address;
	quoteCurrency?: string;
}

export interface NetworkClients<TChain extends Chain | undefined = Chain | undefined> {
	config: NetworkInput<TChain>;
	addressClient: AddressIndexerClient<TChain>;
	erc20Client: Erc20IndexerClient<TChain>;
	uniClient: UniswapV2IndexerClient<TChain>;
	goldrushClient: GoldrushClient;
}

export function buildOnChainForNetwork<TChain extends Chain | undefined = Chain | undefined>(
	input: NetworkInput<TChain>,
): NetworkClients<TChain> {
	const addrs = getModuleAddresses(input.chainId);
	return {
		config: input,
		addressClient: new AddressIndexerClient(addrs.addressIndexerProxy, { rpcUrl: input.rpcUrl, chain: input.chain }),
		erc20Client: new Erc20IndexerClient(addrs.erc20IndexerProxy, { rpcUrl: input.rpcUrl, chain: input.chain }),
		uniClient: new UniswapV2IndexerClient(addrs.uniswapV2IndexerProxy, { rpcUrl: input.rpcUrl, chain: input.chain }),
		goldrushClient: initGoldrushClient({ rpcUrl: input.rpcUrl, chain: input.chain }),
	};
}

export function buildOnChain<TChain extends Chain | undefined = Chain | undefined>(
	inputs: Array<NetworkInput<TChain>>,
): Array<NetworkClients<TChain>> {
	return inputs.map((i) => buildOnChainForNetwork(i));
}


