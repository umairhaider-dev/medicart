"use client";
import { motion } from "framer-motion";
import { Users, Mail, Phone, Shield, Star, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_USERS = [
  { id:"u-001", name:"Alex Johnson", email:"alex@email.com", phone:"+1 555-0101", tier:"Gold",     orders:12, spent:684.20, joined:"Jan 2024", status:"Active"   },
  { id:"u-002", name:"Sarah Miller", email:"sarah@email.com",phone:"+1 555-0202", tier:"Silver",   orders:5,  spent:312.50, joined:"Mar 2024", status:"Active"   },
  { id:"u-003", name:"Raj Patel",    email:"raj@email.com",  phone:"+1 555-0303", tier:"Platinum", orders:34, spent:2841.0, joined:"Aug 2023", status:"Active"   },
  { id:"u-004", name:"Emma Roberts", email:"emma@email.com", phone:"+1 555-0404", tier:"Gold",     orders:18, spent:1122.4, joined:"Nov 2023", status:"Active"   },
  { id:"u-005", name:"Chris Wong",   email:"chris@email.com",phone:"+1 555-0505", tier:"Silver",   orders:3,  spent:89.94,  joined:"Apr 2025", status:"Active"   },
  { id:"u-006", name:"Priya Sharma", email:"priya@email.com",phone:"+1 555-0606", tier:"Gold",     orders:9,  spent:521.73, joined:"Feb 2024", status:"Inactive" },
  { id:"u-007", name:"James Brown",  email:"james@email.com",phone:"+1 555-0707", tier:"Silver",   orders:2,  spent:34.99,  joined:"Apr 2025", status:"Blocked"  },
  { id:"u-008", name:"Lily Chen",    email:"lily@email.com", phone:"+1 555-0808", tier:"Gold",     orders:15, spent:889.50, joined:"Oct 2023", status:"Active"   },
];

const TIER_COLOR: Record<string, string> = {
  Silver:"bg-gray-100 text-gray-700", Gold:"bg-yellow-100 text-yellow-700", Platinum:"bg-purple-100 text-purple-700"
};
const STATUS_COLOR: Record<string, string> = {
  Active:"bg-green-100 text-green-700", Inactive:"bg-gray-100 text-gray-500", Blocked:"bg-red-100 text-red-600"
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-5 max-w-7xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Users</h1>
        <p className="text-sm text-gray-500">{MOCK_USERS.length} registered users</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon:Users,      label:"Total Users",   value:"2,841", color:"text-green-600",  bg:"bg-green-50"  },
          { icon:Star,       label:"Gold+ Members", value:"892",   color:"text-yellow-600", bg:"bg-yellow-50" },
          { icon:ShoppingBag,label:"Avg Orders",    value:"7.4",   color:"text-blue-600",   bg:"bg-blue-50"   },
          { icon:Shield,     label:"Active Today",  value:"142",   color:"text-purple-600", bg:"bg-purple-50" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
            className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
          >
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", s.bg)}>
              <s.icon size={16} className={s.color} />
            </div>
            <p className="text-xl font-black text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 font-medium">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/70 border-b border-gray-100">
              <tr>
                {["User","Contact","Tier","Orders","Spent","Joined","Status","Actions"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_USERS.map((u, i) => (
                <motion.tr key={u.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.05 }} className="hover:bg-gray-50/60">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                        {u.name[0]}
                      </div>
                      <p className="font-semibold text-gray-800 text-sm">{u.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500"><Mail size={10} />{u.email}</div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400"><Phone size={10} />{u.phone}</div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", TIER_COLOR[u.tier])}>{u.tier}</span></td>
                  <td className="px-5 py-3.5 font-bold text-gray-900 text-sm">{u.orders}</td>
                  <td className="px-5 py-3.5 font-bold text-gray-900 text-sm">${u.spent.toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-400">{u.joined}</td>
                  <td className="px-5 py-3.5"><span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", STATUS_COLOR[u.status])}>{u.status}</span></td>
                  <td className="px-5 py-3.5">
                    <button className="text-xs text-green-600 hover:text-green-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors">View</button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
