import type { Address } from "viem";

// Import deployed addresses for supported chains
import chain1 from "./chain-1/deployed_addresses.json";
import chain10 from "./chain-10/deployed_addresses.json";
import chain56 from "./chain-56/deployed_addresses.json";
import chain137 from "./chain-137/deployed_addresses.json";
import chain146 from "./chain-146/deployed_addresses.json";
import chain42161 from "./chain-42161/deployed_addresses.json";
import chain43114 from "./chain-43114/deployed_addresses.json";
import chain8453 from "./chain-8453/deployed_addresses.json";

export interface ModuleAddresses {
	erc20IndexerProxy: Address;
	uniswapV2IndexerProxy: Address;
	addressIndexerProxy: Address;
}

type RawAddresses = Record<string, string>;

function extractProxies(raw: RawAddresses): ModuleAddresses {
	const erc20IndexerProxy = raw["ERC20IndexerModule#IndexerProxy"] as Address | undefined;
	const uniswapV2IndexerProxy = raw["UniswapV2IndexerModule#IndexerProxy"] as Address | undefined;
	const addressIndexerProxy = raw["AddressIndexerModule#IndexerProxy"] as Address | undefined;

	if (!erc20IndexerProxy || !uniswapV2IndexerProxy || !addressIndexerProxy) {
		throw new Error("Missing one or more IndexerProxy addresses in deployed_addresses.json");
	}

	return { erc20IndexerProxy, uniswapV2IndexerProxy, addressIndexerProxy };
}

export const addressesByChainId: Record<number, ModuleAddresses> = {
	1: extractProxies(chain1 as unknown as RawAddresses),
	10: extractProxies(chain10 as unknown as RawAddresses),
	56: extractProxies(chain56 as unknown as RawAddresses),
	137: extractProxies(chain137 as unknown as RawAddresses),
	146: extractProxies(chain146 as unknown as RawAddresses),
	42161: extractProxies(chain42161 as unknown as RawAddresses),
	43114: extractProxies(chain43114 as unknown as RawAddresses),
	8453: extractProxies(chain8453 as unknown as RawAddresses),
};

export function getModuleAddresses(chainId: number): ModuleAddresses {
	const entry = addressesByChainId[chainId];
	if (!entry) {
		throw new Error(`Unsupported chain id: ${chainId}`);
	}
	return entry;
}


