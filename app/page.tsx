"use client"

import { Button } from "@/components/ui/button";
import { useFundWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import { decodeFunctionResult, encodeFunctionData, parseEther } from "viem";

const abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newValue",
        type: "uint256",
      },
    ],
    name: "setX",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getX",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export default function Home() {
  const { ready, authenticated, login, user, logout } = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);
  const disableLogout = !ready || (ready && !authenticated);
  
  const {ready: walletReady, wallets} = useWallets();
  
  const {fundWallet} = useFundWallet();
  
  const wallet = wallets[0]
  
  const signMessage = async () => {
    const provider = await wallet.getEthereumProvider();
    // * When requesting signatures and transactions from the wallet, you can either choose to interface with the EIP1193 provider directly, or to pass it to a library like wagmi or viem.
    // If you are using multiple wallet connectors like privy embedded wallets AND external wallets then use the standard EIP1193 provider.
    // If you only plan to use external wallets, then you can use wagmi or viem to interact with the wallet.
    const address = wallet.address;
    const message = "This is the message I am signing";
    const signature = await provider.request({
      method: "personal_sign",
      params: [message, address],
    });
    console.log(signature);
  }
  
  const sendTransaction = async () => {
    const provider = await wallet.getEthereumProvider();
    const transactionRequest = {
      to: "0x78db1057A9A1102C3E831E5086B75E9a58e7730c",
      value: parseEther("0.001"),
    };
    const transactionHash = await provider.request({
      method: "eth_sendTransaction",
      params: [transactionRequest],
    });
    console.log(transactionHash);
  }
  
  const callSmartContract = async () => {
    const provider = await wallet.getEthereumProvider();
    const data = encodeFunctionData({
      abi,
      functionName: "setX",
      args: [999]
    })
    const transactionRequest = {
      to: "0xEf9f1ACE83dfbB8f559Da621f4aEA72C6EB10eBf", // Contract Address
      data: data,
      // value: parseEther("0.001"), // only for payable functions
    };
    const transactionHash = await provider.request({
      method: "eth_sendTransaction",
      params: [transactionRequest],
    });
    
    console.log(transactionHash);
  }
  
  const getValuesOfSmartContract = async () => {
    const provider = await wallet.getEthereumProvider();
    const data = encodeFunctionData({
      abi,
      functionName: "getX",
    });
    const transactionRequest = {
      to: "0xEf9f1ACE83dfbB8f559Da621f4aEA72C6EB10eBf", // Contract Address
      data: data,
      // value: parseEther("0.001"), // only for payable functions
    };
    const transactionHash = await provider.request({
      method: "eth_call",
      params: [transactionRequest, "latest"],
    });

    console.log(transactionHash);
    
    const value = decodeFunctionResult({
      abi,
      functionName: "getX",
      data: transactionHash,
    });

    console.log("Value of x:", value);
  }
  
  const fundWalletWithEther = async () => {
    await fundWallet(wallet.address);
  }
  
  return (
    <div className={"flex flex-col items-center justify-center h-screen"}>
      <Button onClick={login} disabled={disableLogin}>Login</Button>
      <Button onClick={logout} disabled={disableLogout}>Logout</Button>
      Privy User ID: {!ready ? "Loading..." : authenticated ? user?.id : "Not Authenticated"}
      <br />
      Wallet Address: {!ready ? "Loading..." : walletReady ? wallets[0]?.address : "Not Ready"}
      <br />
      <Button onClick={signMessage}>Sign Message</Button>
      <br />
      <Button onClick={sendTransaction}>Send 0.001 ETH</Button>
      <br />
      <Button onClick={callSmartContract}>Set X to 10</Button>
      <br />
      <Button onClick={getValuesOfSmartContract}>Get X</Button>
      <br />
      <Button onClick={fundWalletWithEther}>Fund Wallet</Button>
    </div>
  );
}

// ! If a user has connected a wallet to your site, **logging the user out will not disconnect their wallet.**Similarly, if a user disconnects their wallet from your site manually, Privy will not automatically log the user out.

// * Etherjs for backend 
// * Viem and Wagmi for react frontend