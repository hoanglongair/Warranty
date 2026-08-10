"use client";

import { useState } from "react";
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Send, 
  AlertTriangle, 
  DollarSign, 
  ExternalLink,
  Loader2,
  Clock,
  ArrowRight
} from "lucide-react";
import { useWalletStore } from "@/store/wallet-store";
import { depositEscrowOnChain, releasePaymentOnChain, raiseDisputeOnChain } from "@/lib/escrow-contract";
import { formatCurrency } from "@/lib/utils";

interface EscrowActionCardProps {
  job: any;
  onRefresh?: () => void;
}

export function EscrowActionCard({ job, onRefresh }: EscrowActionCardProps) {
  const { address, provider, connected } = useWalletStore();
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const [deliverableNote, setDeliverableNote] = useState("");
  const [deliverableLink, setDeliverableLink] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const contract = job.contract;
  const currentAddr = (address || "").toLowerCase();
  
  const clientAddress = (contract?.clientAddress || job.clientAddress || job.employer?.walletAddress || "").toLowerCase();
  const freelancerAddress = (contract?.freelancerAddress || "").toLowerCase();

  const isClient = connected && currentAddr !== "" && currentAddr === clientAddress;
  const isFreelancer = connected && currentAddr !== "" && currentAddr === freelancerAddress;

  const rawJobStatus = (job?.status || "").toString().toUpperCase();
  const status = contract?.status || (rawJobStatus === "IN_PROGRESS" || rawJobStatus === "FUNDED" ? "FUNDED" : rawJobStatus === "COMPLETED" ? "COMPLETED" : "OPEN");
  const budget = contract?.totalAmount || job.budget;
  const tokenSymbol = contract?.tokenSymbol || job.tokenSymbol || "USDC";

  // 1. Bên A Nạp cọc (Fund Escrow)
  const handleFundEscrow = async () => {
    if (!connected) {
      setErrorMsg("Vui lòng kết nối ví Web3 trước khi thực hiện.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Call Web3 deposit
      const txHash = await depositEscrowOnChain(
        provider || "metamask",
        job.id,
        freelancerAddress || "0x0000000000000000000000000000000000000000",
        budget.toString()
      );

      // Call API update
      const res = await fetch(`/api/jobs/${job.id}/hire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientAddress: currentAddr,
          freelancerAddress: freelancerAddress || "0x0000000000000000000000000000000000000000",
          proposalBid: budget,
          tokenSymbol,
          txHash,
          status: "FUNDED"
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Không thể khởi tạo cọc Escrow.");

      setSuccessMsg("🎉 Đã khóa thành công tiền cọc vào Smart Contract Escrow!");
      const { deductBalance, refreshRealtimeBalance } = useWalletStore.getState();
      deductBalance(budget);
      refreshRealtimeBalance();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Lỗi khi nạp cọc Smart Contract.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Bên B Bàn giao sản phẩm (Submit Deliverable)
  const handleSubmitDeliverable = async () => {
    if (!deliverableNote && !deliverableLink) {
      setErrorMsg("Vui lòng nhập ghi chú hoặc đường dẫn mô tả sản phẩm.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/jobs/${job.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freelancerAddress: currentAddr,
          deliverableNote,
          deliverableLink
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Không thể nộp sản phẩm.");

      setSuccessMsg("🚀 Đã bàn giao sản phẩm! Đang chờ Bên A kiểm tra nghiệm thu.");
      setShowSubmitModal(false);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Lỗi bàn giao sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Bên A Nghiệm thu & Giải ngân (Release Payment)
  const handleReleasePayment = async () => {
    if (!connected) {
      setErrorMsg("Vui lòng kết nối ví Web3.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const txHash = await releasePaymentOnChain(provider || "metamask", job.id);

      const res = await fetch(`/api/jobs/${job.id}/release`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientAddress: currentAddr,
          releaseTxHash: txHash
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Không thể giải ngân tiền.");

      setSuccessMsg("🎉 Đã nghiệm thu thành công & Giải ngân 100% tiền cọc về ví Freelancer!");
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Lỗi nghiệm thu giải ngân.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Kích hoạt Tranh chấp (Raise Dispute)
  const handleRaiseDispute = async () => {
    if (!confirm("Bạn có chắc chắn muốn kích hoạt Tranh chấp? Trọng tài sàn sẽ vào phân xử.")) return;
    setLoading(true);
    setErrorMsg("");

    try {
      await raiseDisputeOnChain(provider || "metamask", job.id);
      setSuccessMsg("⚖️ Đã kích hoạt tranh chấp. Trọng tài sẽ liên hệ xử lý.");
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Lỗi yêu cầu tranh chấp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card overflow-hidden p-6 border border-violet-500/20 shadow-xl">
      {/* Header Shield */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/30 text-violet-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-white text-sm">Smart Contract Escrow</h4>
            <p className="text-[11px] text-white/50">Thanh toán bảo hiểm an toàn Web3</p>
          </div>
        </div>

        {/* Status Badge */}
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
          status === "COMPLETED" ? "bg-green-500/10 text-green-400 border-green-500/20" :
          status === "FUNDED" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" :
          status === "IN_PROGRESS" ? "bg-amber-500/10 text-amber-300 border-amber-500/20" :
          status === "DISPUTED" ? "bg-red-500/10 text-red-400 border-red-500/20" :
          "bg-violet-500/10 text-violet-300 border-violet-500/20"
        }`}>
          {status === "COMPLETED" && <CheckCircle2 className="h-3.5 w-3.5" />}
          {status === "FUNDED" && <Lock className="h-3.5 w-3.5" />}
          {status === "IN_PROGRESS" && <Clock className="h-3.5 w-3.5" />}
          {status === "DISPUTED" && <AlertTriangle className="h-3.5 w-3.5" />}
          
          {status === "COMPLETED" ? "Đã Giải Ngân" :
           status === "FUNDED" ? "Tiền Cọc Đã Khóa" :
           status === "IN_PROGRESS" ? "Đã Bàn Giao - Chờ Duyệt" :
           status === "DISPUTED" ? "Tranh Chấp" : "Chờ Khởi Tạo Cọc"}
        </span>
      </div>

      {/* Amount & Parties info */}
      <div className="my-5 grid grid-cols-2 gap-3 bg-white/[0.02] border border-white/5 p-3.5 rounded-xl text-xs">
        <div>
          <span className="text-white/40 block text-[10px]">Số tiền bảo đảm Escrow</span>
          <span className="font-display text-base font-bold text-white flex items-center gap-1 mt-0.5">
            ${budget.toLocaleString("en-US")} <span className="text-xs text-cyan-400 font-normal">{tokenSymbol}</span>
          </span>
        </div>
        <div className="border-l border-white/5 pl-3">
          <span className="text-white/40 block text-[10px]">Vai trò ví kết nối</span>
          <span className="font-semibold text-violet-300 block mt-1 truncate">
            {isClient ? "👑 Bên A (Người Thuê)" : isFreelancer ? "🛠️ Bên B (Freelancer)" : "👁️ Người Xem"}
          </span>
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-xs text-green-300 flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Actions based on Status & Role */}
      <div className="pt-2 border-t border-white/5">
        {/* CASE 1: Completed */}
        {status === "COMPLETED" && (
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-center">
            <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <h5 className="font-bold text-white text-sm">Hợp đồng đã hoàn tất!</h5>
            <p className="text-xs text-white/60 mt-1">100% số tiền cọc đã được chuyển trực tiếp vào địa chỉ ví của Bên B.</p>
          </div>
        )}

        {/* CASE 2: Dispute */}
        {status === "DISPUTED" && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
            <h5 className="font-bold text-white text-sm">Đang trong quá trình tranh chấp</h5>
            <p className="text-xs text-white/60 mt-1">Hệ thống Trọng tài đang xem xét bằng chứng bàn giao của 2 bên để phân xử giải ngân.</p>
          </div>
        )}

        {/* CASE 3: OPEN (Chờ Bên A nạp cọc) */}
        {status === "OPEN" && (
          <div className="space-y-3">
            {isClient ? (
              <button
                onClick={handleFundEscrow}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                Nạp Cọc Smart Contract (${budget.toLocaleString("en-US")} {tokenSymbol})
              </button>
            ) : (
              <p className="text-xs text-white/50 text-center py-2 bg-white/[0.02] rounded-xl">
                {isFreelancer 
                  ? "Vui lòng chờ Bên A (Người thuê) thực hiện nạp cọc Escrow để bắt đầu dự án." 
                  : "Dự án đang chờ Bên A nạp cọc khởi tạo hợp đồng Escrow."}
              </p>
            )}
          </div>
        )}

        {/* CASE 4: FUNDED (Đã khóa tiền - Chờ Bên B làm & bàn giao) */}
        {status === "FUNDED" && (
          <div className="space-y-3">
            {isFreelancer ? (
              <button
                onClick={() => setShowSubmitModal(true)}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3"
              >
                <Send className="h-4 w-4" />
                Nộp Sản Phẩm Bàn Giao
              </button>
            ) : isClient ? (
              <div className="space-y-2">
                <p className="text-xs text-white/60 bg-cyan-500/5 border border-cyan-500/20 p-3 rounded-xl">
                  🔒 Tiền cọc <strong>${budget.toLocaleString("en-US")} {tokenSymbol}</strong> đang được khóa an toàn trên Smart Contract. Đang chờ Bên B nộp sản phẩm bàn giao.
                </p>
                <button
                  onClick={handleRaiseDispute}
                  disabled={loading}
                  className="w-full text-xs text-red-400 hover:text-red-300 py-2 transition-colors flex items-center justify-center gap-1"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Kích hoạt Tranh chấp nếu quá hạn
                </button>
              </div>
            ) : (
              <p className="text-xs text-white/50 text-center py-2 bg-white/[0.02] rounded-xl">
                Tiền cọc đã được khóa an toàn. Freelancer đang thực hiện dự án.
              </p>
            )}
          </div>
        )}

        {/* CASE 5: IN_PROGRESS (Đã bàn giao sản phẩm - Chờ Bên A nghiệm thu) */}
        {status === "IN_PROGRESS" && (
          <div className="space-y-3">
            {isClient ? (
              <div className="space-y-3">
                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-xs text-amber-200">
                  <p className="font-semibold mb-1 flex items-center gap-1">
                    <Send className="h-3.5 w-3.5" /> Bên B đã nộp sản phẩm bàn giao!
                  </p>
                  <p className="text-white/70">Vui lòng kiểm tra kỹ chất lượng công việc trước khi quyết định giải ngân.</p>
                </div>

                <button
                  onClick={handleReleasePayment}
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  Nghiệm Thu & Giải Ngân 100%
                </button>

                <button
                  onClick={handleRaiseDispute}
                  disabled={loading}
                  className="w-full text-xs text-red-400 hover:text-red-300 py-1.5 transition-colors flex items-center justify-center gap-1"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Sản phẩm chưa đạt / Kích hoạt Tranh chấp
                </button>
              </div>
            ) : isFreelancer ? (
              <div className="bg-cyan-500/10 border border-cyan-500/20 p-3 rounded-xl text-xs text-cyan-200 text-center">
                <p className="font-semibold">Đã nộp sản phẩm thành công!</p>
                <p className="text-white/70 mt-1">Đang chờ Bên A (Người Thuê) kiểm tra nghiệm thu và bấm giải ngân.</p>
              </div>
            ) : (
              <p className="text-xs text-white/50 text-center py-2 bg-white/[0.02] rounded-xl">
                Sản phẩm đã được bàn giao. Đang chờ nghiệm thu giải ngân.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Modal nộp sản phẩm cho Freelancer */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-card relative w-full max-w-md p-6 shadow-2xl border border-violet-500/30">
            <h4 className="font-display text-lg font-bold text-white mb-2">Bàn Giao Sản Phẩm</h4>
            <p className="text-xs text-white/60 mb-4">Gửi báo cáo hoặc đường dẫn lưu trữ sản phẩm hoàn thành cho Bên A.</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-white/80 mb-1">Ghi chú bàn giao</label>
                <textarea
                  rows={3}
                  value={deliverableNote}
                  onChange={(e) => setDeliverableNote(e.target.value)}
                  placeholder="Mô tả kết quả công việc đã thực hiện..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-white/30 focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/80 mb-1">Đường dẫn sản phẩm (GitHub / Google Drive / Figma)</label>
                <input
                  type="url"
                  value={deliverableLink}
                  onChange={(e) => setDeliverableLink(e.target.value)}
                  placeholder="https://github.com/my-project"
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-white/30 focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div className="mt-5 flex gap-3 pt-2">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="btn-secondary flex-1 py-2.5 text-xs"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmitDeliverable}
                  disabled={loading}
                  className="btn-primary flex-1 py-2.5 text-xs flex items-center justify-center gap-1.5"
                >
                  {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  Xác Nhận Nộp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
