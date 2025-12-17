export { getModuleAddresses, addressesByChainId, type ModuleAddresses } from "./contracts/addresses";
export { ERC20_INDEXER_ABI, ADDRESS_INDEXER_ABI, UNISWAP_V2_INDEXER_ABI } from "./contracts/abis";
export { Erc20IndexerClient, type Erc20IndexerGetResult } from "./clients/Erc20IndexerClient";
export { UniswapV2IndexerClient, type PairView } from "./clients/UniswapV2IndexerClient";
export { AddressIndexerClient } from "./clients/AddressIndexerClient";
export type { OnChainConfig } from "./clients/types";
export {
	buildOnChain,
	buildOnChainForNetwork,
	type NetworkInput,
	type NetworkClients,
} from "./clients/OnChainBuilder";
export {
	GoldrushClient,
	initGoldrushClient,
	getGoldrushClient,
} from "./clients/GoldRushClient";
export {
	DexscreenerClient,
	type DexscreenerPairsResponse,
	type DexscreenerPairItem,
	type DexscreenerClientConfig,
} from "./clients/DexscreenerClient";
export {
	StellarExpertClient,
	type StellarExpertClientConfig,
	type StellarExpertAssetResponse,
} from "./clients/StellarExpertClient";
export {
	AptoscanClient,
	type AptoscanClientConfig,
	type AptoscanResponse,
	type AptoscanFungibleAssetData,
} from "./clients/AptoscanClient";
export {
	XrpscanClient,
	type XrpscanClientConfig,
	type XrpscanTokenResponse,
} from "./clients/XrpscanClient";
export {
	AptosIndexerClient,
	type AptosIndexerClientConfig,
	type AptosFungibleAssetMetadata,
} from "./clients/AptosIndexerClient";

export {
	DexguruClient,
	type DexguruClientConfig,
	type DexguruPaginatedParams,
	type DexguruHistoryParams,
} from "./clients/DexguruClient";
export {
	GeckoTerminalClient,
	type GeckoTerminalClientConfig,
	type GeckoTerminalTokenResponse,
	type GeckoTerminalTokenSummary,
} from "./clients/GeckoTerminalClient";
export { buildGeckoTerminalTokenSummary } from "./clients/GeckoTerminalClient";
export { MoralisClient, type MoralisClientConfig, type MoralisERC20TokenResponse } from "./clients/MoralisClient";

export { DefiLlamaClient, type DefiLlamaClientConfig, type DefiLlamaProtocol } from "./clients/DefiLlamaClient";

