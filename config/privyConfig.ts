import type { PrivyClientConfig } from "@privy-io/react-auth";
import { base, baseSepolia, mainnet, sepolia } from "viem/chains";

// Replace this with your Privy config
export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: "users-without-wallets", // users-without-wallets, all-users, off
    requireUserPasswordOnCreate: false,
    noPromptOnSignature: false,
  },
  defaultChain: sepolia,
  supportedChains: [baseSepolia, base, mainnet, sepolia],
  loginMethods: ["wallet", "email"],
  appearance: {
    showWalletLoginFirst: true,
  },
};
