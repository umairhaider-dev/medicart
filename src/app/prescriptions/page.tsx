"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Upload, CheckCircle, Clock, XCircle,
  Shield, Eye, Trash2, ChevronRight, Download,
  Pill, User, Building2, Calendar, AlertTriangle,
  Sparkles, Tag, RefreshCw, Search, Filter
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UploadModal from "@/components/prescription/UploadModal";
import { usePrescriptions, type Prescription, type RxStatus } from "@/store/prescriptionStore";
import { useAuth } from "@/store/authStore";
import { cn } from "@/lib/utils";

/* ── Status config ── */
const STATUS: Record<RxStatus, { label: string; color: string; bg: string; border: string; dot: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  pending:      { label: "Pending Upload",  color: "text-gray-600",   bg: "bg-gray-100",    border: "border-gray-200",   dot: "bg-gray-400",   icon: Clock        },
  under_review: { label: "Under Review",    color: "text-orange-700", bg: "bg-orange-50",   border: "border-orange-200", dot: "bg-orange-400", icon: Clock        },
  verified:     { label: "Verified",        color: "text-green-700",  bg: "bg-green-50",    border: "border-green-200",  dot: "bg-green-500",  icon: CheckCircle  },
  rejected:     { label: "Rejected",        color: "text-red-700",    bg: "bg-red-50",      border: "border-red-200",    dot: "bg-red-500",    icon: XCircle      },
};

const TIMELINE_STEPS: RxStatus[] = ["pending", "under_review", "verified"];

/* ── Status timeline ── */
function StatusTimeline({ current }: { current: RxStatus }) {
  if (current === "rejected") {
    return (
      <div className="flex items-center gap-2 mt-3 p-2.5 bg-red-50 border border-red-100 rounded-xl">
        <XCircle size={14} className="text-red-500 flex-shrink-0" />
        <p className="text-xs text-red-600 font-semibold">Prescription rejected</p>
      </div>
    );
  }
  const idx = TIMELINE_STEPS.indexOf(current);
  return (
    <div className="flex items-center gap-1 mt-3">
      {TIMELINE_STEPS.map((s, i) => {
        const cfg = STATUS[s];
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={s} className="flex items-center gap-1 flex-1">
            <div className={cn(
              "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
              done   ? "bg-green-500"  :
              active ? "bg-orange-400 ring-2 ring-orange-200" :
                       "bg-gray-200"
            )}>
              {done && <CheckCircle size={10} className="text-white" />}
            </div>
            <p className={cn("text-[9px] font-semibold truncate", done ? "text-green-600" : active ? "text-orange-600" : "text-gray-300")}>
              {cfg.label.split(" ")[0]}
            </p>
            {i < TIMELINE_STEPS.length - 1 && <div className={cn("flex-1 h-0.5 rounded-full mx-0.5", done ? "bg-green-300" : "bg-gray-100")} />}
          </div>
        );
      })}
    </div>
  );
}

/* ── Detail drawer ── */
function RxDrawer({ rx, onClose, onDelete }: { rx: Prescription; onClose: () => void; onDelete: () => void }) {
  const sc = STATUS[rx.status];
  const Icon = sc.icon;
  const isImg = rx.filePreview?.startsWith("data:image");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full max-w-md bg-white shadow-2xl flex flex-col h-full overflow-y-auto"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <p className="font-bold text-gray-900">Prescription Details</p>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{rx.id}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
            <XCircle size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5 flex-1">
          {/* Status */}
          <div className={cn("flex items-center gap-3 p-4 rounded-2xl border", sc.bg, sc.border)}>
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", sc.bg)}>
              <Icon size={20} className={sc.color} />
            </div>
            <div>
              <p className={cn("font-bold text-sm", sc.color)}>{sc.label}</p>
              {rx.status === "under_review" && <p className="text-xs text-orange-600 mt-0.5">Expected within 24 hours</p>}
              {rx.status === "verified" && rx.verificationCode && (
                <div className="flex items-center gap-1.5 mt-1">
                  <Tag size={10} className="text-green-600" />
                  <span className="text-xs font-mono font-black text-green-700">{rx.verificationCode}</span>
                </div>
              )}
            </div>
          </div>

          {/* Rejection reason */}
          {rx.status === "rejected" && rx.rejectionReason && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
              <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-700">Rejection Reason</p>
                <p className="text-xs text-red-600 mt-0.5">{rx.rejectionReason}</p>
              </div>
            </div>
          )}

          {/* Pharmacist notes */}
          {rx.status === "verified" && rx.reviewNotes && (
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-2xl">
              <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-green-700">Pharmacist Notes</p>
                <p className="text-xs text-green-600 mt-0.5">{rx.reviewNotes}</p>
              </div>
            </div>
          )}

          {/* Image preview */}
          {rx.filePreview && (
            <div className="rounded-2xl overflow-hidden border border-gray-100">
              {isImg ? (
                <img src={rx.filePreview} alt="Prescription" className="w-full object-contain max-h-64 bg-gray-50" />
              ) : (
                <div className="h-32 flex flex-col items-center justify-center gap-2 bg-gray-50">
                  <FileText size={36} className="text-red-500" />
                  <p className="text-sm font-semibold text-gray-700">{rx.fileName}</p>
                </div>
              )}
            </div>
          )}

          {/* Details grid */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            {[
              { icon: User,     label: "Patient",  value: rx.patientName },
              { icon: User,     label: "Doctor",   value: rx.doctorName  },
              { icon: Building2,label: "Hospital", value: rx.hospital    },
              { icon: Calendar, label: "Issued",   value: new Date(rx.issueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) },
            ].map(row => (
              <div key={row.label} className="flex items-start gap-3">
                <row.icon size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{row.label}</p>
                  <p className="text-sm font-semibold text-gray-800">{row.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Medications */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Pill size={11} /> Medications
            </p>
            <div className="flex flex-wrap gap-1.5">
              {rx.medications.map(m => (
                <span key={m} className="text-xs bg-green-50 border border-green-200 text-green-700 px-2.5 py-1 rounded-full font-semibold">{m}</span>
              ))}
            </div>
          </div>

          {/* Notes */}
          {rx.notes && (
            <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-3">
              <p className="text-xs font-bold text-yellow-700 mb-0.5">Notes</p>
              <p className="text-xs text-yellow-700">{rx.notes}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="text-xs text-gray-400 space-y-1">
            <p>Uploaded: {new Date(rx.uploadedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
            {rx.reviewedAt && <p>Reviewed: {new Date(rx.reviewedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-100 space-y-2 sticky bottom-0 bg-white">
          {rx.status === "rejected" && (
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-sm" onClick={onClose}>
              <RefreshCw size={14} /> Re-upload Prescription
            </button>
          )}
          <button
            onClick={() => { onDelete(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-red-100 text-red-500 font-semibold text-sm hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} /> Delete Prescription
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Prescription card ── */
function RxCard({ rx, index, onClick }: { rx: Prescription; index: number; onClick: () => void }) {
  const sc = STATUS[rx.status];
  const Icon = sc.icon;
  const isImg = rx.filePreview?.startsWith("data:image");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: index * 0.06 }}
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      {/* Thumbnail stripe */}
      <div className="relative h-28 bg-gray-50 overflow-hidden">
        {rx.filePreview && isImg ? (
          <img src={rx.filePreview} alt="Rx" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="h-full flex items-center justify-center">
            <FileText size={40} className={cn("transition-transform group-hover:scale-110", rx.fileName.endsWith(".pdf") ? "text-red-400" : "text-blue-400")} />
          </div>
        )}
        {/* Status badge */}
        <div className={cn("absolute top-2.5 left-2.5 flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full border", sc.bg, sc.color, sc.border)}>
          <span className={cn("w-1.5 h-1.5 rounded-full", sc.dot, rx.status === "under_review" && "animate-pulse")} />
          {sc.label}
        </div>
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold text-gray-800">
            <Eye size={12} /> View Details
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <div>
          <p className="font-bold text-sm text-gray-900 truncate">Dr. {rx.doctorName}</p>
          <p className="text-xs text-gray-400 truncate">{rx.hospital}</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {rx.medications.slice(0, 2).map(m => (
            <span key={m} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{m.split(" ")[0]}</span>
          ))}
          {rx.medications.length > 2 && <span className="text-[10px] text-gray-400">+{rx.medications.length - 2}</span>}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{new Date(rx.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          {rx.verificationCode && (
            <span className="font-mono font-black text-green-600 text-[10px]">{rx.verificationCode}</span>
          )}
        </div>
        <StatusTimeline current={rx.status} />
      </div>
    </motion.div>
  );
}

/* ── Page ── */
export default function PrescriptionsPage() {
  const { prescriptions, deletePrescription } = usePrescriptions();
  const { isAuthenticated, openModal } = useAuth();
  const [showUpload, setShowUpload] = useState(false);
  const [selected, setSelected]     = useState<Prescription | null>(null);
  const [filter, setFilter]         = useState<RxStatus | "all">("all");
  const [search, setSearch]         = useState("");

  const filtered = prescriptions.filter(rx => {
    const matchStatus = filter === "all" || rx.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || rx.doctorName.toLowerCase().includes(q) || rx.medications.some(m => m.toLowerCase().includes(q)) || rx.hospital.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const stats = {
    total:    prescriptions.length,
    verified: prescriptions.filter(r => r.status === "verified").length,
    pending:  prescriptions.filter(r => r.status === "pending" || r.status === "under_review").length,
    rejected: prescriptions.filter(r => r.status === "rejected").length,
  };

  const handleUploadClick = () => {
    if (!isAuthenticated) { openModal("login"); return; }
    setShowUpload(true);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50">
        {/* Hero */}
        <div className="bg-gradient-to-br from-green-600 via-teal-600 to-cyan-700 text-white py-12 px-4 sm:px-6 lg:px-10 xl:px-14">
          <div className="w-full">
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 text-white/70 text-sm font-medium mb-2">
                  <Shield size={14} /> HIPAA Compliant · SSL Secured
                </div>
                <h1 className="text-3xl font-black">My Prescriptions</h1>
                <p className="text-white/80 mt-1.5 max-w-md">Upload, manage and track your prescriptions. Our licensed pharmacists review every document within 24 hours.</p>
              </div>
              <motion.button
                onClick={handleUploadClick}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-green-700 font-black text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all flex-shrink-0"
                whileTap={{ scale: 0.97 }}
              >
                <Upload size={18} /> Upload Prescription
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
              {[
                { label: "Total Uploaded", value: stats.total,    icon: FileText,    color: "text-white/90" },
                { label: "Verified",       value: stats.verified, icon: CheckCircle, color: "text-green-300" },
                { label: "Under Review",   value: stats.pending,  icon: Clock,       color: "text-yellow-300" },
                { label: "Rejected",       value: stats.rejected, icon: XCircle,     color: "text-red-300"   },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.08 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                >
                  <s.icon size={18} className={s.color} />
                  <p className="text-2xl font-black text-white mt-2">{s.value}</p>
                  <p className="text-white/60 text-xs font-medium mt-0.5">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="w-full px-4 py-8 space-y-6">
          {/* Filters + search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by doctor, medication, hospital…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-100 focus:border-green-400 outline-none text-sm bg-white focus:bg-white transition-all shadow-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-0.5">
              {(["all", "pending", "under_review", "verified", "rejected"] as const).map(s => {
                const cfg = s === "all" ? null : STATUS[s];
                return (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={cn(
                      "px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0",
                      filter === s
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-white text-gray-600 border border-gray-100 hover:border-gray-200 shadow-sm"
                    )}
                  >
                    {s === "all" ? "All" : cfg?.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <FileText size={48} className="text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-700 mb-1">
                {prescriptions.length === 0 ? "No prescriptions yet" : "No results found"}
              </h3>
              <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
                {prescriptions.length === 0
                  ? "Upload your first prescription and our pharmacist team will verify it within 24 hours."
                  : "Try adjusting your filters or search terms."}
              </p>
              {prescriptions.length === 0 && (
                <button onClick={handleUploadClick} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-sm hover:shadow-lg transition-all">
                  <Upload size={15} /> Upload Your First Prescription
                </button>
              )}
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {filtered.map((rx, i) => (
                  <RxCard key={rx.id} rx={rx} index={i} onClick={() => setSelected(rx)} />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Info cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Shield,   title: "HIPAA Compliant",       body: "Your prescription data is encrypted and protected under HIPAA regulations.",    color: "from-green-500 to-teal-500" },
              { icon: Clock,    title: "24-Hour Review",         body: "Our licensed pharmacists review every prescription within one business day.",    color: "from-blue-500 to-cyan-500"  },
              { icon: CheckCircle, title: "Verification Code",  body: "Receive a unique code to use at checkout — no need to re-upload each time.",    color: "from-purple-500 to-pink-500"},
            ].map(card => (
              <div key={card.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                  <card.icon size={18} className="text-white" />
                </div>
                <h4 className="font-bold text-sm text-gray-900 mb-1">{card.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />

      {/* Upload modal */}
      <AnimatePresence>
        {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
      </AnimatePresence>

      {/* Detail drawer */}
      <AnimatePresence>
        {selected && (
          <RxDrawer
            rx={selected}
            onClose={() => setSelected(null)}
            onDelete={() => { deletePrescription(selected.id); setSelected(null); }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
