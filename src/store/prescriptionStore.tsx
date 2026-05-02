"use client";
import { createContext, useContext, useReducer, useEffect, useCallback } from "react";

export type RxStatus = "pending" | "under_review" | "verified" | "rejected";

export interface Prescription {
  id: string;
  patientName: string;
  doctorName: string;
  hospital: string;
  issueDate: string;
  medications: string[];
  notes: string;
  fileName: string;
  filePreview?: string;
  status: RxStatus;
  uploadedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  verificationCode?: string;
}

interface RxState {
  prescriptions: Prescription[];
}

type RxAction =
  | { type: "ADD";           payload: Prescription }
  | { type: "UPDATE_STATUS"; id: string; status: RxStatus; meta?: { reviewNotes?: string; rejectionReason?: string; verificationCode?: string } }
  | { type: "DELETE";        id: string }
  | { type: "HYDRATE";       payload: Prescription[] };

const DEMO_RX: Prescription[] = [
  {
    id: "rx-demo-001",
    patientName: "Alex Johnson",
    doctorName: "Dr. Priya Sharma",
    hospital: "Springfield General Hospital",
    issueDate: "2025-04-10",
    medications: ["Metformin 500mg", "Amlodipine 5mg", "Atorvastatin 10mg"],
    notes: "Take Metformin with meals. Follow up in 3 months.",
    fileName: "prescription_apr2025.jpg",
    status: "verified",
    uploadedAt: "2025-04-12T09:00:00Z",
    reviewedAt: "2025-04-12T14:32:00Z",
    reviewNotes: "All medications verified. Valid for 3 months.",
    verificationCode: "RX-VRF-7K2M",
  },
  {
    id: "rx-demo-002",
    patientName: "Alex Johnson",
    doctorName: "Dr. Rohit Verma",
    hospital: "City Wellness Clinic",
    issueDate: "2025-03-28",
    medications: ["Amoxicillin 500mg", "Pantoprazole 40mg"],
    notes: "Complete full antibiotic course.",
    fileName: "antibiotic_rx.pdf",
    status: "under_review",
    uploadedAt: "2025-04-20T11:15:00Z",
  },
  {
    id: "rx-demo-003",
    patientName: "Alex Johnson",
    doctorName: "Dr. Sarah Chen",
    hospital: "MedFirst Urgent Care",
    issueDate: "2025-02-15",
    medications: ["Ibuprofen 400mg"],
    notes: "7-day course only.",
    fileName: "urgent_care_rx.jpg",
    status: "rejected",
    uploadedAt: "2025-02-16T08:00:00Z",
    reviewedAt: "2025-02-16T16:45:00Z",
    rejectionReason: "Prescription image is partially obscured. Please re-upload a clear, fully visible copy.",
  },
];

function reducer(state: RxState, action: RxAction): RxState {
  switch (action.type) {
    case "HYDRATE":
      return { prescriptions: action.payload };
    case "ADD":
      return { prescriptions: [action.payload, ...state.prescriptions] };
    case "UPDATE_STATUS":
      return {
        prescriptions: state.prescriptions.map(rx =>
          rx.id === action.id
            ? { ...rx, status: action.status, reviewedAt: new Date().toISOString(), ...action.meta }
            : rx
        ),
      };
    case "DELETE":
      return { prescriptions: state.prescriptions.filter(rx => rx.id !== action.id) };
    default:
      return state;
  }
}

interface RxContextValue {
  prescriptions: Prescription[];
  upload: (rx: Omit<Prescription, "id" | "status" | "uploadedAt">) => string;
  updateStatus: (id: string, status: RxStatus, meta?: { reviewNotes?: string; rejectionReason?: string; verificationCode?: string }) => void;
  deletePrescription: (id: string) => void;
  getById: (id: string) => Prescription | undefined;
  pendingCount: number;
  verifiedCount: number;
}

const RxContext = createContext<RxContextValue | null>(null);
const STORAGE_KEY = "medicart_rx_v1";

export function PrescriptionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { prescriptions: DEMO_RX });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved: Prescription[] = JSON.parse(raw);
        // merge saved (non-demo) with demo, avoiding duplicates
        const ids = new Set(saved.map(r => r.id));
        const merged = [...saved, ...DEMO_RX.filter(d => !ids.has(d.id))];
        dispatch({ type: "HYDRATE", payload: merged });
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      // Don't persist the demo Rx that always re-load
      const toSave = state.prescriptions.filter(r => !r.id.startsWith("rx-demo-"));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch { /* ignore */ }
  }, [state.prescriptions]);

  const upload = useCallback((data: Omit<Prescription, "id" | "status" | "uploadedAt">): string => {
    const id = `rx-${Date.now()}`;
    const rx: Prescription = { ...data, id, status: "pending", uploadedAt: new Date().toISOString() };
    dispatch({ type: "ADD", payload: rx });

    // Simulate progression: pending → under_review after 3s (demo)
    setTimeout(() => {
      dispatch({ type: "UPDATE_STATUS", id, status: "under_review" });
    }, 3000);

    return id;
  }, []);

  const updateStatus = useCallback((id: string, status: RxStatus, meta?: { reviewNotes?: string; rejectionReason?: string; verificationCode?: string }) => {
    dispatch({ type: "UPDATE_STATUS", id, status, meta });
  }, []);

  const deletePrescription = useCallback((id: string) => {
    dispatch({ type: "DELETE", id });
  }, []);

  const getById = useCallback((id: string) => {
    return state.prescriptions.find(r => r.id === id);
  }, [state.prescriptions]);

  const pendingCount  = state.prescriptions.filter(r => r.status === "pending" || r.status === "under_review").length;
  const verifiedCount = state.prescriptions.filter(r => r.status === "verified").length;

  return (
    <RxContext.Provider value={{ prescriptions: state.prescriptions, upload, updateStatus, deletePrescription, getById, pendingCount, verifiedCount }}>
      {children}
    </RxContext.Provider>
  );
}

export function usePrescriptions() {
  const ctx = useContext(RxContext);
  if (!ctx) throw new Error("usePrescriptions must be used inside <PrescriptionProvider>");
  return ctx;
}
