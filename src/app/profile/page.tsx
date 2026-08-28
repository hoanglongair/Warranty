"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, Edit2, Plus, Save, X
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { WalletButton } from "@/components/wallet/wallet-button";
import { useWalletStore } from "@/store/wallet-store";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"portfolio" | "reviews" | "about">("about");
  const { connected, address } = useWalletStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editSkills, setEditSkills] = useState("");

  useEffect(() => {
    if (!connected || !address) return;
    setLoading(true);
    fetch(`/api/profile/${address}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          setProfile(data.profile);
          setEditName(data.profile.name || "");
          setEditBio(data.profile.bio || "");
          setEditSkills(Array.isArray(data.profile.skills) ? data.profile.skills.join(", ") : "");
        }
      })
      .catch((err) => console.error("Fetch profile error:", err))
      .finally(() => setLoading(false));
  }, [connected, address]);

  const handleSaveProfile = async () => {
    if (!address) return;
    try {
      const skillsArray = editSkills.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await fetch(`/api/profile/${address}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          bio: editBio,
          skills: skillsArray
        })
      });
      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
        setIsEditing(false);
        alert("Cập nhật hồ sơ thành công!");
      }
    } catch (err) {
      console.error("Save profile error:", err);
      alert("Không thể lưu thay đổi.");
    }
  };

  const displayName = profile?.name || (address ? `User ${address.slice(0, 6)}...${address.slice(-4)}` : "Guest User");
  const displayBio = profile?.bio || "Thành viên hệ sinh thái Web3 Warranty Marketplace.";
  const displaySkills = profile?.skills || ["Web3", "Smart Contract", "React"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="glass-card overflow-hidden">
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/40 via-fuchsia-500/30 to-cyan-500/40" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
          </div>

          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-6 flex flex-col items-start gap-6 sm:flex-row sm:items-end">
              <div className="flex h-32 w-32 items-center justify-center rounded-2xl border-4 border-[hsl(var(--background))] bg-gradient-to-br from-violet-500 to-cyan-500 font-display text-4xl font-bold text-white shadow-xl">
                {displayName.charAt(0)}
              </div>
              
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3 max-w-md">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Nhập tên hiển thị"
                      className="w-full h-10 px-3 rounded-lg border border-white/20 bg-white/10 text-white outline-none focus:border-violet-400"
                    />
                    <textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder="Mô tả bản thân"
                      rows={2}
                      className="w-full p-3 rounded-lg border border-white/20 bg-white/10 text-white outline-none focus:border-violet-400 text-sm resize-none"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="font-display text-3xl font-bold text-white">{displayName}</h1>
                      <CheckCircle2 className="h-6 w-6 text-violet-400" />
                      
                      {profile?.role === "ADMIN" && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/40 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-300">
                          🛡️ Admin System
                        </span>
                      )}
                      {profile?.role === "EMPLOYER" && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
                          🏢 Employer (Đã duyệt)
                        </span>
                      )}
                      {(profile?.role === "FREELANCER" || !profile?.role) && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-300">
                          💻 Freelancer
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-white/70 max-w-2xl">{displayBio}</p>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3">
                {connected && (
                  isEditing ? (
                    <>
                      <button onClick={handleSaveProfile} className="btn-primary flex items-center gap-1.5 text-xs py-2 px-3">
                        <Save className="h-4 w-4" />
                        Lưu
                      </button>
                      <button onClick={() => setIsEditing(false)} className="btn-secondary flex items-center gap-1.5 text-xs py-2 px-3">
                        <X className="h-4 w-4" />
                        Hủy
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="btn-secondary flex items-center gap-1.5 text-xs py-2 px-3">
                      <Edit2 className="h-4 w-4" />
                      Sửa Hồ Sơ
                    </button>
                  )
                )}
                <WalletButton />
              </div>
            </div>

            {!connected ? (
              <div className="p-8 text-center glass-card border-violet-500/30">
                <p className="text-white/70 mb-4">Vui lòng kết nối ví để xem và chỉnh sửa hồ sơ cá nhân của bạn.</p>
                <WalletButton />
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center gap-1 border-b border-white/5">
                    {(["about", "portfolio"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 px-4 text-sm font-medium capitalize transition-colors ${
                          activeTab === tab ? "text-white border-b-2 border-violet-500" : "text-white/50 hover:text-white/80"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {activeTab === "about" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="glass-card p-6 space-y-4"
                    >
                      <h3 className="font-display text-lg font-semibold text-white">Giới Thiệu</h3>
                      <p className="text-sm leading-relaxed text-white/70">{displayBio}</p>

                      {isEditing && (
                        <div className="pt-4 border-t border-white/10">
                          <label className="block text-xs text-white/60 mb-2">Kỹ năng (phân cách bằng dấu phẩy)</label>
                          <input
                            type="text"
                            value={editSkills}
                            onChange={(e) => setEditSkills(e.target.value)}
                            placeholder="Solidity, React, UI/UX"
                            className="w-full h-10 px-3 rounded-lg border border-white/20 bg-white/10 text-white text-sm outline-none focus:border-violet-400"
                          />
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="glass-card p-6">
                    <h3 className="font-display text-lg font-semibold text-white mb-4">Ví Đang Kết Nối</h3>
                    <p className="text-xs text-violet-300 font-mono break-all bg-violet-500/10 p-3 rounded-xl border border-violet-500/20">{address}</p>
                  </div>

                  <div className="glass-card p-6">
                    <h3 className="font-display text-lg font-semibold text-white mb-4">Kỹ Năng</h3>
                    <div className="flex flex-wrap gap-2">
                      {displaySkills.map((skill: string) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-sm text-violet-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
