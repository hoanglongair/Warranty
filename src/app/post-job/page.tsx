"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X, Check, CheckCircle2 } from "lucide-react";
import { WalletButton } from "@/components/wallet/wallet-button";
import { useWalletStore } from "@/store/wallet-store";
import { useJobStore } from "@/store/job-store";
import { CustomSelect } from "@/components/ui/custom-select";

const jobSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  category: z.string().min(1, "Please select a category"),
  subcategory: z.string().min(1, "Please select a subcategory"),
  budget: z.number().min(2, "Minimum budget is $20"),
  duration: z.string().min(1, "Please select a duration"),
  experience: z.string().min(1, "Please select experience level"),
  type: z.string().min(1, "Please select job type"),
  skills: z.array(z.string()).min(1, "Add at least one skill"),
});

type JobFormData = z.infer<typeof jobSchema>;

const categories = [
  { id: "design", name: "Design", subcategories: ["Logo Design", "UI/UX Design", "Banner Design", "Brand Identity"] },
  { id: "development", name: "Development", subcategories: ["Website Development", "Mobile App", "Telegram Bots", "Discord Bots", "Smart Contracts", "Web3 Development"] },
  { id: "content", name: "Content", subcategories: ["Copywriting", "Translation", "Blog Writing", "Technical Writing"] },
  { id: "marketing", name: "Marketing", subcategories: ["SEO", "Social Media", "Paid Advertising", "Community Management"] },
];

const durations = ["Less than 1 week", "1-2 weeks", "2-4 weeks", "1-2 months", "2-3 months", "3+ months"];
const experienceLevels = ["Entry", "Intermediate", "Expert"];

export default function PostJobPage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [requirements, setRequirements] = useState<string[]>([
    "Kinh nghiệm làm việc Web3 / Software Development",
    "Giao tiếp tốt và bàn giao công việc đúng thời hạn",
    "Cam kết hoàn thành theo yêu cầu mô tả dự án"
  ]);
  const [reqInput, setReqInput] = useState("");

  const [deliverables, setDeliverables] = useState<string[]>([
    "Mã nguồn dự án hoàn chỉnh",
    "Báo cáo hoặc tài liệu hướng dẫn bàn giao"
  ]);
  const [delInput, setDelInput] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [postError, setPostError] = useState<string>("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [employerReqStatus, setEmployerReqStatus] = useState<string>("NONE");
  const [checkingRole, setCheckingRole] = useState<boolean>(true);
  const [companyName, setCompanyName] = useState<string>("");
  const [reqReason, setReqReason] = useState<string>("");
  const [reqSubmitting, setReqSubmitting] = useState<boolean>(false);
  const [reqMessage, setReqMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const { addJob } = useJobStore();
  const { connected, address } = useWalletStore();

  useEffect(() => {
    async function checkRole() {
      if (!address) {
        setUserRole(null);
        setCheckingRole(false);
        return;
      }
      setCheckingRole(true);
      try {
        const res = await fetch(`/api/profile/${address}`);
        const data = await res.json();
        if (data.success && data.profile) {
          setUserRole(data.profile.role);
          setEmployerReqStatus(data.profile.employerStatus || data.profile.employerRequest?.status || "NONE");
        }
      } catch (err) {
        console.error("Fetch profile role error:", err);
      } finally {
        setCheckingRole(false);
      }
    }
    checkRole();
  }, [address]);

  const handleApplyEmployer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !companyName.trim() || !reqReason.trim()) return;

    setReqSubmitting(true);
    setReqMessage(null);
    try {
      const res = await fetch("/api/employer-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: address,
          companyName: companyName.trim(),
          reason: reqReason.trim()
        })
      });
      const data = await res.json();

      if (data.success) {
        setReqMessage({ text: data.message, type: "success" });
        setEmployerReqStatus("PENDING");
      } else {
        setReqMessage({ text: data.error || "Không thể gửi yêu cầu.", type: "error" });
      }
    } catch (err) {
      setReqMessage({ text: "Lỗi kết nối máy chủ.", type: "error" });
    } finally {
      setReqSubmitting(false);
    }
  };

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      skills: [],
      budget: 500,
      type: "remote",
      category: "",
      subcategory: "",
      duration: "",
      experience: ""
    }
  });

  const selectedCategory = watch("category");
  const selectedSubcategory = watch("subcategory");
  const selectedDuration = watch("duration");
  const selectedExperience = watch("experience");
  const selectedType = watch("type");

  const categoryOptions = categories.map((cat) => ({ value: cat.id, label: cat.name }));
  const subcategoryList = categories.find((c) => c.id === selectedCategory)?.subcategories || [];
  const subcategoryOptions = subcategoryList.map((sub) => ({ value: sub, label: sub }));
  const durationOptions = durations.map((dur) => ({ value: dur, label: dur }));
  const experienceOptions = experienceLevels.map((exp) => ({ value: exp.toLowerCase(), label: exp }));
  const jobTypeOptions = [
    { value: "remote", label: "Remote" },
    { value: "onsite", label: "On-site" },
    { value: "hybrid", label: "Hybrid" }
  ];

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      const newSkills = [...skills, skillInput.trim()];
      setSkills(newSkills);
      setValue("skills", newSkills, { shouldValidate: true });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    const newSkills = skills.filter((s) => s !== skill);
    setSkills(newSkills);
    setValue("skills", newSkills, { shouldValidate: true });
  };

  const addRequirement = () => {
    if (reqInput.trim() && !requirements.includes(reqInput.trim())) {
      setRequirements([...requirements, reqInput.trim()]);
      setReqInput("");
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const addDeliverable = () => {
    if (delInput.trim() && !deliverables.includes(delInput.trim())) {
      setDeliverables([...deliverables, delInput.trim()]);
      setDelInput("");
    }
  };

  const removeDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: JobFormData) => {
    if (!connected || !address) {
      setPostError("Vui lòng kết nối ví Web3 trước khi đăng bài tuyển dụng.");
      return;
    }

    setIsSubmitting(true);
    setPostError("");

    try {
      // Luồng chuẩn: Post job ở trạng thái OPEN, KHÔNG gọi Smart Contract.
      // Tiền cọc Escrow sẽ được ký quỹ SAU khi Employer chọn được freelancer
      // và nhấn "Nạp cọc" trên trang chi tiết job.
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          category: data.category,
          subcategory: data.subcategory,
          experience: data.experience,
          budget: data.budget,
          budgetType: "fixed",
          tokenSymbol: "USDC",
          employerAddress: address,
          skills: data.skills,
          requirements: requirements,
          deliverables: deliverables,
          deadline: data.duration,
          location: data.type
        })
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Không thể đăng bài tuyển dụng.");
      }

      const newJobId = resData.job?.id;
      const { addJob, fetchJobs } = useJobStore.getState();

      await addJob({
        id: newJobId,
        title: data.title,
        description: data.description,
        category: data.category,
        budget: data.budget,
        budgetType: "fixed",
        tokenSymbol: "USDC",
        employerAddress: address,
        skills: data.skills,
        requirements,
        deliverables,
        deadline: data.duration,
        location: data.type,
        status: "OPEN"
      } as any);

      // Refresh Marketplace state
      fetchJobs();

      setIsSubmitting(false);
      setSubmitted(true);
      reset();
      setSkills([]);
    } catch (err: any) {
      console.error("Post job error:", err);
      setPostError(err?.message || "Không thể đăng bài tuyển dụng.");
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 shadow-xl">
            <Check className="h-10 w-10 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">
            Đã Đăng Bài Tuyển Dụng Thành Công!
          </h1>
          <p className="mt-4 max-w-md mx-auto text-white/70">
            Bài đăng của bạn đã hiển thị trên Marketplace. Khi freelancer ứng tuyển và bạn chọn được người phù hợp,
            hãy nhấn <strong className="text-violet-300">"Nạp cọc Escrow"</strong> trên trang chi tiết công việc
            để khóa tiền cọc an toàn vào Smart Contract.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/marketplace" className="btn-primary">
              Xem Bài Đăng Trên Thị Trường
            </Link>
            <button onClick={() => setSubmitted(false)} className="btn-secondary">
              Đăng Bài Tuyển Dụng Khác
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-4xl font-bold text-white">Post a Job</h1>
        <p className="mt-2 text-white/60">
          Create a new job listing to find talented freelancers for your project.
        </p>
      </motion.div>

      {!connected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card mb-8 border-amber-500/20 bg-amber-500/5 p-6 text-center"
        >
          <p className="text-amber-200 mb-4">
            You need to connect your wallet before posting a job.
          </p>
          <WalletButton />
        </motion.div>
      )}

      {connected && checkingRole && (
        <div className="glass-card mb-8 p-8 text-center text-white/60">
          Đang kiểm tra quyền hạn tài khoản ví...
        </div>
      )}

      {connected && !checkingRole && userRole !== "EMPLOYER" && userRole !== "ADMIN" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card border-violet-500/40 p-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-300 mb-4">
            ⚠️ Yêu cầu Quyền Hạn
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            Chức Năng Đăng Tuyển Công Việc Dành Cho nhà tuyển dụng 
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            Tài khoản ví <span className="font-mono text-cyan-300 font-semibold">{address}</span> của bạn chưa đủ điều kiện để đăng bài tuyển dụng. Để đăng bài tuyển dụng, bạn cần gửi đăng ký và được cấp duyệt lên role cao hơn.
          </p>

          {employerReqStatus === "PENDING" ? (
            <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6">
              <div className="flex items-center gap-3 text-amber-300 font-bold text-lg">
                <span className="flex h-3 w-3 rounded-full bg-amber-400 animate-ping" />
                Yêu cầu của bạn đang chờ Admin duyệt
              </div>
              <p className="mt-2 text-sm text-white/80">
                Hệ thống đã nhận được đơn đăng ký làm Employer từ địa chỉ ví này. Quản trị viên (Admin) đang xem xét yêu cầu của bạn. Vui lòng quay lại sau!
              </p>
            </div>
          ) : (
            <form onSubmit={handleApplyEmployer} className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="font-semibold text-white text-base">Đăng Ký Quyền Employer (Nhà Tuyển Dụng)</h3>

              {reqMessage && (
                <div className={`p-4 rounded-xl text-sm font-medium ${reqMessage.type === "success" ? "bg-emerald-500/10 border border-emerald-500/40 text-emerald-300" : "bg-red-500/10 border border-red-500/40 text-red-300"}`}>
                  {reqMessage.text}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                  Tên Công Ty / Tổ Chức / Dự Án <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Polyflow Labs / Individual Client"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                  Mô Tả Nhu Cầu Tuyển Dụng & Dự Án <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Mô tả ngắn gọn lý do bạn muốn tuyển dụng Freelancer và quy mô dự án của bạn..."
                  value={reqReason}
                  onChange={(e) => setReqReason(e.target.value)}
                  className="input-field w-full"
                />
              </div>

              <button
                type="submit"
                disabled={reqSubmitting || !companyName.trim() || !reqReason.trim()}
                className="btn-primary w-full justify-center py-3 text-sm font-semibold disabled:opacity-50"
              >
                {reqSubmitting ? "Đang gửi yêu cầu..." : "Gửi Đơn Đăng Ký Employer Cho Admin Phê Duyệt"}
              </button>
            </form>
          )}
        </motion.div>
      )}

      {connected && !checkingRole && (userRole === "EMPLOYER" || userRole === "ADMIN") && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8"
        >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Job Title <span className="text-violet-400">*</span>
            </label>
            <input
              {...register("title")}
              type="text"
              placeholder="e.g. Build a Web3 DeFi Dashboard with React and Tailwind"
              className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder-white/40 outline-none focus:border-violet-500/50"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description <span className="text-violet-400">*</span>
            </label>
            <textarea
              {...register("description")}
              rows={6}
              placeholder="Describe your project requirements, goals, and expectations..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder-white/40 outline-none focus:border-violet-500/50 resize-none"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Category <span className="text-violet-400">*</span>
              </label>
              <CustomSelect
                options={categoryOptions}
                value={selectedCategory}
                placeholder="Select category"
                onChange={(val) => {
                  setValue("category", val, { shouldValidate: true });
                  setValue("subcategory", "", { shouldValidate: true });
                }}
              />
              {errors.category && (
                <p className="mt-1 text-xs text-red-400">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Subcategory <span className="text-violet-400">*</span>
              </label>
              <CustomSelect
                options={subcategoryOptions}
                value={selectedSubcategory}
                placeholder="Select subcategory"
                disabled={!selectedCategory}
                onChange={(val) => setValue("subcategory", val, { shouldValidate: true })}
              />
              {errors.subcategory && (
                <p className="mt-1 text-xs text-red-400">{errors.subcategory.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Budget (USDC) <span className="text-violet-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">$</span>
                <input
                  {...register("budget", { valueAsNumber: true })}
                  type="number"
                  min="2"
                  placeholder="500"
                  className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.04] pl-8 pr-4 text-white placeholder-white/40 outline-none focus:border-violet-500/50"
                />
              </div>
              {errors.budget && (
                <p className="mt-1 text-xs text-red-400">{errors.budget.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Duration <span className="text-violet-400">*</span>
              </label>
              <CustomSelect
                options={durationOptions}
                value={selectedDuration}
                placeholder="Select duration"
                onChange={(val) => setValue("duration", val, { shouldValidate: true })}
              />
              {errors.duration && (
                <p className="mt-1 text-xs text-red-400">{errors.duration.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Experience Level <span className="text-violet-400">*</span>
              </label>
              <CustomSelect
                options={experienceOptions}
                value={selectedExperience}
                placeholder="Select experience"
                onChange={(val) => setValue("experience", val, { shouldValidate: true })}
              />
              {errors.experience && (
                <p className="mt-1 text-xs text-red-400">{errors.experience.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Job Type <span className="text-violet-400">*</span>
              </label>
              <CustomSelect
                options={jobTypeOptions}
                value={selectedType}
                placeholder="Select job type"
                onChange={(val) => setValue("type", val, { shouldValidate: true })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Skills Required <span className="text-violet-400">*</span>
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="e.g. React, Solidity, Figma"
                className="flex-1 h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder-white/40 outline-none focus:border-violet-500/50"
              />
              <button
                type="button"
                onClick={addSkill}
                className="btn-secondary px-6"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-sm text-violet-300"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
            {errors.skills && (
              <p className="mt-1 text-xs text-red-400">{errors.skills.message}</p>
            )}
          </div>

          {/* Section: Requirements */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Requirements (Yêu cầu công việc)
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={reqInput}
                onChange={(e) => setReqInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addRequirement();
                  }
                }}
                placeholder="e.g. 3+ năm kinh nghiệm phát triển Web3"
                className="flex-1 h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder-white/40 outline-none focus:border-violet-500/50"
              />
              <button
                type="button"
                onClick={addRequirement}
                className="btn-secondary px-6"
              >
                <Plus className="h-4 w-4" />
                Thêm
              </button>
            </div>
            <ul className="space-y-2">
              {requirements.map((req, idx) => (
                <li key={idx} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 text-sm text-white/80">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-violet-400" />
                    {req}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(idx)}
                    className="text-white/40 hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Section: Deliverables */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Deliverables (Sản phẩm bàn giao)
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={delInput}
                onChange={(e) => setDelInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addDeliverable();
                  }
                }}
                placeholder="e.g. File thiết kế Figma hoàn chỉnh & Mã nguồn GitHub"
                className="flex-1 h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder-white/40 outline-none focus:border-violet-500/50"
              />
              <button
                type="button"
                onClick={addDeliverable}
                className="btn-secondary px-6"
              >
                <Plus className="h-4 w-4" />
                Thêm
              </button>
            </div>
            <ul className="space-y-2">
              {deliverables.map((del, idx) => (
                <li key={idx} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 text-sm text-white/80">
                  <span className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-300">
                      {idx + 1}
                    </span>
                    {del}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeDeliverable(idx)}
                    className="text-white/40 hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {postError && (
            <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-300">
              ⚠️ {postError}
            </div>
          )}

          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-white/50 max-w-md">
              * Bài đăng sẽ ở trạng thái OPEN. Tiền cọc Escrow sẽ được ký quỹ khi bạn chọn được freelancer phù hợp.
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !connected}
              className="btn-primary flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Đang đăng bài...
                </>
              ) : (
                "Đăng Bài Tuyển Dụng"
              )}
            </button>
          </div>
        </form>
      </motion.div>
      )}
    </div>
  );
}
