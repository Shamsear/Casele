"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

const SAMPLE_CUSTOMERS = [
  { phone: "+974XXXXXXXX", name: "Mohammed A.", orders: 5, totalSpend: 459, lastOrder: "2h ago" },
  { phone: "+974XXXXXXXX", name: "Fatima K.", orders: 3, totalSpend: 149, lastOrder: "15m ago" },
  { phone: "+974XXXXXXXX", name: "Ahmed S.", orders: 8, totalSpend: 719, lastOrder: "1h ago" },
  { phone: "+974XXXXXXXX", name: "Sara M.", orders: 2, totalSpend: 159, lastOrder: "2h ago" },
  { phone: "+974XXXXXXXX", name: "Omar H.", orders: 6, totalSpend: 539, lastOrder: "3h ago" },
];

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");

  const filtered = SAMPLE_CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-h1 font-bold text-white">Customers</h1>
        <p className="mt-1 text-warm-gray">View customer order history by phone number</p>
      </div>

      <Input
        placeholder="Search by name or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <div className="rounded-xl border border-dark-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border bg-dark-surface">
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Orders</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Total Spend</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-warm-gray">Last Order</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer) => (
              <tr key={customer.phone} className="border-b border-dark-border/50 hover:bg-dark-surface/50">
                <td className="px-4 py-3 text-sm font-medium text-white">{customer.name}</td>
                <td className="px-4 py-3 text-sm text-warm-gray font-mono">{customer.phone}</td>
                <td className="px-4 py-3 text-sm text-warm-gray">{customer.orders}</td>
                <td className="px-4 py-3 text-sm font-medium text-gold">QR {customer.totalSpend.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-warm-gray">{customer.lastOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
