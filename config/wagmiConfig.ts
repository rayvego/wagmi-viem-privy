import { base, baseSepolia, mainnet, sepolia } from "viem/chains";
import { http } from "wagmi";
import { createConfig } from "@privy-io/wagmi";

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia, mainnet, sepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
