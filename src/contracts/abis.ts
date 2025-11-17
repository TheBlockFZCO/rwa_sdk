// Minimal ABI imports from artifacts for runtime usage
import erc20IndexerArtifact from "./chain-1/artifacts/ERC20IndexerModule#ERC20Indexer.json";
import addressIndexerArtifact from "./chain-1/artifacts/AddressIndexerModule#AddressIndexer.json";
import uniswapV2IndexerArtifact from "./chain-1/artifacts/UniswapV2IndexerModule#UniswapV2Indexer.json";
import type { Abi } from "viem";

// Type ABIs explicitly to avoid `as const` on non-literal JSON
export const ERC20_INDEXER_ABI: Abi = erc20IndexerArtifact.abi as unknown as Abi;
export const ADDRESS_INDEXER_ABI: Abi = addressIndexerArtifact.abi as unknown as Abi;
export const UNISWAP_V2_INDEXER_ABI: Abi = uniswapV2IndexerArtifact.abi as unknown as Abi;


