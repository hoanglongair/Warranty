import { WalletProvider, getProvider } from "@/lib/wallet-connect";
import { ethers } from "ethers";

// Địa chỉ Smart Contract Escrow đã deploy (có thể cập nhật qua .env)
export const WARRANTY_ESCROW_ADDRESS =
  process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS || "0x9F2A8B4C1D7E3F5B8A2C9D4E6F1B7A3C8E2D5F9B";

// ABI giao tiếp với Smart Contract WarrantyEscrow
export const WARRANTY_ESCROW_ABI = [
  "function createEscrow(bytes32 _jobId, address payable _freelancer, address _arbitrator) external payable",
  "function releasePayment(bytes32 _jobId) external",
  "function refundClient(bytes32 _jobId) external",
  "function raiseDispute(bytes32 _jobId) external",
  "function resolveDispute(bytes32 _jobId, uint256 _freelancerShareBps) external",
  "function escrows(bytes32) external view returns (bytes32 jobId, address client, address freelancer, address arbitrator, uint256 amount, uint8 status, uint256 createdAt)",
  "event EscrowCreated(bytes32 indexed jobId, address indexed client, address indexed freelancer, uint256 amount)",
  "event PaymentReleased(bytes32 indexed jobId, address indexed freelancer, uint256 amount)",
  "event DisputeRaised(bytes32 indexed jobId, address indexed raisedBy)"
];

/**
 * Chuyển đổi jobId chuỗi ký tự thành bytes32 cho Solidity
 */
export function formatJobIdToBytes32(jobId: string): string {
  return ethers.id(jobId);
}

/**
 * Nhà tuyển dụng nạp tiền cọc (Deposit Escrow) vào Smart Contract
 */
export async function depositEscrowOnChain(
  walletId: WalletProvider,
  jobId: string,
  freelancerAddress: string,
  amountInEthOrArc: string
): Promise<string> {
  const provider = getProvider(walletId);
  if (!provider) throw new Error("Ví Web3 chưa sẵn sàng.");

  const browserProvider = new ethers.BrowserProvider(provider as ethers.Eip1193Provider);
  const signer = await browserProvider.getSigner();

  const contract = new ethers.Contract(WARRANTY_ESCROW_ADDRESS, WARRANTY_ESCROW_ABI, signer);
  const bytes32JobId = formatJobIdToBytes32(jobId);
  const valueWei = ethers.parseEther(amountInEthOrArc);

  const tx = await contract.createEscrow(
    bytes32JobId,
    freelancerAddress,
    ethers.ZeroAddress, // Arbitrator mặc định
    { value: valueWei }
  );

  await tx.wait();
  return tx.hash;
}

/**
 * Nhà tuyển dụng nghiệm thu & giải ngân 100% tiền cọc cho Freelancer
 */
export async function releasePaymentOnChain(
  walletId: WalletProvider,
  jobId: string
): Promise<string> {
  const provider = getProvider(walletId);
  if (!provider) throw new Error("Ví Web3 chưa sẵn sàng.");

  const browserProvider = new ethers.BrowserProvider(provider as ethers.Eip1193Provider);
  const signer = await browserProvider.getSigner();

  const contract = new ethers.Contract(WARRANTY_ESCROW_ADDRESS, WARRANTY_ESCROW_ABI, signer);
  const bytes32JobId = formatJobIdToBytes32(jobId);

  const tx = await contract.releasePayment(bytes32JobId);
  await tx.wait();
  return tx.hash;
}

/**
 * Kích hoạt Tranh chấp (Dispute) khi xảy ra mâu thuẫn
 */
export async function raiseDisputeOnChain(
  walletId: WalletProvider,
  jobId: string
): Promise<string> {
  const provider = getProvider(walletId);
  if (!provider) throw new Error("Ví Web3 chưa sẵn sàng.");

  const browserProvider = new ethers.BrowserProvider(provider as ethers.Eip1193Provider);
  const signer = await browserProvider.getSigner();

  const contract = new ethers.Contract(WARRANTY_ESCROW_ADDRESS, WARRANTY_ESCROW_ABI, signer);
  const bytes32JobId = formatJobIdToBytes32(jobId);

  const tx = await contract.raiseDispute(bytes32JobId);
  await tx.wait();
  return tx.hash;
}
