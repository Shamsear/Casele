"use client";

import { useState, useEffect } from "react";
import { AdminTableSkeleton } from "@/components/admin/admin-skeletons";
import { Search, Users, MessageSquare, Inbox } from "lucide-react";

interface AdminCustomer {
  phone: string;
  name: string;
  orders: number;
  totalSpend: number;
  lastOrder: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/customers");
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      }
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter(
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
          Verified customer profiles, purchase volume, and order history aggregated from database
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

      {/* Table or Shimmer Skeleton */}
      {loading ? (
        <AdminTableSkeleton rows={5} cols={5} />
      ) : (
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
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="space-y-2">
                        <Users className="h-6 w-6 text-neutral-300 mx-auto" />
                        <p className="text-xs text-neutral-500 font-medium">No customer profiles in database yet.</p>
                        <p className="text-[11px] text-neutral-400">When shoppers complete orders, their profiles and spend history will automatically be logged here.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((customer) => (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
