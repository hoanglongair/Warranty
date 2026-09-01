import { ethers } from "ethers";
import { WARRANTY_ESCROW_ABI, WARRANTY_ESCROW_ADDRESS, WARRANTY_ESCROW_RPC_URL } from "./escrow-contract";

const iface = new ethers.Interface(WARRANTY_ESCROW_ABI);

/**
 * Verify rằng một transaction hash đã thực sự được mined thành công trên blockchain
 * VÀ là một giao dịch tới đúng contract Escrow.
 *
 * @param txHash hash giao dịch
 * @param opts.expectedEvent tên event bắt buộc phải xuất hiện trong logs (vd "PaymentReleased")
 * @param opts.expectedJobId nếu có, kiểm tra event có đúng bytes32(jobId)
 * @param opts.expectedFrom nếu có, kiểm tra người gửi giao dịch
 */
export async function verifyEscrowTxOnChain(
  txHash: string,
  opts?: {
    expectedEvent?: string;
    expectedJobId?: string;
    expectedFrom?: string;
  }
): Promise<{
  success: boolean;
  status: number | null;
  blockNumber: number | null;
  from: string | null;
  to: string | null;
  error?: string;
}> {
  const fail = (error: string) => ({
    success: false,
    status: null,
    blockNumber: null,
    from: null,
    to: null,
    error,
  });

  if (!txHash || !txHash.startsWith("0x") || txHash.length !== 66) {
    return fail("Invalid tx hash");
  }

  if (!WARRANTY_ESCROW_ADDRESS) {
    return fail("Smart Contract Escrow chưa được cấu hình (NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS)");
  }

  try {
    const provider = new ethers.JsonRpcProvider(WARRANTY_ESCROW_RPC_URL);
    const receipt = await provider.getTransactionReceipt(txHash);

    if (!receipt) {
      return fail("Transaction not found or not yet mined");
    }

    if (receipt.status !== 1) {
      return {
        success: false,
        status: receipt.status,
        blockNumber: receipt.blockNumber,
        from: receipt.from,
        to: receipt.to,
        error: "Transaction reverted on-chain",
      };
    }

    // Giao dịch phải tương tác với đúng contract Escrow
    if (!receipt.to || receipt.to.toLowerCase() !== WARRANTY_ESCROW_ADDRESS.toLowerCase()) {
      return {
        success: false,
        status: receipt.status,
        blockNumber: receipt.blockNumber,
        from: receipt.from,
        to: receipt.to,
        error: "Giao dịch không gửi tới contract Escrow của hệ thống",
      };
    }

    if (opts?.expectedFrom && receipt.from.toLowerCase() !== opts.expectedFrom.toLowerCase()) {
      return {
        success: false,
        status: receipt.status,
        blockNumber: receipt.blockNumber,
        from: receipt.from,
        to: receipt.to,
        error: "Người gửi giao dịch không khớp",
      };
    }

    if (opts?.expectedEvent) {
      const wantJobId = opts.expectedJobId ? ethers.id(opts.expectedJobId) : null;
      let matched = false;

      for (const log of receipt.logs) {
        if (log.address.toLowerCase() !== WARRANTY_ESCROW_ADDRESS.toLowerCase()) continue;
        let parsed;
        try {
          parsed = iface.parseLog({ topics: [...log.topics], data: log.data });
        } catch {
          continue;
        }
        if (!parsed || parsed.name !== opts.expectedEvent) continue;
        if (wantJobId) {
          const evJobId = (parsed.args.jobId ?? "").toString().toLowerCase();
          if (evJobId !== wantJobId.toLowerCase()) continue;
        }
        matched = true;
        break;
      }

      if (!matched) {
        return {
          success: false,
          status: receipt.status,
          blockNumber: receipt.blockNumber,
          from: receipt.from,
          to: receipt.to,
          error: `Không tìm thấy sự kiện ${opts.expectedEvent} hợp lệ trong giao dịch`,
        };
      }
    }

    return {
      success: true,
      status: receipt.status,
      blockNumber: receipt.blockNumber,
      from: receipt.from,
      to: receipt.to,
    };
  } catch (err: unknown) {
    return fail(err instanceof Error ? err.message : "Failed to verify transaction");
  }
}

/**
 * Verify trạng thái escrow on-chain bằng cách đọc trực tiếp `escrows(jobId)`.
 */
export async function verifyEscrowStateOnChain(
  jobId: string,
  expectedEmployer: string,
  expectedAmount?: bigint
): Promise<{
  funded: boolean;
  completed: boolean;
  exists: boolean;
  status?: number;
  employer?: string;
  freelancer?: string;
  amount?: bigint;
  error?: string;
}> {
  if (!WARRANTY_ESCROW_ADDRESS) {
    return { funded: false, completed: false, exists: false, error: "Smart Contract Escrow chưa được cấu hình" };
  }

  try {
    const bytes32JobId = ethers.id(jobId);
    const provider = new ethers.JsonRpcProvider(WARRANTY_ESCROW_RPC_URL);
    const contract = new ethers.Contract(WARRANTY_ESCROW_ADDRESS, WARRANTY_ESCROW_ABI, provider);

    const escrow = await contract.escrows(bytes32JobId);

    const amount = BigInt(escrow.amount);
    const statusNum = Number(escrow.status);
    const exists = amount > 0n;
    const funded = statusNum === 1; // FUNDED = 1
    const completed = statusNum === 2; // COMPLETED = 2

    if (!exists) {
      return { funded: false, completed: false, exists: false, error: "Escrow does not exist" };
    }

    if (escrow.employer.toLowerCase() !== expectedEmployer.toLowerCase()) {
      return {
        funded,
        completed,
        exists,
        status: statusNum,
        employer: escrow.employer,
        error: "Employer address mismatch",
      };
    }

    if (expectedAmount !== undefined && amount < expectedAmount) {
      return {
        funded,
        completed,
        exists,
        status: statusNum,
        employer: escrow.employer,
        amount,
        error: `Escrow amount ${amount} < expected ${expectedAmount}`,
      };
    }

    return {
      funded,
      completed,
      exists,
      status: statusNum,
      employer: escrow.employer,
      freelancer: escrow.freelancer,
      amount,
    };
  } catch (err: unknown) {
    return {
      funded: false,
      completed: false,
      exists: false,
      error: err instanceof Error ? err.message : "Failed to query escrow state",
    };
  }
}
