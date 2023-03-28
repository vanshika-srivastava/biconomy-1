const { ethers } = require("ethers");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Biconomy = require("@biconomy/mexa").Biconomy;
const contractJSON = require("./contract/TokenTest.json");
const contractAddress = "0x4779494886dD9761CC9CB54FE757686a346112b0";

const wallet = {
  address: "0x008b5610513aF153B0974D71D590C339962D1540",
  privateKey:"75a09f934b34ac59a874412886d1ace2b5f8ec0d77df9e099956ea9a577d0b57",
};

const main = async () => {
  const providerUrl = "https://rpc-mumbai.maticvigil.com";
  let provider = new HDWalletProvider(wallet.privateKey, providerUrl);
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
    contractJSON.abi,
    biconomy.ethersProvider
  );
  console.log("Contract instance created");

  // 1. set message
  const setMessageData = await contractInstance.populateTransaction.setMessage("Example done 3");
  const supplyData = await contractInstance.populateTransaction.updateSupply(ethers.utils.parseEther("1000000"));
  const transfer = await contractInstance.populateTransaction.transferTokens(wallet.address, ethers.utils.parseEther("1000000"));

  txParams = {
    to: contractAddress,
    from: wallet.address,
    data: setMessageData.data
  };
  // Send the signed transaction to the network
    try {
      let txHash = biconomy.provider.send("eth_sendTransaction", [txParams]);
      console.log("txHash", txHash);
      console.log("Supply has been updated.");
    } catch (error) {
      console.log("error", error)
    }
};

main();
