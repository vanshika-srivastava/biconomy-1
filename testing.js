const { Biconomy } = require('@biconomy/mexa');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const contractJSON = require('./contract/TokenTest.json');
const contractAddress = '0xe08588168cbA6188a1D34f8Ac79A3D5C49d74bF5';
const { ethers } = require('ethers');
const { Web3Provider } = require('@ethersproject/providers');

const wallet = {
    address: '0x008b5610513aF153B0974D71D590C339962D1540',
    privateKey: '0x75a09f934b34ac59a874412886d1ace2b5f8ec0d77df9e099956ea9a577d0b57',
}

const providerUrl = 'https://polygon-mumbai.infura.io/v3/420c0da0eb534c60aaf22d3f58a974e8';

const provider = new HDWalletProvider({
    privateKeys: [wallet.privateKey],
    providerOrUrl: providerUrl
});

const biconomy = new Biconomy(provider, { 
  apiKey: "_ILIRa_Mm.bc6242ac-ecc9-404e-b52c-2aebf4714bb9",
  debug: true,
  contractAddresses: [contractAddress]
});

const web3 = new Web3(biconomy.provider);
const contract = new web3.eth.Contract(contractJSON.abi, contractAddress);

updateSupply("100000");

async function setUp() {
    // Calculate the nonce for the transaction
    const nonce = await web3.eth.getTransactionCount(wallet.address);
    return nonce;
}

async function updateSupply(supply) {
    const nonce = await setUp();
    
    // Define the transaction parameters
    const txParams = {
        nonce: nonce,
        gasPrice: '10000000000', // 10 GWEI
        gas: '3000000',
        from: wallet.address,
        to: contractAddress,
        value: '0',
        data: contract.methods.updateSupply(web3.utils.toWei(supply, 'ether')).encodeABI(),
    };
    // Sign the transaction
    const signedTx = await web3.eth.accounts.signTransaction(txParams, wallet.privateKey);
    // Send the signed transaction to the Ethereum network
    web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        .catch(console.error);

    console.log("Supply has been updated.")
}