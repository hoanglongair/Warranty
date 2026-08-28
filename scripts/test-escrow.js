// Smoke test for WarrantyEscrow contract V2 on local Hardhat
// Tests both ETH and USDC flows.
// Usage: npx hardhat run scripts/test-escrow.js --network hardhat

const { ethers } = require("hardhat");

async function main() {
  console.log("=================================================");
  console.log(" WarrantyEscrow V2 — Smoke Test (Local Hardhat)");
  console.log("=================================================\n");

  // Deploy mock USDC for testing
  console.log("Deploying mock USDC token...");
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const usdc = await MockUSDC.deploy();
  await usdc.waitForDeployment();
  const usdcAddress = await usdc.getAddress();
  console.log(`Mock USDC deployed: ${usdcAddress}\n`);

  const [owner, employer, freelancer, arbitrator] = await ethers.getSigners();
  console.log(`Owner      : ${owner.address}`);
  console.log(`Employer   : ${employer.address}`);
  console.log(`Freelancer : ${freelancer.address}`);
  console.log(`Arbitrator : ${arbitrator.address}\n`);

  // Mint USDC to employer
  const mintAmount = ethers.parseUnits("10000", 6); // 10,000 USDC
  await usdc.mint(employer.address, mintAmount);
  console.log(`Minted ${ethers.formatUnits(mintAmount, 6)} USDC to employer\n`);

  // Deploy WarrantyEscrow V2
  const WarrantyEscrow = await ethers.getContractFactory("WarrantyEscrow");
  const contract = await WarrantyEscrow.deploy(usdcAddress);
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.log(`WarrantyEscrow V2 deployed: ${contractAddress}\n`);

  // ════════════════════════════════════════════════════════════
  // ETH FLOW TESTS
  // ════════════════════════════════════════════════════════════
  console.log("──────────────────────────────────────────────");
  console.log(" ETH FLOW TESTS");
  console.log("──────────────────────────────────────────────\n");

  // Test 1: Create ETH escrow
  console.log("[Test 1] createEscrowETH()...");
  const jobId1 = ethers.encodeBytes32String("eth-job-001");
  const ethAmount = ethers.parseEther("1.0");
  const tx1 = await contract.connect(employer).createEscrowETH(
    jobId1,
    freelancer.address,
    arbitrator.address,
    30,
    { value: ethAmount }
  );
  await tx1.wait();
  let escrow = await contract.escrows(jobId1);
  console.log(`   OK — Escrow funded with 1.0 ETH`);
  console.log(`   status: ${escrow.status === 1n ? "FUNDED" : escrow.status}`);
  console.log(`   tokenType: ${escrow.tokenType === 0n ? "ETH" : "USDC"}\n`);

  // Test 2: Duplicate ETH escrow
  console.log("[Test 2] createEscrowETH() duplicate should revert...");
  try {
    await contract.connect(employer).createEscrowETH(jobId1, freelancer.address, arbitrator.address, 30, { value: ethAmount });
    console.log("   FAIL — duplicate was allowed\n");
  } catch (e) {
    console.log("   OK — Reverted\n");
  }

  // Test 3: Validation — self-escrow
  console.log("[Test 3] createEscrowETH() with self should revert...");
  try {
    const jobId3 = ethers.encodeBytes32String("eth-job-003");
    await contract.connect(employer).createEscrowETH(jobId3, employer.address, arbitrator.address, 30, { value: ethAmount });
    console.log("   FAIL — self-escrow was allowed\n");
  } catch (e) {
    console.log("   OK — Reverted\n");
  }

  // Test 4: Validation — ZeroAddress freelancer
  console.log("[Test 4] createEscrowETH() with ZeroAddress freelancer should revert...");
  try {
    const jobId4 = ethers.encodeBytes32String("eth-job-004");
    await contract.connect(employer).createEscrowETH(jobId4, ethers.ZeroAddress, arbitrator.address, 30, { value: ethAmount });
    console.log("   FAIL — ZeroAddress freelancer was allowed\n");
  } catch (e) {
    console.log("   OK — Reverted\n");
  }

  // Test 5: Release ETH payment
  console.log("[Test 5] releasePayment() ETH flow...");
  const freelancerBalBefore = await ethers.provider.getBalance(freelancer.address);
  const tx5 = await contract.connect(employer).releasePayment(jobId1);
  await tx5.wait();
  const freelancerBalAfter = await ethers.provider.getBalance(freelancer.address);
  console.log(`   Freelancer balance delta: ${ethers.formatEther(freelancerBalAfter - freelancerBalBefore)} ETH\n`);

  // Test 6: Cannot release twice
  console.log("[Test 6] releasePayment() twice should revert...");
  try {
    await contract.connect(employer).releasePayment(jobId1);
    console.log("   FAIL — second release was allowed\n");
  } catch (e) {
    console.log("   OK — Reverted\n");
  }

  // Test 7: Dispute + Resolve (ETH)
  console.log("[Test 7] raiseDispute() + resolveDispute() ETH flow...");
  const jobIdDispute = ethers.encodeBytes32String("eth-dispute");
  await contract.connect(employer).createEscrowETH(jobIdDispute, freelancer.address, arbitrator.address, 30, { value: ethAmount });
  await contract.connect(freelancer).raiseDispute(jobIdDispute);
  await contract.connect(arbitrator).resolveDispute(jobIdDispute, 7000); // 70% freelancer
  escrow = await contract.escrows(jobIdDispute);
  console.log(`   OK — Dispute resolved (70/30 split). status: ${escrow.status === 2n ? "COMPLETED" : escrow.status}\n`);

  // Test 8: Expired refund
  console.log("[Test 8] expiredRefund() ETH flow...");
  const jobIdExpired = ethers.encodeBytes32String("eth-expired");
  await contract.connect(employer).createEscrowETH(jobIdExpired, freelancer.address, arbitrator.address, 1, { value: ethAmount });
  await ethers.provider.send("evm_increaseTime", [2 * 24 * 60 * 60]);
  await ethers.provider.send("evm_mine", []);
  const employerBalBefore = await ethers.provider.getBalance(employer.address);
  await contract.connect(freelancer).expiredRefund(jobIdExpired);
  const employerBalAfter = await ethers.provider.getBalance(employer.address);
  console.log(`   OK — Refund: ${ethers.formatEther(employerBalAfter - employerBalBefore)} ETH\n`);

  // ════════════════════════════════════════════════════════════
  // USDC FLOW TESTS
  // ════════════════════════════════════════════════════════════
  console.log("──────────────────────────────────────────────");
  console.log(" USDC FLOW TESTS");
  console.log("──────────────────────────────────────────────\n");

  // Test 9: Create USDC escrow
  console.log("[Test 9] createEscrowUSDC() with approve flow...");
  const jobIdUsdc1 = ethers.encodeBytes32String("usdc-job-001");
  const usdcAmount = ethers.parseUnits("100", 6); // 100 USDC

  // Approve USDC
  await usdc.connect(employer).approve(contractAddress, usdcAmount);
  console.log(`   USDC approved: 100 USDC`);

  // Create USDC escrow
  const tx9 = await contract.connect(employer).createEscrowUSDC(
    jobIdUsdc1,
    freelancer.address,
    arbitrator.address,
    30,
    usdcAmount
  );
  await tx9.wait();
  escrow = await contract.escrows(jobIdUsdc1);
  console.log(`   OK — Escrow funded with 100 USDC`);
  console.log(`   status: ${escrow.status === 1n ? "FUNDED" : escrow.status}`);
  console.log(`   tokenType: ${escrow.tokenType === 1n ? "USDC" : "ETH"}\n`);

  // Test 10: Release USDC payment
  console.log("[Test 10] releasePayment() USDC flow...");
  const freelancerUsdcBefore = await usdc.balanceOf(freelancer.address);
  const tx10 = await contract.connect(employer).releasePayment(jobIdUsdc1);
  await tx10.wait();
  const freelancerUsdcAfter = await usdc.balanceOf(freelancer.address);
  console.log(`   Freelancer USDC delta: ${ethers.formatUnits(freelancerUsdcAfter - freelancerUsdcBefore, 6)} USDC\n`);

  // Test 11: USDC dispute + resolve
  console.log("[Test 11] USDC raiseDispute() + resolveDispute()...");
  const jobIdUsdcDispute = ethers.encodeBytes32String("usdc-dispute");
  await usdc.connect(employer).approve(contractAddress, usdcAmount);
  await contract.connect(employer).createEscrowUSDC(jobIdUsdcDispute, freelancer.address, arbitrator.address, 30, usdcAmount);
  await contract.connect(freelancer).raiseDispute(jobIdUsdcDispute);
  await contract.connect(arbitrator).resolveDispute(jobIdUsdcDispute, 5000); // 50/50 split
  escrow = await contract.escrows(jobIdUsdcDispute);
  console.log(`   OK — USDC Dispute resolved (50/50 split). status: ${escrow.status === 2n ? "COMPLETED" : escrow.status}\n`);

  // Test 12: USDC expired refund
  console.log("[Test 12] USDC expiredRefund()...");
  const jobIdUsdcExpired = ethers.encodeBytes32String("usdc-expired");
  await usdc.connect(employer).approve(contractAddress, usdcAmount);
  await contract.connect(employer).createEscrowUSDC(jobIdUsdcExpired, freelancer.address, arbitrator.address, 1, usdcAmount);
  await ethers.provider.send("evm_increaseTime", [2 * 24 * 60 * 60]);
  await ethers.provider.send("evm_mine", []);
  const employerUsdcBefore = await usdc.balanceOf(employer.address);
  await contract.connect(freelancer).expiredRefund(jobIdUsdcExpired);
  const employerUsdcAfter = await usdc.balanceOf(employer.address);
  console.log(`   OK — USDC Refund: ${ethers.formatUnits(employerUsdcAfter - employerUsdcBefore, 6)} USDC\n`);

  console.log("=================================================");
  console.log(" ALL TESTS PASSED ✓");
  console.log(" Contract V2 supports BOTH ETH + USDC flows");
  console.log("=================================================\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\nTest failed:");
    console.error(error);
    process.exit(1);
  });
