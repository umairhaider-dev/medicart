"use client";
import { motion } from "framer-motion";
import { TrendingUp, BarChart2, Users, DollarSign } from "lucide-react";

export default function AdminAnalyticsPage() {
  const metrics = [
    { label: "Avg Order Value",    value: "$58.40",  change: "+4.2%",  up: true  },
    { label: "Conversion Rate",    value: "3.8%",    change: "+0.6%",  up: true  },
    { label: "Repeat Customers",   value: "68%",     change: "+2.1%",  up: true  },
    { label: "Cart Abandonment",   value: "34%",     change: "-5.3%",  up: true  },
    { label: "New Users / Day",    value: "48",      change: "+12.0%", up: true  },
    { label: "Customer Lifetime",  value: "$420",    change: "-1.2%",  up: false },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500">Key performance indicators — last 30 days</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
          >
            <p className="text-xs text-gray-400 font-medium mb-2">{m.label}</p>
            <p className="text-2xl font-black text-gray-900">{m.value}</p>
            <span className={`text-xs font-bold ${m.up ? "text-green-600" : "text-red-500"}`}>{m.change} vs last month</span>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
        <BarChart2 size={48} className="text-gray-200 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">Detailed analytics charts</p>
        <p className="text-gray-400 text-sm mt-1">Connect to a real analytics provider (e.g., PostHog, Mixpanel, Google Analytics) for full insights.</p>
      </div>
    </div>
  );
}
