const { ethers } = require("ethers");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Biconomy = require("@biconomy/mexa").Biconomy;
const contractJSON = require("/workspaces/biconomy/contract/TokenTest.json");
const contractAddress = "0x224fD600B0EBA453dfc40101C27d6A8302714Aaf";

const wallet = {
  address: "0x008b5610513aF153B0974D71D590C339962D1540",
  privateKey:
    "75a09f934b34ac59a874412886d1ace2b5f8ec0d77df9e099956ea9a577d0b57",
};

const main = async () => {
  const providerUrl = "https://rpc-mumbai.maticvigil.com";
  let provider = new HDWalletProvider(wallet.privateKey, providerUrl);
  // const walletProvider = new ethers.providers.Web3Provider(provider);
  const biconomy = new Biconomy(provider, {
    apiKey: "_ILIRa_Mm.bc6242ac-ecc9-404e-b52c-2aebf4714bb9",
    debug: false,
    contractAddresses: [contractAddress],
  });
  await biconomy.init();
  console.log("Biconomy initialized");
  biconomy.on("txHashGenerated", (data) => {
    console.log(data);
  });
  biconomy.on("txMined", (data) => {
    console.log(data);
  });

  const contractInstance = new ethers.Contract(
    contractAddress,
    contractJSON,
    biconomy.ethersProvider
  );
  console.log("Contract instance created");

  // 1. set message
  const setMessageData = await contractInstance.populateTransaction.setMessage(
    "Example done 3"
  );
  let txParams = {
    to: contractAddress,
    data: setMessageData.data,
    from: wallet.address,
    gasLimit: 5000000,
  };
  // Send the signed transaction to the network
  try {
    const txHash = await biconomy.provider.send("eth_sendTransaction", [txParams]);
    console.log("txHash", txHash);
    console.log("Message has been set.");
  } catch (error) {
    console.log("error", error);
  }

  // 2. update supply
  const supplyData = await contractInstance.populateTransaction.updateSupply(ethers.BigNumber.from(100));
  txParams = {
    to: contractAddress,
    from: wallet.address,
    data: supplyData.data,
    gasLimit: 5000000,
  };
  // Send the signed transaction to the network
  //  try {
  //    let txHash = await biconomy.ethersProvider.send("eth_sendTransaction", [txParams]);
  //    await biconomy.waitForTransaction(txHash);
  //    console.log("txHash", txHash);
  //    console.log("Supply has been updated.");
  //  } catch (error) {
  //    console.log("error", error)
  //  }
};

main();
