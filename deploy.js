// Async functions returns something called Promise, which can be:
// Pending
// Fulfilled
// Rejected

//Ganachi
// http://127.0.0.1:7545

const { Console } = require("console");
const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const abi = fs.readFileSync("SimpleStorage_sol_Storage.abi", "utf8");
    const binary = fs.readFileSync("SimpleStorage_sol_Storage.bin", "utf8");

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("Deploing, please wait...");
    const contract = await contractFactory.deploy();
    const deployReceipt = await contract.deployTransaction.wait(1); // wait utill one block is build, to be sure about the deployment
    //console.log(deployReceipt); Just to see the receipt

    /*
    We can deploy a contract like this:

    const tx = {
        nonce: 5, => means the number of next transaction (its differente from the nonce generated when a block is mined). We could using wallet.getTransactionCount()
        gasPrice: 20000000000,
        gasLimit: 1000000,
        to: null,
        value: 0,
        data: "put here all the contract in binary, preceded by 0X"
        chainId: 331 => Each chain have their own identification number 
    }
    
    const sendTxResponse = await wallet.sendTransaction(tx)
    */
   
    const transactionResponse = await contract.store("7");
    const transactionReceipt = await transactionResponse.wait(1);
    const currentStorageNumber = await contract.retrieve();
    console.log(`Number Storaged: ${currentStorageNumber.toString()}`);


    
    async function storeArray(number){
        const transactionResponseArray = await contract.storeArray(number);
        const transactionReceiptArray = await transactionResponseArray.wait(1);
    }
    
    await storeArray("10");
    await storeArray("15");
    await storeArray("50");
    await storeArray("100");


    async function printArray(){
        let max = await contract.arraylenght();
        for (i=0; i < max; i++){
            const currentStorageNumberArray = await contract.retriveArray(i);
            console.log(`Number Storaged: ${currentStorageNumberArray.toString()}`);
        }
    }
    await printArray();

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error); 
        process.exit(1);
    })