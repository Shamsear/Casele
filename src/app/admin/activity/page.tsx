"use client";

const SAMPLE_ACTIVITY = [
  { id: "1", action: "Created product", details: "Midnight Black Premium Case", admin: "Admin", time: "2m ago" },
  { id: "2", action: "Updated order", details: "ORD-248 → Confirmed", admin: "Admin", time: "5m ago" },
  { id: "3", action: "Created promo code", details: "WELCOME10 (10% off)", admin: "Admin", time: "1h ago" },
  { id: "4", action: "Updated settings", details: "WhatsApp number changed", admin: "Admin", time: "2h ago" },
  { id: "5", action: "Deleted product", details: "Old Case Model X", admin: "Admin", time: "3h ago" },
];

const ACTION_COLORS: Record<string, string> = {
  "Created product": "bg-emerald-500/10 text-emerald-400",
  "Updated order": "bg-blue-500/10 text-blue-400",
  "Created promo code": "bg-purple-500/10 text-purple-400",
  "Updated settings": "bg-amber-500/10 text-amber-400",
  "Deleted product": "bg-red-500/10 text-red-400",
};

export default function AdminActivityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-h1 font-bold text-white">Activity Log</h1>
        <p className="mt-1 text-warm-gray">Track all admin actions</p>
      </div>

      <div className="rounded-xl border border-dark-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border bg-dark-surface">
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Action</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Details</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Admin</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Time</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_ACTIVITY.map((log) => (
              <tr key={log.id} className="border-b border-dark-border/50 hover:bg-dark-surface/50">
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ACTION_COLORS[log.action] || "bg-dark-surface text-warm-gray"}`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-white">{log.details}</td>
                <td className="px-4 py-3 text-sm text-warm-gray">{log.admin}</td>
                <td className="px-4 py-3 text-sm text-warm-gray">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
