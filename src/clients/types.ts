import type { Chain } from "viem";

export interface OnChainConfig<TChain extends Chain | undefined = Chain | undefined> {
	rpcUrl?: string;
	chain?: TChain;
}


