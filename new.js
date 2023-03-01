const { Biconomy } = require("@biconomy/mexa");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

const contractAddress = "0x09fB1d78a86E578dBD5C84844BA3fCBFB3911926";
const contractJSON = require("./contract/TokenTest.json");

const wallet = {
	address: "0x008b5610513aF153B0974D71D590C339962D1540",
	privateKey: "0x75a09f934b34ac59a874412886d1ace2b5f8ec0d77df9e099956ea9a577d0b57"
};

const providerUrl = "https://polygon-mumbai.infura.io/v3/420c0da0eb534c60aaf22d3f58a974e8";

const provider = new HDWalletProvider({
	privateKeys: [wallet.privateKey],
	providerOrUrl: providerUrl
});

// console.log(provider);

const biconomy = new Biconomy(provider, {
	apiKey: "_ILIRa_Mm.bc6242ac-ecc9-404e-b52c-2aebf4714bb9",
	debug: false,
	contractAddresses: [contractAddress]
});

const web3 = new Web3(biconomy.provider);
const rpc = new Web3(providerUrl).eth;

const contract = new web3.eth.Contract(contractJSON.abi, contractAddress, web3);

updateSupply("100000");
// setTrustedForwarder("0x69015912AA33720b842dCD6aC059Ed623F28d9f7");
// transferFrom("0x0052342700c0649A1F85D4D4a93465BFA5f9ce4c", "100000");

async function updateSupply(supply) {
	await biconomy.init();

	const txParams = {
		chainId: await rpc.getChainId(),
		nonce: await rpc.getTransactionCount(wallet.address),
		gasPrice: "10000000000", // 10 GWEI
		gas: "3000000",
		from: wallet.address,
		to: contractAddress,
		value: "0",
		data: contract.methods
			.updateSupply(web3.utils.toWei(supply, "ether"))
			.encodeABI()
	};

	// Sign the transaction
	const signedTx = await web3.eth.accounts.signTransaction(
		txParams,
		wallet.privateKey
	);
	// Send the signed transaction to the Ethereum network
	web3.eth.sendSignedTransaction(signedTx.rawTransaction).catch(console.error);

	console.log("Supply has been updated.");
}

async function setTrustedForwarder(address) {

	const txParams = {
		chainId: await rpc.getChainId(),
		nonce: await rpc.getTransactionCount(wallet.address),
		gasPrice: "10000000000", // 10 GWEI
		gas: "3000000",
		from: wallet.address,
		to: contractAddress,
		value: "0",
		data: contract.methods
			.setTrustedForwarder(address)
			.encodeABI()
	};

	// Sign the transaction
	const signedTx = await web3.eth.accounts.signTransaction(
		txParams,
		wallet.privateKey
	);
	// Send the signed transaction to the Ethereum network
	web3.eth.sendSignedTransaction(signedTx.rawTransaction).catch(console.error);

	console.log("Address has been set.");
}

async function transferFrom(addressTo, amount) {
	await biconomy.init();

	const txParams = {
		chainId: await rpc.getChainId(),
		nonce: await rpc.getTransactionCount(wallet.address),
		gasPrice: "10000000000", // 10 GWEI
		gas: "3000000",
		from: wallet.address,
		to: contractAddress,
		value: "0",
		data: contract.methods
			.transfer(addressTo, web3.utils.toWei(amount, 'ether'))
			.encodeABI()
	};

	// Sign the transaction
	const signedTx = await web3.eth.accounts.signTransaction(
		txParams,
		wallet.privateKey
	);
	// Send the signed transaction to the Ethereum network
	web3.eth.sendSignedTransaction(signedTx.rawTransaction).catch(console.error);

	console.log("Transfer has been completed.");
}