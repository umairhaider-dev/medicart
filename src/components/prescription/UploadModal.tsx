"use client";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Upload, FileText, CheckCircle, AlertTriangle,
  ChevronRight, ChevronLeft, Image, Pill, Plus,
  Loader2, Shield, Clock, Tag, Trash2
} from "lucide-react";
import { usePrescriptions } from "@/store/prescriptionStore";
import { useAuth } from "@/store/authStore";
import { cn } from "@/lib/utils";

type UploadStep = "upload" | "details" | "review" | "success";

interface FormData {
  patientName: string;
  doctorName: string;
  hospital: string;
  issueDate: string;
  medications: string[];
  notes: string;
}

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_MB   = 10;

/* ── Step indicator ── */
const STEPS = [
  { key: "upload",  label: "Upload"  },
  { key: "details", label: "Details" },
  { key: "review",  label: "Review"  },
  { key: "success", label: "Done"    },
] as const;

function StepDots({ current }: { current: UploadStep }) {
  const idx = STEPS.findIndex(s => s.key === current);
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {STEPS.map((s, i) => (
        <div key={s.key} className="flex items-center gap-2">
          <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300",
            i < idx  ? "bg-green-500 text-white"  :
            i === idx? "bg-green-500 text-white ring-4 ring-green-100" :
                       "bg-gray-100 text-gray-400"
          )}>
            {i < idx ? <CheckCircle size={12} /> : i + 1}
          </div>
          {i < STEPS.length - 1 && <div className={cn("w-8 h-0.5 rounded-full transition-all duration-500", i < idx ? "bg-green-400" : "bg-gray-200")} />}
        </div>
      ))}
    </div>
  );
}

/* ── Medication tag input ── */
function MedTagInput({ meds, onChange }: { meds: string[]; onChange: (m: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => {
    const val = input.trim();
    if (val && !meds.includes(val)) { onChange([...meds, val]); setInput(""); }
  };
  const remove = (m: string) => onChange(meds.filter(x => x !== m));
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="e.g. Paracetamol 500mg"
          className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:border-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition-all"
        />
        <button type="button" onClick={add} className="px-3 py-2.5 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors flex-shrink-0">
          <Plus size={16} />
        </button>
      </div>
      {meds.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {meds.map(m => (
            <span key={m} className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              <Pill size={10} /> {m}
              <button onClick={() => remove(m)} className="hover:text-red-500 transition-colors ml-0.5"><X size={10} /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── File preview ── */
function FilePreview({ file, preview, onRemove }: { file: File; preview: string; onRemove: () => void }) {
  const isImage = file.type.startsWith("image/");
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative rounded-2xl overflow-hidden border-2 border-green-300 bg-gray-50">
      {isImage ? (
        <img src={preview} alt="Prescription preview" className="w-full h-48 object-cover" />
      ) : (
        <div className="h-48 flex flex-col items-center justify-center gap-3">
          <FileText size={48} className="text-red-500" />
          <div className="text-center">
            <p className="font-bold text-gray-800 text-sm">{file.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">PDF Document · {(file.size / 1024 / 1024).toFixed(1)} MB</p>
          </div>
        </div>
      )}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors"
      >
        <Trash2 size={14} />
      </button>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
        <p className="text-white text-xs font-semibold truncate">{file.name}</p>
        <p className="text-white/70 text-[10px]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
      </div>
    </motion.div>
  );
}

/* ── Main modal ── */
export default function UploadModal({ onClose, onSuccess }: { onClose: () => void; onSuccess?: (id: string) => void }) {
  const { upload } = usePrescriptions();
  const { user }   = useAuth();

  const [step, setStep]       = useState<UploadStep>("upload");
  const [file, setFile]       = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<FormData>({
    patientName: user?.name ?? "",
    doctorName: "",
    hospital: "",
    issueDate: "",
    medications: [],
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<FormData & { file: string }>>({});

  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = (f: File) => {
    setFileError("");
    if (!ACCEPTED.includes(f.type)) { setFileError("Only JPG, PNG, WEBP, or PDF files are accepted."); return; }
    if (f.size > MAX_MB * 1024 * 1024) { setFileError(`File must be smaller than ${MAX_MB} MB.`); return; }
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string ?? "");
    reader.readAsDataURL(f);
    setFile(f);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setField = (k: keyof FormData) => (val: string) => setForm(f => ({ ...f, [k]: val }));

  const validateDetails = () => {
    const e: typeof errors = {};
    if (!form.patientName.trim()) e.patientName = "Required";
    if (!form.doctorName.trim())  e.doctorName  = "Required";
    if (!form.hospital.trim())    e.hospital    = "Required";
    if (!form.issueDate)          e.issueDate   = "Required";
    if (form.medications.length === 0) e.medications = "Add at least one medication" as any;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1600));
    const id = upload({
      ...form,
      fileName: file?.name ?? "prescription.jpg",
      filePreview: preview,
    });
    setSubmitting(false);
    setStep("success");
    onSuccess?.(id);
  };

  const INPUT_CLS = "w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:border-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition-all";

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 28, stiffness: 350 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="font-black text-gray-900">Upload Prescription</h2>
            <p className="text-xs text-gray-400 mt-0.5">Secure · Pharmacist Verified · 24hr Review</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"><X size={18} /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <StepDots current={step} />

          <AnimatePresence mode="wait">
            {/* ── STEP 1: Upload ── */}
            {step === "upload" && (
              <motion.div key="upload" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="text-center mb-2">
                  <h3 className="font-bold text-gray-900">Upload your prescription</h3>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP or PDF · Max {MAX_MB}MB</p>
                </div>

                {file ? (
                  <FilePreview file={file} preview={preview} onRemove={() => { setFile(null); setPreview(""); }} />
                ) : (
                  <motion.div
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    animate={{ scale: dragOver ? 1.02 : 1, borderColor: dragOver ? "#10b981" : "#e5e7eb" }}
                    className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer hover:border-green-300 hover:bg-green-50/30 transition-all"
                    onClick={() => inputRef.current?.click()}
                  >
                    <motion.div animate={{ y: dragOver ? -6 : 0 }} className="flex flex-col items-center gap-3">
                      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-all", dragOver ? "bg-green-100" : "bg-gray-100")}>
                        {dragOver ? <Upload size={28} className="text-green-500" /> : <Image size={28} className="text-gray-400" />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-700">{dragOver ? "Release to upload" : "Drag & drop here"}</p>
                        <p className="text-sm text-gray-400 mt-0.5">or <span className="text-green-600 font-semibold">click to browse</span></p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                <input ref={inputRef} type="file" accept={ACCEPTED.join(",")} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }} />

                {fileError && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                    <AlertTriangle size={14} className="flex-shrink-0" /> {fileError}
                  </motion.div>
                )}

                {/* Tips */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-bold text-blue-800 flex items-center gap-1.5"><Shield size={12} /> Tips for a successful upload</p>
                  {["Ensure all text is clearly legible", "Include the doctor's signature and stamp", "Date of issue must be visible", "Prescription must be dated within 6 months"].map(tip => (
                    <p key={tip} className="text-[11px] text-blue-600 flex items-center gap-1.5"><CheckCircle size={9} className="flex-shrink-0" /> {tip}</p>
                  ))}
                </div>

                <motion.button
                  onClick={() => { if (!file) { setFileError("Please upload a prescription file."); return; } setStep("details"); }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold shadow-lg transition-all"
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                >
                  Continue <ChevronRight size={16} />
                </motion.button>
              </motion.div>
            )}

            {/* ── STEP 2: Details ── */}
            {step === "details" && (
              <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="text-center mb-2">
                  <h3 className="font-bold text-gray-900">Prescription details</h3>
                  <p className="text-xs text-gray-400 mt-1">This helps our pharmacists verify quickly</p>
                </div>

                {[
                  { label: "Patient Name",   key: "patientName" as const, placeholder: "Full name as on prescription" },
                  { label: "Doctor's Name",  key: "doctorName"  as const, placeholder: "Dr. First Last"               },
                  { label: "Hospital / Clinic", key: "hospital" as const, placeholder: "Hospital or clinic name"       },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">{f.label}</label>
                    <input
                      value={form[f.key] as string}
                      onChange={e => setField(f.key)(e.target.value)}
                      placeholder={f.placeholder}
                      className={cn(INPUT_CLS, errors[f.key] && "border-red-300")}
                    />
                    {errors[f.key] && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertTriangle size={10} />{errors[f.key]}</p>}
                  </div>
                ))}

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Date of Issue</label>
                  <input
                    type="date"
                    value={form.issueDate}
                    onChange={e => setField("issueDate")(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className={cn(INPUT_CLS, errors.issueDate && "border-red-300")}
                  />
                  {errors.issueDate && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertTriangle size={10} />{errors.issueDate}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Medications Listed</label>
                  <MedTagInput meds={form.medications} onChange={m => setForm(f => ({ ...f, medications: m }))} />
                  {(errors as any).medications && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertTriangle size={10} />{(errors as any).medications}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Notes for Pharmacist <span className="normal-case text-gray-400 font-normal">(optional)</span></label>
                  <textarea
                    value={form.notes}
                    onChange={e => setField("notes")(e.target.value)}
                    rows={2}
                    placeholder="Any additional notes, urgency, special instructions…"
                    className={cn(INPUT_CLS, "resize-none")}
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <button onClick={() => setStep("upload")} className="flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">
                    <ChevronLeft size={15} /> Back
                  </button>
                  <motion.button
                    onClick={() => { if (validateDetails()) setStep("review"); }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold shadow-lg transition-all"
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  >
                    Review & Submit <ChevronRight size={16} />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Review ── */}
            {step === "review" && (
              <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="text-center mb-2">
                  <h3 className="font-bold text-gray-900">Review before submitting</h3>
                  <p className="text-xs text-gray-400 mt-1">Confirm all details are correct</p>
                </div>

                {/* File thumbnail */}
                {preview && (
                  <div className="relative h-36 rounded-2xl overflow-hidden bg-gray-100">
                    {file?.type.startsWith("image/") ? (
                      <img src={preview} alt="Rx preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center gap-2">
                        <FileText size={32} className="text-red-500" />
                        <p className="text-sm font-semibold text-gray-700">{file?.name}</p>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-2">
                      <span className="text-white text-xs font-semibold">{file?.name}</span>
                    </div>
                  </div>
                )}

                {/* Summary table */}
                <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                  {[
                    { label: "Patient",  value: form.patientName },
                    { label: "Doctor",   value: `Dr. ${form.doctorName}` },
                    { label: "Hospital", value: form.hospital },
                    { label: "Issued",   value: new Date(form.issueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between text-sm">
                      <span className="text-gray-400 font-medium">{row.label}</span>
                      <span className="font-semibold text-gray-800 text-right max-w-[60%] truncate">{row.value}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Medications</p>
                    <div className="flex flex-wrap gap-1.5">
                      {form.medications.map(m => (
                        <span key={m} className="text-[11px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">{m}</span>
                      ))}
                    </div>
                  </div>
                  {form.notes && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Notes</p>
                      <p className="text-xs text-gray-600">{form.notes}</p>
                    </div>
                  )}
                </div>

                {/* What happens next */}
                <div className="bg-green-50 border border-green-100 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-bold text-green-800">What happens next?</p>
                  {[
                    { icon: Clock,        text: "Our pharmacist will review within 24 hours" },
                    { icon: Shield,       text: "We verify the prescription against our database" },
                    { icon: CheckCircle,  text: "You'll receive an email once verified" },
                  ].map(item => (
                    <div key={item.text} className="flex items-center gap-2">
                      <item.icon size={12} className="text-green-600 flex-shrink-0" />
                      <p className="text-[11px] text-green-700">{item.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep("details")} className="flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">
                    <ChevronLeft size={15} /> Back
                  </button>
                  <motion.button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold shadow-lg disabled:opacity-80 transition-all"
                    whileHover={{ scale: submitting ? 1 : 1.01 }} whileTap={{ scale: 0.98 }}
                  >
                    {submitting
                      ? <><Loader2 size={16} className="animate-spin" /> Submitting…</>
                      : <><Shield size={16} /> Submit Prescription</>
                    }
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 4: Success ── */}
            {step === "success" && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-5 py-2">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto"
                >
                  <CheckCircle size={40} className="text-green-500" />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                  <h3 className="text-xl font-black text-gray-900">Prescription Submitted!</h3>
                  <p className="text-sm text-gray-500 mt-1">Our pharmacist team will review it within 24 hours.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-100 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                    <span className="text-sm font-bold text-orange-700">Under Review</span>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { step: 1, label: "Uploaded",           done: true  },
                      { step: 2, label: "Pharmacist Review",  done: false },
                      { step: 3, label: "Verified",           done: false },
                    ].map(s => (
                      <div key={s.step} className="flex items-center gap-3">
                        <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0", s.done ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400")}>
                          {s.done ? "✓" : s.step}
                        </div>
                        <span className={cn("text-sm", s.done ? "text-green-700 font-semibold" : "text-gray-400")}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="space-y-2">
                  <p className="text-xs text-gray-400">You'll receive an email notification at</p>
                  <p className="text-sm font-semibold text-gray-700">{user?.email ?? "your email"}</p>
                </motion.div>

                <motion.button
                  onClick={onClose}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold shadow-lg transition-all"
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                >
                  View My Prescriptions
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
