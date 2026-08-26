"use client";

import { useState } from "react";
import { Search, Users, MessageSquare } from "lucide-react";

const SAMPLE_CUSTOMERS = [
  { phone: "+974 5512 3456", name: "Rashid Al-Kuwari", orders: 5, totalSpend: 590, lastOrder: "10m ago" },
  { phone: "+974 6623 4567", name: "Fatima Al-Thani", orders: 3, totalSpend: 380, lastOrder: "45m ago" },
  { phone: "+974 7734 5678", name: "Mohammed Hassan", orders: 8, totalSpend: 920, lastOrder: "2h ago" },
  { phone: "+974 5545 6789", name: "Sara Al-Attiyah", orders: 2, totalSpend: 245, lastOrder: "3h ago" },
  { phone: "+974 3356 7890", name: "Hamad Al-Marri", orders: 4, totalSpend: 460, lastOrder: "5h ago" },
];

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");

  const filtered = SAMPLE_CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
          Client Directory
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
          View customer order histories, lifetime spend, and WhatsApp communication records
        </p>
      </div>

      <div className="relative max-w-sm w-full">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by client name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-xs text-neutral-950 placeholder:text-neutral-400 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950/20 transition-all shadow-2xs"
        />
      </div>

      <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/70 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                <th className="px-5 py-3.5">Client</th>
                <th className="px-4 py-3.5">Phone Number</th>
                <th className="px-4 py-3.5">Orders</th>
                <th className="px-4 py-3.5">Lifetime Spend</th>
                <th className="px-4 py-3.5">Last Order</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs">
              {filtered.map((customer) => (
                <tr key={customer.phone} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-neutral-950">{customer.name}</td>
                  <td className="px-4 py-3.5 text-neutral-600 font-mono font-medium">{customer.phone}</td>
                  <td className="px-4 py-3.5 text-neutral-600 font-mono">{customer.orders} orders</td>
                  <td className="px-4 py-3.5 font-bold text-neutral-950">QR {customer.totalSpend.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-neutral-500 font-medium">{customer.lastOrder}</td>
                  <td className="px-5 py-3.5 text-right">
                    <a
                      href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-colors shadow-2xs"
                    >
                      <MessageSquare className="h-3 w-3" />
                      <span>WhatsApp</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
