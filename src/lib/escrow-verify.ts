import { ethers } from "ethers";
import { WARRANTY_ESCROW_ABI, WARRANTY_ESCROW_ADDRESS, WARRANTY_ESCROW_RPC_URL } from "./escrow-contract";

/**
 * Verify rằng một transaction hash đã thực sự được mined thành công trên blockchain.
 * Trả về { success, status, blockNumber, from, to, error? }.
 */
export async function verifyEscrowTxOnChain(
  txHash: string
): Promise<{
  success: boolean;
  status: number | null;
  blockNumber: number | null;
  from: string | null;
  to: string | null;
  error?: string;
}> {
  if (!txHash || !txHash.startsWith("0x") || txHash.length !== 66) {
    return { success: false, status: null, blockNumber: null, from: null, to: null, error: "Invalid tx hash" };
  }

  if (!WARRANTY_ESCROW_ADDRESS) {
    return {
      success: false,
      status: null,
      blockNumber: null,
      from: null,
      to: null,
      error: "Smart Contract Escrow chưa được cấu hình (NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS)",
    };
  }

  try {
    const provider = new ethers.JsonRpcProvider(WARRANTY_ESCROW_RPC_URL);
    const receipt = await provider.getTransactionReceipt(txHash);

    if (!receipt) {
      return {
        success: false,
        status: null,
        blockNumber: null,
        from: null,
        to: null,
        error: "Transaction not found or not yet mined",
      };
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

    return {
      success: true,
      status: receipt.status,
      blockNumber: receipt.blockNumber,
      from: receipt.from,
      to: receipt.to,
    };
  } catch (err: any) {
    return {
      success: false,
      status: null,
      blockNumber: null,
      from: null,
      to: null,
      error: err?.message || "Failed to verify transaction",
    };
  }
}

/**
 * Verify escrow đã thực sự FUNDED trên smart contract.
 */
export async function verifyEscrowStateOnChain(
  jobId: string,
  expectedEmployer: string,
  expectedAmount?: bigint
): Promise<{
  funded: boolean;
  exists: boolean;
  status?: number;
  employer?: string;
  freelancer?: string;
  amount?: bigint;
  error?: string;
}> {
  if (!WARRANTY_ESCROW_ADDRESS) {
    return { funded: false, exists: false, error: "Smart Contract Escrow chưa được cấu hình" };
  }

  try {
    const bytes32JobId = ethers.id(jobId);
    const provider = new ethers.JsonRpcProvider(WARRANTY_ESCROW_RPC_URL);
    const contract = new ethers.Contract(WARRANTY_ESCROW_ADDRESS, WARRANTY_ESCROW_ABI, provider);

    const escrow = await contract.escrows(bytes32JobId);

    const exists = escrow.amount > 0n;
    const funded = escrow.status === 1; // FUNDED = 1

    if (!exists) {
      return { funded: false, exists: false, error: "Escrow does not exist" };
    }

    if (escrow.employer.toLowerCase() !== expectedEmployer.toLowerCase()) {
      return {
        funded,
        exists,
        status: Number(escrow.status),
        employer: escrow.employer,
        error: "Employer address mismatch",
      };
    }

    if (expectedAmount !== undefined && escrow.amount < expectedAmount) {
      return {
        funded,
        exists,
        status: Number(escrow.status),
        employer: escrow.employer,
        amount: escrow.amount,
        error: `Escrow amount ${escrow.amount} < expected ${expectedAmount}`,
      };
    }

    return {
      funded,
      exists,
      status: Number(escrow.status),
      employer: escrow.employer,
      freelancer: escrow.freelancer,
      amount: escrow.amount,
    };
  } catch (err: any) {
    return {
      funded: false,
      exists: false,
      error: err?.message || "Failed to query escrow state",
    };
  }
}
