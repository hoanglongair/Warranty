import type { WalletProvider } from "@/types";
import { getProvider } from "@/lib/wallet-connect";
import { ethers } from "ethers";

// ============================================================
// Smart Contract Configuration
// ============================================================
// Địa chỉ contract ESCROW — BẮT BUỘC phải được set trong .env
// Lấy từ: npx hardhat run scripts/deploy.js --network arcTestnet
const ESCROW_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS;
const ARC_RPC_URL = process.env.NEXT_PUBLIC_ARC_RPC_URL || "https://rpc.testnet.arc.network";

// Validate on module load — fail-fast nếu thiếu cấu hình
if (!ESCROW_CONTRACT_ADDRESS) {
  const errorMsg = [
    "",
    "═════════════════════════════════════════════════════════════════",
    " FATAL: NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS is NOT set!",
    "═════════════════════════════════════════════════════════════════",
    "",
    " Hệ thống KHÔNG thể gửi tiền tới địa chỉ hardcode nữa — bắt buộc",
    " phải deploy Smart Contract Escrow thật trước.",
    "",
    " Cách fix:",
    "   1. Thêm DEPLOYER_PRIVATE_KEY vào .env (test wallet có ETH testnet)",
    "   2. Chạy:  npm run deploy:arcTestnet",
    "   3. Copy địa chỉ contract in ra → dán vào .env:",
    "      NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=0x...",
    "   4. Khởi động lại dev server",
    "",
    "═════════════════════════════════════════════════════════════════",
  ].join("\n");

  if (typeof window === "undefined") {
    // Server-side: log warning chỉ
    console.error(errorMsg);
  } else {
    // Client-side: throw error để block deposit flow ngay từ đầu
    throw new Error(errorMsg);
  }
}

// Đảm bảo address hợp lệ (42 ký tự, bắt đầu bằng 0x)
if (ESCROW_CONTRACT_ADDRESS && !ethers.isAddress(ESCROW_CONTRACT_ADDRESS)) {
  throw new Error(
    `[ESCROW CONFIG] Invalid NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS: "${ESCROW_CONTRACT_ADDRESS}". Must be a valid Ethereum address (42 chars, 0x-prefixed).`
  );
}

export const WARRANTY_ESCROW_ADDRESS = ESCROW_CONTRACT_ADDRESS as `0x${string}`;
export const WARRANTY_ESCROW_RPC_URL = ARC_RPC_URL;

/**
 * Cảnh báo: Contract address KHÔNG được là EOA (externally-owned account).
 * Nếu address không có code → deposit sẽ fail hoặc tiền sẽ bị mất.
 */
export async function verifyContractHasCode(): Promise<boolean> {
  try {
    const provider = new ethers.JsonRpcProvider(ARC_RPC_URL);
    const code = await provider.getCode(WARRANTY_ESCROW_ADDRESS);
    return code !== "0x" && code.length > 2;
  } catch (err) {
    console.error("[ESCROW VERIFY] Could not verify contract code:", err);
    return false;
  }
}

// ABI giao tiếp với Smart Contract WarrantyEscrow (V2 — hỗ trợ ETH + USDC)
export const WARRANTY_ESCROW_ABI = [
  // Constructor
  "constructor(address _usdcToken)",

  // Owner functions
  "function owner() external view returns (address)",
  "function usdcToken() external view returns (address)",
  "function setUsdcToken(address _usdcToken) external",

  // Escrow creation
  "function createEscrowETH(bytes32 _jobId, address payable _freelancer, address _arbitrator, uint256 _durationDays) external payable",
  "function createEscrowUSDC(bytes32 _jobId, address payable _freelancer, address _arbitrator, uint256 _durationDays, uint256 _amount) external",

  // Escrow actions
  "function releasePayment(bytes32 _jobId) external",
  "function refundEmployer(bytes32 _jobId) external",
  "function raiseDispute(bytes32 _jobId) external",
  "function resolveDispute(bytes32 _jobId, uint256 _freelancerShareBps) external",
  "function expiredRefund(bytes32 _jobId) external",

  // Views
  "function escrows(bytes32) external view returns (bytes32 jobId, address employer, address freelancer, address arbitrator, uint256 amount, uint256 deadline, uint8 status, uint8 tokenType, address tokenAddress, uint256 createdAt)",

  // Events
  "event EscrowCreated(bytes32 indexed jobId, address indexed employer, address indexed freelancer, uint256 amount, uint256 deadline, uint8 tokenType, address tokenAddress)",
  "event PaymentReleased(bytes32 indexed jobId, address indexed freelancer, uint256 amount)",
  "event RefundIssued(bytes32 indexed jobId, address indexed employer, uint256 amount)",
  "event DisputeRaised(bytes32 indexed jobId, address indexed raisedBy)",
  "event DisputeResolved(bytes32 indexed jobId, uint256 freelancerAmount, uint256 employerAmount)",
  "event ExpiredRefunded(bytes32 indexed jobId, address indexed employer, uint256 amount)",
  "event UsdcTokenUpdated(address indexed oldToken, address indexed newToken)",
];

export enum EscrowStatus {
  CREATED = 0,
  FUNDED = 1,
  COMPLETED = 2,
  DISPUTED = 3,
  REFUNDED = 4,
}

export enum TokenType {
  ETH = 0,
  USDC = 1,
}

/**
 * Địa chỉ USDC contract trên Arc Testnet (native USDC — system contract).
 * Source: https://docs.arc.io/arc/references/contract-addresses
 */
export const ARC_USDC_TOKEN_ADDRESS = "0x3600000000000000000000000000000000000000";
export const USDC_DECIMALS = 6; // USDC ERC-20 interface dùng 6 decimals trên Arc

/**
 * Chuyển đổi jobId chuỗi ký tự thành bytes32 cho Solidity
 */
export function formatJobIdToBytes32(jobId: string): string {
  return ethers.id(jobId);
}

/**
 * Verify transaction receipt on-chain — đảm bảo tx đã thành công (status === 1).
 * Trả về receipt nếu thành công, throw error nếu revert.
 */
async function verifyTransaction(
  txHash: string,
  browserProvider: ethers.BrowserProvider
): Promise<ethers.TransactionReceipt> {
  const receipt = await browserProvider.waitForTransaction(txHash, 1, 60_000);
  if (!receipt) {
    throw new Error("Không nhận được transaction receipt từ blockchain.");
  }
  if (receipt.status !== 1) {
    throw new Error("Giao dịch đã bị revert trên blockchain (status = 0). Vui lòng thử lại.");
  }
  return receipt;
}

/**
 * Verify on-chain escrow state — đảm bảo escrow đã thực sự FUNDED.
 */
async function verifyEscrowFunded(
  bytes32JobId: string,
  expectedEmployer: string,
  expectedAmount: bigint
): Promise<void> {
  const contract = new ethers.Contract(
    WARRANTY_ESCROW_ADDRESS,
    WARRANTY_ESCROW_ABI,
    new ethers.JsonRpcProvider(ARC_RPC_URL)
  );

  let escrow: any = null;
  // Retry 4 lần (mỗi lần cách nhau 1.5 giây) để chờ RPC Node cập nhật On-chain State
  for (let attempt = 1; attempt <= 4; attempt++) {
    escrow = await contract.escrows(bytes32JobId);
    if (Number(escrow.status) === EscrowStatus.FUNDED) {
      break;
    }
    if (attempt < 4) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  const currentStatus = Number(escrow.status);
  if (currentStatus !== EscrowStatus.FUNDED) {
    throw new Error(`Escrow không ở trạng thái FUNDED (hiện tại: ${currentStatus}).`);
  }
  if (escrow.employer.toLowerCase() !== expectedEmployer.toLowerCase()) {
    throw new Error("Địa chỉ ví Employer trong escrow không khớp.");
  }
  if (BigInt(escrow.amount) < expectedAmount) {
    throw new Error(`Số tiền escrow (${escrow.amount}) nhỏ hơn số tiền ký quỹ (${expectedAmount}).`);
  }
}

/**
 * Nhà tuyển dụng nạp tiền cọc USDC vào Smart Contract Escrow (Arc Testnet).
 * @param walletId Loại ví (MetaMask/OKX/Coinbase/etc.)
 * @param jobId ID duy nhất của job
 * @param freelancerAddress Địa chỉ ví Freelancer (BẮT BUỘC, không được là address(0))
 * @param amountUsdc Số USDC ký quỹ (chuỗi, vd: "20" = 20 USDC)
 * @param durationDays Thời hạn escrow tính bằng ngày (mặc định 30 ngày)
 */
export async function depositEscrowOnChain(
  walletId: WalletProvider,
  jobId: string,
  freelancerAddress: string,
  amountUsdc: string,
  durationDays: number = 30
): Promise<string> {
  // FAIL-FAST: không cho phép deposit nếu thiếu contract config
  if (!WARRANTY_ESCROW_ADDRESS) {
    throw new Error(
      "Hệ thống chưa được cấu hình Smart Contract Escrow. Vui lòng liên hệ Admin để deploy contract và cập nhật NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS."
    );
  }

  // Validate freelancer address - không cho phép ZeroAddress
  if (!freelancerAddress || freelancerAddress === ethers.ZeroAddress) {
    throw new Error(
      "Địa chỉ ví Freelancer là bắt buộc. Vui lòng chờ Freelancer ứng tuyển trước khi nạp cọc Escrow."
    );
  }

  // Verify contract đã deploy (có bytecode)
  const hasCode = await verifyContractHasCode();
  if (!hasCode) {
    throw new Error(
      `Smart Contract tại ${WARRANTY_ESCROW_ADDRESS} chưa được deploy hoặc không có bytecode. Hãy kiểm tra lại NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS.`
    );
  }

  const provider = getProvider(walletId);
  if (!provider) throw new Error("Ví Web3 chưa sẵn sàng. Vui lòng kết nối ví MetaMask hoặc OKX Wallet.");

  const browserProvider = new ethers.BrowserProvider(provider as ethers.Eip1193Provider);
  const signer = await browserProvider.getSigner();

  // Validate amount - convert sang USDC units (6 decimals)
  const amountStr = amountUsdc && !isNaN(Number(amountUsdc)) ? amountUsdc.toString() : "20";
  const amountUsdcWei = ethers.parseUnits(amountStr, USDC_DECIMALS);

  // Validate duration
  const safeDuration = Math.max(1, Math.min(365, durationDays || 30));

  try {
    const bytes32JobId = formatJobIdToBytes32(jobId);

    // ─── BƯỚC 1: Approve USDC cho contract Escrow ────────────────
    const usdcContract = new ethers.Contract(ARC_USDC_TOKEN_ADDRESS, [
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function allowance(address owner, address spender) external view returns (uint256)",
      "function balanceOf(address account) external view returns (uint256)",
    ], signer);

    // Kiểm tra balance USDC trước
    const employerAddress = await signer.getAddress();
    const usdcBalance = await usdcContract.balanceOf(employerAddress);
    if (usdcBalance < amountUsdcWei) {
      throw new Error(
        `Ví chỉ có ${ethers.formatUnits(usdcBalance, USDC_DECIMALS)} USDC, không đủ để ký quỹ ${amountStr} USDC. Lấy thêm USDC testnet tại https://faucet.circle.com/`
      );
    }

    // Approve (chỉ approve nếu allowance hiện tại < amount cần)
    const currentAllowance: bigint = await usdcContract.allowance(employerAddress, WARRANTY_ESCROW_ADDRESS);
    if (currentAllowance < amountUsdcWei) {
      const approveTx = await usdcContract.approve(WARRANTY_ESCROW_ADDRESS, amountUsdcWei);
      await verifyTransaction(approveTx.hash, browserProvider);
      console.log(`[ESCROW] USDC approved: ${amountStr} USDC`);
    }

    // ─── BƯỚC 2: Kiểm tra Escrow đã tồn tại on-chain chưa ───────
    const contract = new ethers.Contract(WARRANTY_ESCROW_ADDRESS, WARRANTY_ESCROW_ABI, signer);
    const existingEscrow = await contract.escrows(bytes32JobId);
    if (Number(existingEscrow.status) === EscrowStatus.FUNDED) {
      console.log(`[ESCROW] Job ${jobId} đã tồn tại tiền cọc Escrow on-chain! Skipping creation.`);
      return "0x_already_funded_on_chain";
    }

    const tx = await contract.createEscrowUSDC(
      bytes32JobId,
      freelancerAddress,
      ethers.ZeroAddress, // arbitrator sẽ fallback về owner trong contract
      safeDuration,
      amountUsdcWei
    );

    // Verify transaction thành công on-chain
    const receipt = await verifyTransaction(tx.hash, browserProvider);

    // Verify escrow state trên contract (defensive check)
    await verifyEscrowFunded(bytes32JobId, employerAddress, amountUsdcWei);

    return receipt.hash;
  } catch (err: any) {
    console.error("Giao dịch cọc USDC Escrow thất bại:", err);

    if (err?.code === 4001 || err?.message?.includes("user rejected")) {
      throw new Error("Bạn đã từ chối ký xác nhận giao dịch trên ví Web3.");
    }

    if (err?.reason?.includes("Escrow already exists") || err?.message?.includes("Escrow already exists")) {
      throw new Error("Khoản cọc Escrow cho công việc này đã được nạp thành công trước đó on-chain.");
    }

    if (err?.shortMessage?.includes("reverted")) {
      throw new Error(`Smart Contract từ chối: ${err.shortMessage}.`);
    }

    throw new Error(err?.reason || err?.message || "Giao dịch nạp cọc Escrow không thành công.");
  }
}

/**
 * Nhà tuyển dụng nghiệm thu & giải ngân 100% tiền cọc cho Freelancer
 */
export async function releasePaymentOnChain(
  walletId: WalletProvider,
  jobId: string
): Promise<string> {
  if (!WARRANTY_ESCROW_ADDRESS) {
    throw new Error("Smart Contract Escrow chưa được cấu hình.");
  }

  const provider = getProvider(walletId);
  if (!provider) throw new Error("Ví Web3 chưa sẵn sàng. Vui lòng kết nối ví.");

  const browserProvider = new ethers.BrowserProvider(provider as ethers.Eip1193Provider);
  const signer = await browserProvider.getSigner();

  try {
    const bytes32JobId = formatJobIdToBytes32(jobId);
    const contract = new ethers.Contract(WARRANTY_ESCROW_ADDRESS, WARRANTY_ESCROW_ABI, signer);
    const tx = await contract.releasePayment(bytes32JobId);
    const receipt = await verifyTransaction(tx.hash, browserProvider);
    return receipt.hash;
  } catch (err: any) {
    console.error("Smart contract release payment error:", err);
    if (err?.code === 4001 || err?.message?.toLowerCase().includes("reject") || err?.message?.toLowerCase().includes("user denied")) {
      throw new Error("Bạn đã từ chối xác nhận giao dịch giải ngân trên ví Web3.");
    }
    throw new Error(err?.reason || err?.message || "Giao dịch nghiệm thu & giải ngân trên Smart Contract không thành công.");
  }
}

/**
 * Kích hoạt Tranh chấp (Dispute) khi xảy ra mâu thuẫn
 */
export async function raiseDisputeOnChain(
  walletId: WalletProvider,
  jobId: string
): Promise<string> {
  if (!WARRANTY_ESCROW_ADDRESS) {
    throw new Error("Smart Contract Escrow chưa được cấu hình.");
  }

  const provider = getProvider(walletId);
  if (!provider) throw new Error("Ví Web3 chưa sẵn sàng. Vui lòng kết nối ví.");

  const browserProvider = new ethers.BrowserProvider(provider as ethers.Eip1193Provider);
  const signer = await browserProvider.getSigner();

  try {
    const bytes32JobId = formatJobIdToBytes32(jobId);
    const contract = new ethers.Contract(WARRANTY_ESCROW_ADDRESS, WARRANTY_ESCROW_ABI, signer);
    const tx = await contract.raiseDispute(bytes32JobId);
    const receipt = await verifyTransaction(tx.hash, browserProvider);
    return receipt.hash;
  } catch (err: any) {
    console.error("Smart contract dispute error:", err);
    if (err?.code === 4001 || err?.message?.toLowerCase().includes("reject") || err?.message?.toLowerCase().includes("user denied")) {
      throw new Error("Bạn đã từ chối xác nhận giao dịch khiếu nại tranh chấp trên ví Web3.");
    }
    throw new Error(err?.reason || err?.message || "Giao dịch yêu cầu khiếu nại tranh chấp trên Smart Contract không thành công.");
  }
}
