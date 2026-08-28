// WarrantyEscrow deployment script for Arc Testnet
// Usage: npx hardhat run scripts/deploy.js --network arcTestnet
//
// Arc Testnet uses USDC as the native gas token (no ETH).
// USDC contract on Arc Testnet: 0x3600000000000000000000000000000000000000
// See: https://docs.arc.io/arc/references/contract-addresses

const { ethers } = require("hardhat");

// USDC contract address on Arc Testnet (system contract)
const ARC_USDC_TOKEN = "0x3600000000000000000000000000000000000000";

async function main() {
  console.log("=================================================");
  console.log(" Deploying WarrantyEscrow (V2) to Arc Testnet");
  console.log("=================================================\n");

  const [deployer] = await ethers.getSigners();
  console.log(`Deployer address : ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance : ${ethers.formatEther(balance)} native (USDC)`);
  console.log(`USDC contract    : ${ARC_USDC_TOKEN}\n`);

  if (balance === 0n) {
    console.error("Deployer wallet has 0 native balance. Please fund the wallet with testnet USDC first!");
    console.error("   Faucet: https://faucet.circle.com/ (select Arc Testnet)");
    process.exit(1);
  }

  console.log("Deploying WarrantyEscrow contract (with USDC support)...");
  const WarrantyEscrow = await ethers.getContractFactory("WarrantyEscrow");
  const contract = await WarrantyEscrow.deploy(ARC_USDC_TOKEN);
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log(`\nWarrantyEscrow deployed successfully!`);
  console.log(`   Contract address : ${contractAddress}`);
  console.log(`   Network         : Arc Testnet (chainId: 5042002)`);
  console.log(`   Explorer        : https://testnet.arcscan.app/address/${contractAddress}`);

  const owner = await contract.owner();
  const usdcToken = await contract.usdcToken();
  console.log(`\n   Contract owner  : ${owner}`);
  console.log(`   USDC token      : ${usdcToken}`);
  console.log(`   Deployer matches owner: ${owner.toLowerCase() === deployer.address.toLowerCase()}`);

  console.log("\n=================================================");
  console.log(" NEXT STEPS:");
  console.log("=================================================");
  console.log(`1. Copy contract address: ${contractAddress}`);
  console.log(`2. Add to .env:`);
  console.log(`   NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`3. Verify on explorer:`);
  console.log(`   https://testnet.arcscan.app/address/${contractAddress}`);
  console.log(`4. Restart dev server to pick up new env var`);
  console.log("=================================================\n");

  return contractAddress;
}

main()
  .then((address) => {
    console.log(`\nDeployment complete. Address: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nDeployment failed:");
    console.error(error);
    process.exit(1);
  });
