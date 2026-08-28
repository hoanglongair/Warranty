import { getProvider } from "@/lib/wallet-connect";
import type { WalletProvider } from "@/types";
import { ethers } from "ethers";

export interface SIWEUser {
  walletAddress: string;
  name?: string;
  role?: string;
  avatar?: string;
  rating?: number;
}

export async function loginWithSiwe(
  walletId: WalletProvider,
  walletAddress: string
): Promise<SIWEUser> {
  // Ensure EIP-55 checksum format via ethers.getAddress
  const checksumAddress = ethers.getAddress(walletAddress);
  console.log("[SIWE] === START === wallet:", checksumAddress, "provider:", walletId);

  const provider = getProvider(walletId);
  if (!provider) {
    throw new Error("Không tìm thấy tiện ích ví trên trình duyệt.");
  }

  // 1. Lấy mã Nonce từ API Backend
  const nonceRes = await fetch("/api/auth/nonce");
  console.log("[SIWE] Nonce response status:", nonceRes.status);
  if (!nonceRes.ok) throw new Error("Không thể lấy mã khởi tạo đăng nhập (nonce).");
  const { nonce } = await nonceRes.json();
  console.log("[SIWE] Got nonce:", nonce ? "OK" : "MISSING");

  // 2. Dựng thông điệp SIWE (Sign-In with Ethereum) theo chuẩn EIP-4361
  const domain = window.location.host.toLowerCase();
  const origin = window.location.origin.toLowerCase();
  const statement = "Xác nhận đăng nhập vào hệ thống Warranty bằng ví Web3 của bạn.";
  const issuedAt = new Date().toISOString();

  console.log("[SIWE] Creating SiweMessage with:", { domain, origin, address: checksumAddress, nonce: nonce ? "OK" : "MISSING" });

  try {
    // Chuỗi định dạng EIP-4361 tiêu chuẩn
    const messageToSign = [
      `${domain} wants you to sign in with your Ethereum account:`,
      checksumAddress,
      '',
      statement,
      '',
      `URI: ${origin}`,
      `Version: 1`,
      `Chain ID: 1`,
      `Nonce: ${nonce}`,
      `Issued At: ${issuedAt}`
    ].join('\n');

    console.log("[SIWE] Message to sign:\n" + messageToSign);

    // 3. Gọi Ví Web3 yêu cầu ký tên
    const signature = (await provider.request({
      method: "personal_sign",
      params: [messageToSign, checksumAddress]
    })) as string;
    console.log("[SIWE] Got signature:", signature ? "OK" : "MISSING");

    // 4. Gửi Chữ ký tới API để verify & cấp JWT
    const verifyRes = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: messageToSign, signature })
    });
    console.log("[SIWE] Verify response status:", verifyRes.status);

    const data = await verifyRes.json();
    console.log("[SIWE] Verify response data:", JSON.stringify(data).substring(0, 200));

    if (!verifyRes.ok || !data.success) {
      throw new Error(data.error || "Xác thực chữ ký ví thất bại.");
    }

    console.log("[SIWE] Login SUCCESS for:", walletAddress);
    if (data.token && typeof window !== "undefined") {
      localStorage.setItem("warranty_token", data.token);
    }
    return data.user;
  } catch (err) {
    const errObj = err as { code?: number; message?: string };
    if (errObj?.code === 4001 || String(err).includes("rejected")) {
      console.warn("[SIWE] User rejected the signing request.");
    } else {
      console.error("[SIWE] ERROR in SiweMessage/sign/verify:", err);
    }
    throw err;
  }
}

export async function logoutSiwe(): Promise<void> {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch (err) {
    console.error("[SIWE] Logout request failed:", err);
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("warranty_token");
      localStorage.removeItem("warranty-wallet");
    }
  }
}

export async function checkAuthStatus(): Promise<SIWEUser | null> {
  try {
    const res = await fetch("/api/auth/me");
    if (!res.ok) return null;
    const data = await res.json();
    return data.authenticated ? data.user : null;
  } catch (err) {
    console.error("[SIWE] Check auth status failed:", err);
    return null;
  }
}

