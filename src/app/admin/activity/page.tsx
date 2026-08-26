"use client";

import { useState, useEffect } from "react";
import { Activity, Inbox } from "lucide-react";

interface AdminActivity {
  id: string;
  action: string;
  details: string;
  admin: string;
  time: string;
}

const ACTION_COLORS: Record<string, string> = {
  "create_product": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "update_product": "bg-blue-50 text-blue-700 border-blue-200",
  "delete_product": "bg-rose-50 text-rose-700 border-rose-200",
  "create_promo": "bg-purple-50 text-purple-700 border-purple-200",
  "update_settings": "bg-amber-50 text-amber-700 border-amber-200",
};

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/activity");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Failed to load activity logs:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
          Activity Audit Log
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
          Live chronological record of administrator actions, catalog changes, and settings modifications from database
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/70 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                <th className="px-5 py-3.5">Action</th>
                <th className="px-4 py-3.5">Details</th>
                <th className="px-4 py-3.5">Administrator</th>
                <th className="px-5 py-3.5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-neutral-400">
                    Loading activity records from database...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="space-y-2">
                      <Activity className="h-6 w-6 text-neutral-300 mx-auto" />
                      <p className="text-xs text-neutral-500 font-medium">No activity logged in database yet.</p>
                      <p className="text-[11px] text-neutral-400">Admin operations and store events will be recorded here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                          ACTION_COLORS[log.action] || "bg-neutral-100 text-neutral-700 border-neutral-200"
                        }`}
                      >
                        {log.action.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-neutral-900">{log.details}</td>
                    <td className="px-4 py-3.5 text-neutral-600 font-medium">{log.admin}</td>
                    <td className="px-5 py-3.5 text-right text-neutral-400 font-mono">{log.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
