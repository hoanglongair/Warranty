"use client";

import { useState, useEffect, useCallback } from "react";
import { ShieldCheck, UserCheck, UserX, Clock, Building, RefreshCw, AlertCircle } from "lucide-react";
import { useWalletStore } from "@/store/wallet-store";
import { WalletButton } from "@/components/wallet/wallet-button";

interface EmployerReq {
  id: string;
  walletAddress: string;
  companyName: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  user?: {
    name: string | null;
    role: string;
    employerStatus: string;
  };
}

export default function AdminDashboardPage() {
  const { address, connected } = useWalletStore();
  const [requests, setRequests] = useState<EmployerReq[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchRequestsAndProfile = useCallback(async () => {
    setLoading(true);
    try {
      if (address) {
        const profRes = await fetch(`/api/profile/${address}`);
        const profData = await profRes.json();
        if (profData.success) {
          setUserRole(profData.profile.role);
        }
      }

      const res = await fetch("/api/admin/employer-requests");
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests || []);
      }
    } catch {
      console.error("Fetch admin data error");
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchRequestsAndProfile();
  }, [fetchRequestsAndProfile]);

  const handleAction = async (requestId: string, walletAddr: string, action: "APPROVE" | "REJECT") => {
    setProcessingId(requestId);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/employer-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, walletAddress: walletAddr, action })
      });
      const data = await res.json();

      if (data.success) {
        setMessage({
          text: action === "APPROVE" ? `Đã phê duyệt role EMPLOYER cho ví ${walletAddr.slice(0, 6)}...` : `Đã từ chối yêu cầu của ví ${walletAddr.slice(0, 6)}...`,
          type: "success"
        });
        await fetchRequestsAndProfile();
      } else {
        setMessage({ text: data.error || "Thao tác thất bại.", type: "error" });
      }
    } catch {
      setMessage({ text: "Lỗi kết nối máy chủ.", type: "error" });
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;
  const approvedCount = requests.filter((r) => r.status === "APPROVED").length;

  return (
    <div className="min-h-screen bg-slate-950 pb-20 pt-28 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
              <ShieldCheck className="h-4 w-4" /> System Administration
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Admin Portal - Quản lý Cấp duyệt Employer
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Phê duyệt hoặc từ chối các yêu cầu nâng cấp quyền tài khoản thành Employer từ Freelancer.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchRequestsAndProfile}
              className="glass-card flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Làm mới
            </button>
            <WalletButton />
          </div>
        </div>

        {!connected && (
          <div className="glass-card mt-8 border-amber-500/30 bg-amber-500/10 p-6 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-amber-400" />
            <p className="mt-2 font-medium text-amber-200">Vui lòng kết nối ví để xem và quản trị hệ thống.</p>
          </div>
        )}

        {connected && (
          <>
            {/* Notice banner if current user is not ADMIN yet */}
            {userRole !== "ADMIN" && (
              <div className="glass-card mt-8 border-amber-500/40 bg-amber-500/10 p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-400" />
                  <div>
                    <h3 className="text-lg font-bold text-white">Bạn không có quyền Admin</h3>
                    <p className="mt-1 text-sm text-white/70">
                      Tài khoản ví <span className="font-mono font-semibold text-amber-300">{address}</span> (Role: {userRole || "FREELANCER"}) không có quyền truy cập trang quản trị.
                      Vui lòng liên hệ quản trị viên hệ thống để được cấp quyền.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Notification message */}
            {message && (
              <div
                className={`glass-card mt-6 p-4 text-sm font-medium ${
                  message.type === "success"
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-red-500/40 bg-red-500/10 text-red-300"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Stats Cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="glass-card p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Tổng số Yêu cầu</p>
                <p className="mt-2 font-display text-3xl font-bold text-white">{requests.length}</p>
              </div>
              <div className="glass-card border-amber-500/30 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">Đang chờ Admin duyệt</p>
                <p className="mt-2 font-display text-3xl font-bold text-amber-300">{pendingCount}</p>
              </div>
              <div className="glass-card border-emerald-500/30 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Đã Phê Duyệt Employer</p>
                <p className="mt-2 font-display text-3xl font-bold text-emerald-300">{approvedCount}</p>
              </div>
            </div>

            {/* Requests Table */}
            <div className="glass-card mt-8 overflow-hidden">
              <div className="border-b border-white/10 px-6 py-4">
                <h3 className="font-display text-lg font-bold text-white">Danh sách Yêu cầu Cấp Role Employer</h3>
              </div>

              {loading ? (
                <div className="py-12 text-center text-white/50">Đang tải danh sách yêu cầu...</div>
              ) : requests.length === 0 ? (
                <div className="py-12 text-center text-white/50">Chưa có yêu cầu đăng ký Employer nào.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-white/80">
                    <thead className="border-b border-white/10 bg-white/[0.02] text-xs font-semibold uppercase tracking-wider text-white/50">
                      <tr>
                        <th className="px-6 py-3.5">Ví Đăng Ký</th>
                        <th className="px-6 py-3.5">Công Ty / Tổ Chức</th>
                        <th className="px-6 py-3.5">Mô Tả Nhu Cầu</th>
                        <th className="px-6 py-3.5">Ngày Gửi</th>
                        <th className="px-6 py-3.5">Trạng Thái</th>
                        <th className="px-6 py-3.5 text-right">Thao Tác Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {requests.map((req) => (
                        <tr key={req.id} className="hover:bg-white/[0.02]">
                          <td className="px-6 py-4 font-mono font-medium text-violet-300">
                            {req.walletAddress.slice(0, 6)}...{req.walletAddress.slice(-4)}
                          </td>
                          <td className="px-6 py-4 font-semibold text-white">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-cyan-400" />
                              {req.companyName}
                            </div>
                          </td>
                          <td className="max-w-xs px-6 py-4 text-xs text-white/70">
                            <p className="line-clamp-2">{req.reason}</p>
                          </td>
                          <td className="px-6 py-4 text-xs text-white/50">
                            {new Date(req.createdAt).toLocaleDateString("vi-VN")}
                          </td>
                          <td className="px-6 py-4">
                            {req.status === "PENDING" && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
                                <Clock className="h-3 w-3" /> Chờ duyệt
                              </span>
                            )}
                            {req.status === "APPROVED" && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                                <UserCheck className="h-3 w-3" /> Đã phê duyệt
                              </span>
                            )}
                            {req.status === "REJECTED" && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-300">
                                <UserX className="h-3 w-3" /> Đã từ chối
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {req.status !== "APPROVED" && (
                                <button
                                  disabled={processingId === req.id}
                                  onClick={() => handleAction(req.id, req.walletAddress, "APPROVE")}
                                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
                                >
                                  Phê Duyệt
                                </button>
                              )}
                              {req.status !== "REJECTED" && (
                                <button
                                  disabled={processingId === req.id}
                                  onClick={() => handleAction(req.id, req.walletAddress, "REJECT")}
                                  className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                                >
                                  Từ Chối
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
