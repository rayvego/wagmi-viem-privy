import type { PrivyClientConfig } from "@privy-io/react-auth";

// Replace this with your Privy config
export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: "users-without-wallets", // create wallet for users without wallets
    requireUserPasswordOnCreate: true,
    noPromptOnSignature: false,
  },
  loginMethods: ["wallet", "email"],
  appearance: {
    showWalletLoginFirst: true,
  },
};
