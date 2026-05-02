"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Save, CheckCircle } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ storeName:"MediCart", email:"admin@medicart.com", currency:"USD", taxRate:"8.5", freeShippingThreshold:"49", maintenanceMode: false });

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-black text-gray-900">Settings</h1>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="font-bold text-gray-900">Store Configuration</h2>
        {[
          { label:"Store Name",               key:"storeName" as const },
          { label:"Admin Email",              key:"email" as const },
          { label:"Currency",                 key:"currency" as const },
          { label:"Tax Rate (%)",             key:"taxRate" as const },
          { label:"Free Shipping Threshold",  key:"freeShippingThreshold" as const },
        ].map((f) => (
          <div key={f.key}>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">{f.label}</label>
            <input
              value={form[f.key]}
              onChange={(e) => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 focus:border-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition-all"
            />
          </div>
        ))}

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="font-semibold text-sm text-gray-800">Maintenance Mode</p>
            <p className="text-xs text-gray-400">Disables the storefront for customers</p>
          </div>
          <button
            onClick={() => setForm(f => ({ ...f, maintenanceMode: !f.maintenanceMode }))}
            className={`w-12 h-6 rounded-full transition-all duration-300 relative ${form.maintenanceMode ? "bg-orange-500" : "bg-gray-200"}`}
          >
            <motion.div animate={{ x: form.maintenanceMode ? 24 : 2 }} transition={{ type:"spring", stiffness:500, damping:30 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
          </button>
        </div>

        <motion.button onClick={save} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-sm" whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
          {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> Save Settings</>}
        </motion.button>
      </div>
    </div>
  );
}
