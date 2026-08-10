import { SiweMessage } from "siwe";
import { getProvider } from "@/lib/wallet-connect";
import type { WalletProvider } from "@/types";

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
  const provider = getProvider(walletId);
  if (!provider) {
    throw new Error("Không tìm thấy tiện ích ví trên trình duyệt.");
  }

  // 1. Lấy mã Nonce từ API Backend
  const nonceRes = await fetch("/api/auth/nonce");
  if (!nonceRes.ok) throw new Error("Không thể lấy mã khởi tạo đăng nhập (nonce).");
  const { nonce } = await nonceRes.json();

  // 2. Dựng thông điệp SIWE (Sign-In with Ethereum)
  const domain = window.location.host;
  const origin = window.location.origin;
  const statement = "Xác nhận đăng nhập vào hệ thống Warranty bằng ví Web3 của bạn.";

  const message = new SiweMessage({
    domain,
    address: walletAddress,
    statement,
    uri: origin,
    version: "1",
    chainId: 1,
    nonce
  });

  const messageToSign = message.prepareMessage();

  // 3. Gọi Ví Web3 yêu cầu ký tên
  const signature = (await provider.request({
    method: "personal_sign",
    params: [messageToSign, walletAddress]
  })) as string;

  // 4. Gửi Chữ ký tới API để verify & cấp JWT
  const verifyRes = await fetch("/api/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: messageToSign, signature })
  });

  const data = await verifyRes.json();
  if (!verifyRes.ok || !data.success) {
    throw new Error(data.error || "Xác thực chữ ký ví thất bại.");
  }

  return data.user;
}
