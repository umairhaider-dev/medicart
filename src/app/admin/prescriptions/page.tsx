"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, CheckCircle, XCircle, Clock, Eye, User,
  Building2, Calendar, Pill, Shield, Search, Filter,
  ChevronDown, AlertTriangle, Tag, MessageSquare,
  RefreshCw, Loader2
} from "lucide-react";
import { usePrescriptions, type Prescription, type RxStatus } from "@/store/prescriptionStore";
import { cn } from "@/lib/utils";

const STATUS_CFG: Record<RxStatus, { label: string; color: string; bg: string; border: string; dot: string }> = {
  pending:      { label: "Pending",      color: "text-gray-600",   bg: "bg-gray-100",    border: "border-gray-200",   dot: "bg-gray-400"   },
  under_review: { label: "Under Review", color: "text-orange-700", bg: "bg-orange-50",   border: "border-orange-200", dot: "bg-orange-400" },
  verified:     { label: "Verified",     color: "text-green-700",  bg: "bg-green-50",    border: "border-green-200",  dot: "bg-green-500"  },
  rejected:     { label: "Rejected",     color: "text-red-700",    bg: "bg-red-50",      border: "border-red-200",    dot: "bg-red-500"    },
};

function genCode() {
  return `RX-VRF-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

/* ── Review drawer ── */
function ReviewDrawer({ rx, onClose }: { rx: Prescription; onClose: () => void }) {
  const { updateStatus } = usePrescriptions();
  const [action, setAction]   = useState<"approve" | "reject" | null>(null);
  const [notes, setNotes]     = useState("");
  const [reason, setReason]   = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState<"approved" | "rejected" | null>(null);

  const sc = STATUS_CFG[rx.status];
  const isImg = rx.filePreview?.startsWith("data:image");

  const REJECT_REASONS = [
    "Prescription image is not legible",
    "Doctor's signature is missing",
    "Prescription is expired (older than 6 months)",
    "Incorrect patient name",
    "Prescription stamp is not visible",
    "Medications not matching the image",
    "Other (see notes)",
  ];

  const handleApprove = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    updateStatus(rx.id, "verified", {
      reviewNotes: notes || "All medications verified. Prescription is valid.",
      verificationCode: genCode(),
    });
    setLoading(false);
    setDone("approved");
  };

  const handleReject = async () => {
    if (!reason) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    updateStatus(rx.id, "rejected", {
      rejectionReason: `${reason}${notes ? `. ${notes}` : ""}`,
    });
    setLoading(false);
    setDone("rejected");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="w-full max-w-lg bg-white shadow-2xl flex flex-col h-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <div>
            <p className="font-black text-gray-900">Pharmacist Review</p>
            <p className="text-xs font-mono text-gray-400 mt-0.5">{rx.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full border", sc.bg, sc.color, sc.border)}>
              {sc.label}
            </span>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
              <XCircle size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {done ? (
            /* Result screen */
            <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-5">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
                className={cn("w-20 h-20 rounded-full flex items-center justify-center", done === "approved" ? "bg-green-100" : "bg-red-100")}
              >
                {done === "approved"
                  ? <CheckCircle size={40} className="text-green-500" />
                  : <XCircle size={40} className="text-red-500" />
                }
              </motion.div>
              <div>
                <h3 className="text-xl font-black text-gray-900">
                  {done === "approved" ? "Prescription Verified!" : "Prescription Rejected"}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {done === "approved"
                    ? "Patient has been notified and can now use this prescription at checkout."
                    : "Patient has been notified with the rejection reason."
                  }
                </p>
              </div>
              <button onClick={onClose} className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-sm">
                Done
              </button>
            </div>
          ) : (
            <div className="p-6 space-y-5">
              {/* Prescription image */}
              <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                {rx.filePreview && isImg ? (
                  <img src={rx.filePreview} alt="Prescription" className="w-full object-contain max-h-64" />
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center gap-3">
                    <FileText size={44} className="text-red-400" />
                    <div className="text-center">
                      <p className="font-bold text-sm text-gray-800">{rx.fileName}</p>
                      <p className="text-xs text-gray-400">PDF Document</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Patient + doctor info */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: User,      label: "Patient",  value: rx.patientName },
                  { icon: User,      label: "Doctor",   value: rx.doctorName  },
                  { icon: Building2, label: "Hospital", value: rx.hospital    },
                  { icon: Calendar,  label: "Issued",   value: new Date(rx.issueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
                ].map(row => (
                  <div key={row.label} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                      <row.icon size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{row.label}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 truncate">{row.value}</p>
                  </div>
                ))}
              </div>

              {/* Medications */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Pill size={11} /> Medications ({rx.medications.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {rx.medications.map(m => (
                    <span key={m} className="text-xs bg-green-50 border border-green-200 text-green-700 px-2.5 py-1 rounded-full font-semibold">{m}</span>
                  ))}
                </div>
              </div>

              {rx.notes && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3">
                  <p className="text-xs font-bold text-yellow-700 mb-0.5 flex items-center gap-1.5"><MessageSquare size={10} />Patient Notes</p>
                  <p className="text-xs text-yellow-700">{rx.notes}</p>
                </div>
              )}

              {/* Verify / Reject toggle */}
              {(rx.status === "pending" || rx.status === "under_review") && (
                <>
                  <div className="flex gap-2">
                    <button onClick={() => setAction("approve")} className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all border-2", action === "approve" ? "bg-green-500 text-white border-green-500" : "border-green-200 text-green-700 hover:bg-green-50")}>
                      <CheckCircle size={15} /> Approve
                    </button>
                    <button onClick={() => setAction("reject")} className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all border-2", action === "reject" ? "bg-red-500 text-white border-red-500" : "border-red-200 text-red-600 hover:bg-red-50")}>
                      <XCircle size={15} /> Reject
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {action === "approve" && (
                      <motion.div key="approve" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Pharmacist Notes (optional)</label>
                          <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            rows={3}
                            placeholder="Verification notes, special instructions, dosage reminders…"
                            className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:border-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition-all resize-none"
                          />
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-100 rounded-xl">
                          <Shield size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-green-700">A unique verification code will be generated and emailed to the patient upon approval.</p>
                        </div>
                        <motion.button
                          onClick={handleApprove}
                          disabled={loading}
                          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-black shadow-lg disabled:opacity-70"
                          whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: 0.98 }}
                        >
                          {loading ? <><Loader2 size={16} className="animate-spin" /> Verifying…</> : <><CheckCircle size={16} /> Verify Prescription</>}
                        </motion.button>
                      </motion.div>
                    )}

                    {action === "reject" && (
                      <motion.div key="reject" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Rejection Reason <span className="text-red-500">*</span></label>
                          <div className="space-y-1.5">
                            {REJECT_REASONS.map(r => (
                              <button
                                key={r}
                                onClick={() => setReason(r)}
                                className={cn(
                                  "w-full text-left text-xs p-2.5 rounded-xl border transition-all",
                                  reason === r ? "border-red-400 bg-red-50 text-red-700 font-semibold" : "border-gray-100 hover:border-gray-200 text-gray-600 bg-gray-50"
                                )}
                              >
                                {r}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Additional Details (optional)</label>
                          <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            rows={2}
                            placeholder="Explain what the patient needs to do…"
                            className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:border-red-400 outline-none text-sm bg-gray-50 focus:bg-white transition-all resize-none"
                          />
                        </div>
                        <motion.button
                          onClick={handleReject}
                          disabled={loading || !reason}
                          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-black shadow-lg disabled:opacity-50"
                          whileHover={{ scale: loading || !reason ? 1 : 1.01 }} whileTap={{ scale: 0.98 }}
                        >
                          {loading ? <><Loader2 size={16} className="animate-spin" /> Processing…</> : <><XCircle size={16} /> Reject Prescription</>}
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {/* Already reviewed */}
              {(rx.status === "verified" || rx.status === "rejected") && (
                <div className={cn("rounded-2xl p-4 border", rx.status === "verified" ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100")}>
                  <p className={cn("text-sm font-bold mb-1", rx.status === "verified" ? "text-green-700" : "text-red-700")}>
                    {rx.status === "verified" ? "✓ Already Verified" : "✗ Already Rejected"}
                  </p>
                  {rx.verificationCode && <p className="text-xs font-mono text-green-600 font-black">{rx.verificationCode}</p>}
                  {rx.rejectionReason && <p className="text-xs text-red-600">{rx.rejectionReason}</p>}
                  {rx.reviewNotes && <p className="text-xs text-green-600 mt-1">{rx.reviewNotes}</p>}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main page ── */
type TabKey = "all" | RxStatus;
const TABS: { key: TabKey; label: string }[] = [
  { key: "all",          label: "All"          },
  { key: "under_review", label: "Needs Review" },
  { key: "pending",      label: "Pending"      },
  { key: "verified",     label: "Verified"     },
  { key: "rejected",     label: "Rejected"     },
];

export default function AdminPrescriptionsPage() {
  const { prescriptions } = usePrescriptions();
  const [tab, setTab]         = useState<TabKey>("under_review");
  const [search, setSearch]   = useState("");
  const [selected, setSelected] = useState<Prescription | null>(null);

  const filtered = useMemo(() => {
    let list = prescriptions;
    if (tab !== "all") list = list.filter(r => r.status === tab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r => r.patientName.toLowerCase().includes(q) || r.doctorName.toLowerCase().includes(q) || r.id.toLowerCase().includes(q));
    }
    return list;
  }, [prescriptions, tab, search]);

  const counts: Record<TabKey, number> = {
    all:          prescriptions.length,
    under_review: prescriptions.filter(r => r.status === "under_review").length,
    pending:      prescriptions.filter(r => r.status === "pending").length,
    verified:     prescriptions.filter(r => r.status === "verified").length,
    rejected:     prescriptions.filter(r => r.status === "rejected").length,
  };

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Prescription Queue</h1>
          <p className="text-sm text-gray-500">{counts.under_review} awaiting review · {counts.pending} pending upload</p>
        </div>
        {counts.under_review > 0 && (
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-xs font-bold text-orange-700">{counts.under_review} need review</span>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total",        value: counts.all,          color: "text-gray-600",   bg: "bg-gray-50",    icon: FileText     },
          { label: "Needs Review", value: counts.under_review, color: "text-orange-700", bg: "bg-orange-50",  icon: Clock        },
          { label: "Verified",     value: counts.verified,     color: "text-green-700",  bg: "bg-green-50",   icon: CheckCircle  },
          { label: "Rejected",     value: counts.rejected,     color: "text-red-700",    bg: "bg-red-50",     icon: XCircle      },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3"
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", s.bg)}>
              <s.icon size={18} className={s.color} />
            </div>
            <div>
              <p className="text-xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tabs + search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100">
          <div className="flex overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "relative px-4 py-4 text-sm font-semibold whitespace-nowrap transition-colors flex-shrink-0 flex items-center gap-1.5",
                  tab === t.key ? "text-green-600" : "text-gray-400 hover:text-gray-600"
                )}
              >
                {t.label}
                {counts[t.key] > 0 && (
                  <span className={cn("text-[10px] font-black px-1.5 py-0.5 rounded-full", tab === t.key ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>
                    {counts[t.key]}
                  </span>
                )}
                {tab === t.key && <motion.div layoutId="rx-admin-tab" className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-green-500" />}
              </button>
            ))}
          </div>
          <div className="p-3 border-t sm:border-t-0 border-gray-50">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search patient, doctor, ID…"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-100 focus:border-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/70">
              <tr>
                {["Prescription", "Patient", "Doctor / Hospital", "Medications", "Uploaded", "Status", "Action"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {filtered.map((rx, i) => {
                  const sc = STATUS_CFG[rx.status];
                  return (
                    <motion.tr
                      key={rx.id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Rx ID + preview */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                            {rx.filePreview?.startsWith("data:image")
                              ? <img src={rx.filePreview} alt="" className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center"><FileText size={18} className="text-red-400" /></div>
                            }
                          </div>
                          <div>
                            <p className="font-mono text-xs text-green-600 font-bold">{rx.id.slice(0, 12)}…</p>
                            <p className="text-[10px] text-gray-400">{rx.fileName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-800 text-sm">{rx.patientName}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-800 text-xs">{rx.doctorName}</p>
                        <p className="text-gray-400 text-[10px] truncate max-w-[140px]">{rx.hospital}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {rx.medications.slice(0, 2).map(m => (
                            <span key={m} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{m.split(" ")[0]}</span>
                          ))}
                          {rx.medications.length > 2 && <span className="text-[10px] text-gray-400">+{rx.medications.length - 2}</span>}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                        {new Date(rx.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn("flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border w-fit", sc.bg, sc.color, sc.border)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", sc.dot, rx.status === "under_review" && "animate-pulse")} />
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <motion.button
                          onClick={() => setSelected(rx)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all",
                            (rx.status === "pending" || rx.status === "under_review")
                              ? "bg-green-50 text-green-700 hover:bg-green-100"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          )}
                          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        >
                          <Eye size={12} />
                          {(rx.status === "pending" || rx.status === "under_review") ? "Review" : "View"}
                        </motion.button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle size={36} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">
                {tab === "under_review" ? "All caught up! No prescriptions need review." : "No records found."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Review drawer */}
      <AnimatePresence>
        {selected && (
          <ReviewDrawer rx={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
