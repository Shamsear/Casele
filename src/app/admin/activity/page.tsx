"use client";

import { Activity } from "lucide-react";

const SAMPLE_ACTIVITY = [
  { id: "1", action: "Created Product", details: "Titanium Armor MagSafe Case", admin: "Administrator", time: "2m ago" },
  { id: "2", action: "Updated Order", details: "ORD-9481 → Marked Delivered (The Pearl)", admin: "Administrator", time: "5m ago" },
  { id: "3", action: "Created Promo Code", details: "DOHA25 (25% off minimum QR 150)", admin: "Administrator", time: "1h ago" },
  { id: "4", action: "Updated Settings", details: "Announcement bar & Hero copy updated", admin: "Administrator", time: "2h ago" },
  { id: "5", action: "Created Phone Model", details: "iPhone 16 Pro Max added to catalog", admin: "Administrator", time: "3h ago" },
];

const ACTION_COLORS: Record<string, string> = {
  "Created Product": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Updated Order": "bg-blue-50 text-blue-700 border-blue-200",
  "Created Promo Code": "bg-purple-50 text-purple-700 border-purple-200",
  "Updated Settings": "bg-amber-50 text-amber-700 border-amber-200",
  "Created Phone Model": "bg-neutral-100 text-neutral-800 border-neutral-200",
};

export default function AdminActivityPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
          Activity Audit Log
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
          Chronological record of administrator actions, catalog changes, and fulfillment updates
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
              {SAMPLE_ACTIVITY.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                        ACTION_COLORS[log.action] || "bg-neutral-100 text-neutral-700 border-neutral-200"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-neutral-900">{log.details}</td>
                  <td className="px-4 py-3.5 text-neutral-600 font-medium">{log.admin}</td>
                  <td className="px-5 py-3.5 text-right text-neutral-400 font-mono">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
